import crypto from "crypto";
import OtpToken from "../models/OtpToken.js";
import { sendOtpEmail } from "./emailService.js";

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

function createCode() {
	return crypto.randomInt(100000, 999999).toString();
}

function hashCode(code) {
	return crypto.createHash("sha256").update(code).digest("hex");
}

export async function issueOtp({
	user,
	action,
	templateData,
	ipAddress,
	userAgent,
}) {
	await OtpToken.deleteMany({ user: user._id, action });

	const code = createCode();
	const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

	await OtpToken.create({
		user: user._id,
		action,
		codeHash: hashCode(code),
		expiresAt,
		ipAddress,
		userAgent,
	});

	await sendOtpEmail({
		to: user.email,
		code,
		subject:
			action === "signup"
				? "Verify your email address"
				: action === "password_reset"
					? "Reset your password"
					: "Your login verification code",
		templateData: {
			...templateData,
			purpose:
				action === "signup"
					? "complete your account creation"
					: action === "password_reset"
						? "reset your account password"
						: "securely sign in",
		},
	});
}

export async function validateOtp({ user, action, code }) {
	const token = await OtpToken.findOne({
		user: user._id,
		action,
	}).select("codeHash attempts expiresAt");

	if (!token) {
		throw new Error("Verification code not found");
	}

	if (token.expiresAt < new Date()) {
		await token.deleteOne();
		throw new Error("Verification code expired");
	}

	if (token.attempts >= MAX_ATTEMPTS) {
		await token.deleteOne();
		throw new Error("Too many invalid attempts");
	}

	const isMatch = token.codeHash === hashCode(code);

	if (!isMatch) {
		token.attempts += 1;
		await token.save();
		throw new Error("Invalid verification code");
	}

	await token.deleteOne();
}
