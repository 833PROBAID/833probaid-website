import jwt from "jsonwebtoken";
import connectToDatabase from "../utils/db.js";
import {
	findUserByEmail,
	findSafeUserByEmail,
	markEmailVerified,
	recordLogin,
	upsertPendingUser,
	updateUserPassword,
	verifyPassword,
} from "./userService.js";
import { issueOtp, validateOtp } from "./otpService.js";
import {
	validateEmail,
	validateName,
	validatePassword,
	validateOtp as validateOtpCode,
} from "../utils/validation.js";

function getJwtSecret() {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not set");
	}
	return secret;
}

function buildAuthTokenPayload(user) {
	return {
		sub: String(user._id),
		email: user.email,
		roles: user.roles,
		pwd: user.passwordChangedAt
			? new Date(user.passwordChangedAt).getTime()
			: undefined,
	};
}

export async function registerUser({
	name,
	email,
	password,
	context,
}) {
	await connectToDatabase();

	const sanitizedEmail = validateEmail(email);
	const sanitizedName = validateName(name);
	const sanitizedPassword = validatePassword(password);

	const existingUser = await findSafeUserByEmail(sanitizedEmail);

	if (existingUser && existingUser.isEmailVerified) {
		throw new Error("An account with this email already exists");
	}

	const user = await upsertPendingUser({
		name: sanitizedName,
		email: sanitizedEmail,
		password: sanitizedPassword,
	});

	await issueOtp({
		user,
		action: "signup",
		templateData: { name: user.name },
		ipAddress: context.ip,
		userAgent: context.userAgent,
	});

	return {
		success: true,
		message: "Verification code sent to email",
		email: user.email,
	};
}

export async function startLogin({ email, password, context }) {
	await connectToDatabase();

	const sanitizedEmail = validateEmail(email);
	const sanitizedPassword = validatePassword(password);

	const user = await findUserByEmail(sanitizedEmail);

	if (!user) {
		throw new Error("Invalid email or password");
	}

	const isValidPassword = await verifyPassword(user, sanitizedPassword);

	if (!isValidPassword) {
		throw new Error("Invalid email or password");
	}

	if (!user.isEmailVerified) {
		throw new Error("Email address not verified");
	}

	await issueOtp({
		user,
		action: "login",
		templateData: { name: user.name },
		ipAddress: context.ip,
		userAgent: context.userAgent,
	});

	return {
		success: true,
		message: "Verification code sent",
		email: user.email,
	};
}

export async function completeVerification({ email, code, action }) {
	await connectToDatabase();

	const sanitizedEmail = validateEmail(email);
	const sanitizedCode = validateOtpCode(code);

	const user = await findSafeUserByEmail(sanitizedEmail);

	if (!user) {
		throw new Error("Account not found");
	}

	await validateOtp({ user, action, code: sanitizedCode });

	if (action === "signup" && !user.isEmailVerified) {
		await markEmailVerified(user._id);
	}

	await recordLogin(user._id);

	const token = jwt.sign(buildAuthTokenPayload(user), getJwtSecret(), {
		expiresIn: "7d",
	});

	return {
		success: true,
		token,
		user: {
			id: String(user._id),
			name: user.name,
			email: user.email,
			roles: user.roles,
			bio: user.bio || "",
			settings: {
				pushNotifications: user.settings?.pushNotifications ?? true,
				emailNotifications: user.settings?.emailNotifications ?? true,
			},
		},
	};
}

export async function initiatePasswordReset({ email, context }) {
	await connectToDatabase();

	const sanitizedEmail = validateEmail(email);
	const user = await findSafeUserByEmail(sanitizedEmail);

	if (!user || !user.isEmailVerified) {
		return {
			success: true,
			message: "If the account exists, we sent reset instructions.",
			email: sanitizedEmail,
		};
	}

	await issueOtp({
		user,
		action: "password_reset",
		templateData: { name: user.name },
		ipAddress: context.ip,
		userAgent: context.userAgent,
	});

	return {
		success: true,
		message: "If the account exists, we sent reset instructions.",
		email: sanitizedEmail,
	};
}

export async function completePasswordReset({ email, code, password }) {
	await connectToDatabase();

	const sanitizedEmail = validateEmail(email);
	const sanitizedCode = validateOtpCode(code);
	const sanitizedPassword = validatePassword(password);

	const user = await findSafeUserByEmail(sanitizedEmail);

	if (!user) {
		throw new Error("Invalid reset request");
	}

	await validateOtp({ user, action: "password_reset", code: sanitizedCode });

	await updateUserPassword(user._id, sanitizedPassword);
	await recordLogin(user._id);

	const refreshedUser = await findSafeUserByEmail(sanitizedEmail);

	const token = jwt.sign(buildAuthTokenPayload(refreshedUser), getJwtSecret(), {
		expiresIn: "7d",
	});

	return {
		success: true,
		message: "Password reset successfully.",
		token,
		user: {
			id: String(refreshedUser._id),
			name: refreshedUser.name,
			email: refreshedUser.email,
			roles: refreshedUser.roles,
			bio: refreshedUser.bio || "",
			settings: {
				pushNotifications: refreshedUser.settings?.pushNotifications ?? true,
				emailNotifications: refreshedUser.settings?.emailNotifications ?? true,
			},
		},
	};
}
