import { NextResponse } from "next/server";
import { requestToolAccessCode } from "../../../services/toolAccessService.js";

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
		const result = await requestToolAccessCode(body, requestContext(request));
		return NextResponse.json({ success: true, email: result.email });
	} catch (error) {
		const message = error.message || "Unable to send verification code";
		const status = /wait before requesting/i.test(message) ? 429 : 400;
		return NextResponse.json({ success: false, error: message }, { status });
	}
}
