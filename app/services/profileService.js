import {
	findUserById,
	findUserWithPasswordById,
	updateUserPassword,
	verifyPassword,
} from "./userService.js";
import {
	validateName,
	validateBio,
	validatePassword,
	validateBooleanFlag,
} from "../utils/validation.js";

function toProfileResponse(user) {
	return {
		id: String(user._id),
		name: user.name,
		email: user.email,
		roles: user.roles,
		bio: user.bio || "",
		settings: {
			pushNotifications: user.settings?.pushNotifications ?? true,
			emailNotifications: user.settings?.emailNotifications ?? true,
		},
	};
}

export async function getProfile(userId) {
	const user = await findUserById(userId);
	if (!user) {
		throw new Error("User not found");
	}
	return toProfileResponse(user);
}

export async function updateProfile({ userId, name, bio }) {
	const user = await findUserById(userId);
	if (!user) {
		throw new Error("User not found");
	}

	let hasChanges = false;

	if (name !== undefined) {
		user.name = validateName(name);
		hasChanges = true;
	}

	if (bio !== undefined) {
		user.bio = validateBio(bio);
		hasChanges = true;
	}

	if (!hasChanges) {
		throw new Error("No changes provided");
	}

	const updatedUser = await user.save();
	return toProfileResponse(updatedUser);
}

export async function changePassword({ userId, currentPassword, newPassword }) {
	if (!currentPassword || typeof currentPassword !== "string") {
		throw new Error("Current password is required");
	}

	const sanitizedNewPassword = validatePassword(newPassword);
	const user = await findUserWithPasswordById(userId);

	if (!user) {
		throw new Error("User not found");
	}

	const isValid = await verifyPassword(user, currentPassword);

	if (!isValid) {
		throw new Error("Current password is incorrect");
	}

	const updatedUser = await updateUserPassword(userId, sanitizedNewPassword);

	if (!updatedUser) {
		throw new Error("Unable to update password");
	}

	return toProfileResponse(updatedUser);
}

export async function updateSettings({ userId, pushNotifications, emailNotifications }) {
	const user = await findUserById(userId);
	if (!user) {
		throw new Error("User not found");
	}

	if (!user.settings) {
		user.settings = {
			pushNotifications: true,
			emailNotifications: true,
		};
	}

	let hasChanges = false;

	if (pushNotifications !== undefined) {
		user.settings.pushNotifications = validateBooleanFlag(
			pushNotifications,
			"Push notifications preference",
		);
		hasChanges = true;
	}

	if (emailNotifications !== undefined) {
		user.settings.emailNotifications = validateBooleanFlag(
			emailNotifications,
			"Email notifications preference",
		);
		hasChanges = true;
	}

	if (!hasChanges) {
		throw new Error("No changes provided");
	}

	const updatedUser = await user.save();
	return toProfileResponse(updatedUser);
}
