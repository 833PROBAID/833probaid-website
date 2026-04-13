import jwt from "jsonwebtoken";
import connectToDatabase from "./db.js";
import User from "../models/User.js";

export function extractTokenFromRequest(request) {
	const cookieToken = request.cookies.get("authToken")?.value;

	if (cookieToken) {
		return cookieToken;
	}

	const authHeader = request.headers.get("authorization");
	if (authHeader?.startsWith("Bearer ")) {
		return authHeader.replace("Bearer ", "");
	}

	return null;
}

export async function verifyJwtToken(token) {
	if (!token) {
		return null;
	}

	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not set");
	}

	try {
		const payload = jwt.verify(token, secret);
		await connectToDatabase();
		const user = await User.findById(payload.sub).lean();
		if (!user) {
			return null;
		}
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
	} catch (error) {
		return null;
	}
}
