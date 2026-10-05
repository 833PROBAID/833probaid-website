import { NextResponse } from "next/server";
import {
	TOOL_ACCESS_COOKIE,
	recordToolUse,
} from "../../../services/toolAccessService.js";

export async function POST(request) {
	try {
		const token = request.cookies.get(TOOL_ACCESS_COOKIE)?.value || "";
		const body = await request.json();
		const result = await recordToolUse(token, body.toolPage);
		return NextResponse.json(result);
	} catch (error) {
		const message = error.message || "Unable to record tool use";
		const status = /not active/i.test(message) ? 401 : 400;
		return NextResponse.json({ success: false, error: message }, { status });
	}
}
