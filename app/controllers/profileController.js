import { NextResponse } from "next/server";
import { extractTokenFromRequest, verifyJwtToken } from "../utils/auth.js";
import {
	getProfile,
	updateProfile,
	changePassword,
	updateSettings,
} from "../services/profileService.js";

async function requireAuthenticatedUser(request) {
	const token = extractTokenFromRequest(request);
	const session = await verifyJwtToken(token);

	if (!session) {
		const error = new Error("Unauthorized");
		error.status = 401;
		throw error;
	}

	return session;
}

function createJsonResponse(payload, status = 200) {
	return NextResponse.json(payload, { status });
}

export async function handleGetProfile(request) {
	try {
		const session = await requireAuthenticatedUser(request);
		const user = await getProfile(session.id);
		return createJsonResponse({ success: true, user });
	} catch (error) {
		const status = error.status || 400;
		return createJsonResponse({ success: false, message: error.message }, status);
	}
}

export async function handleUpdateProfile(request) {
	try {
		const session = await requireAuthenticatedUser(request);
		const body = await request.json();
		const user = await updateProfile({
			userId: session.id,
			name: body.name,
			bio: body.bio,
		});
		return createJsonResponse({ success: true, user, message: "Profile updated" });
	} catch (error) {
		const status = error.status || 400;
		return createJsonResponse({ success: false, message: error.message }, status);
	}
}

export async function handleChangePassword(request) {
	try {
		const session = await requireAuthenticatedUser(request);
		const body = await request.json();
		const user = await changePassword({
			userId: session.id,
			currentPassword: body.currentPassword,
			newPassword: body.newPassword,
		});
		return createJsonResponse({ success: true, user, message: "Password updated" });
	} catch (error) {
		const status = error.status || 400;
		return createJsonResponse({ success: false, message: error.message }, status);
	}
}

export async function handleUpdateSettings(request) {
	try {
		const session = await requireAuthenticatedUser(request);
		const body = await request.json();
		const user = await updateSettings({
			userId: session.id,
			pushNotifications: body.pushNotifications,
			emailNotifications: body.emailNotifications,
		});
		return createJsonResponse({ success: true, user, message: "Notification preferences updated" });
	} catch (error) {
		const status = error.status || 400;
		return createJsonResponse({ success: false, message: error.message }, status);
	}
}
