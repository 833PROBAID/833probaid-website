import { NextResponse } from "next/server";
import {
	NEWSLETTER_SESSION_HOURS,
	TOOL_ACCESS_COOKIE,
	TOOL_PAGES,
	redeemNewsletterToolLink,
} from "../../../services/toolAccessService.js";

function safeToolPath(tool) {
	const slug = String(tool || "").trim().replace(/^\/+/, "").split("/")[0];
	return TOOL_PAGES.has(slug) ? `/${slug}` : "/";
}

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get("token") || "";
	const tool = searchParams.get("tool") || "";

	try {
		const result = await redeemNewsletterToolLink({ token, toolPage: tool });
		const response = NextResponse.redirect(new URL(`/${result.toolPage}`, request.url));
		response.cookies.set({
			name: TOOL_ACCESS_COOKIE,
			value: result.token,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			expires: new Date(result.accessExpiresAt),
			maxAge: NEWSLETTER_SESSION_HOURS * 60 * 60,
		});
		return response;
	} catch {
		return NextResponse.redirect(new URL(safeToolPath(tool), request.url));
	}
}
