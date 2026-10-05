import { NextResponse } from "next/server";
import {
	TOOL_ACCESS_COOKIE,
	TOOL_ACCESS_DAYS,
	verifyToolAccessCode,
} from "../../../services/toolAccessService.js";

function requestContext(request) {
	const forwarded = request.headers.get("x-forwarded-for") || "";
	return {
		ipAddress: forwarded.split(",")[0]?.trim() || "",
		userAgent: request.headers.get("user-agent") || "",
	};
}

export async function POST(request) {
	try {
		const body = await request.json();
		const result = await verifyToolAccessCode(body, requestContext(request));
		const response = NextResponse.json({
			success: true,
			email: result.email,
			accessExpiresAt: result.accessExpiresAt,
		});
		response.cookies.set({
			name: TOOL_ACCESS_COOKIE,
			value: result.token,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			expires: new Date(result.accessExpiresAt),
			maxAge: TOOL_ACCESS_DAYS * 24 * 60 * 60,
		});
		return response;
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message || "Unable to verify code" },
			{ status: 400 },
		);
	}
}
