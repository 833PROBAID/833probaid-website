// One-time setup: visit /api/constant-contact/connect, log in to Constant Contact, click Allow.
import { NextResponse } from "next/server";
import crypto from "crypto";
import { ctctAuthorizeUrl } from "@/app/lib/constantContact";

export const dynamic = "force-dynamic";

export async function GET(request) {
	const origin = new URL(request.url).origin;
	const redirectUri = `${origin}/api/constant-contact/callback`;
	const state = crypto.randomBytes(16).toString("hex");
	const res = NextResponse.redirect(ctctAuthorizeUrl(redirectUri, state));
	res.cookies.set("ctct_state", state, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 600 });
	return res;
}
