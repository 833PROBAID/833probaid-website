import { NextResponse } from "next/server";
import { extractTokenFromRequest, verifyJwtToken } from "../utils/auth.js";

export async function handleSession(request) {
	try {
		const token = extractTokenFromRequest(request);
		const user = await verifyJwtToken(token);

		if (!user) {
			return NextResponse.json({ authenticated: false }, { status: 200 });
		}

		return NextResponse.json({ authenticated: true, user }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ authenticated: false, message: error.message }, { status: 500 });
	}
}
