import { NextResponse } from "next/server";
import {
	TOOL_ACCESS_COOKIE,
	readToolAccessSession,
} from "../../../services/toolAccessService.js";

export async function GET(request) {
	try {
		const token = request.cookies.get(TOOL_ACCESS_COOKIE)?.value || "";
		const session = await readToolAccessSession(token);
		return NextResponse.json(
			{ success: true, ...session },
			{ headers: { "Cache-Control": "no-store" } },
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, authorized: false, error: error.message || "Unable to read tool access" },
			{ status: 500 },
		);
	}
}
