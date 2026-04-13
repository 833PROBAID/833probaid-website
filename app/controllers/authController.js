import { NextResponse } from "next/server";
import {
	completeVerification,
	completePasswordReset,
	initiatePasswordReset,
	registerUser,
	startLogin,
} from "../services/authService.js";

function extractRequestContext(request) {
	const forwarded = request.headers.get("x-forwarded-for");
	const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "0.0.0.0";
	return {
		ip,
		userAgent: request.headers.get("user-agent") || "unknown",
	};
}

function setAuthCookie(response, token) {
	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	response.cookies.set({
		name: "authToken",
		value: token,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		expires,
	});
}

export async function handleSignup(request) {
	try {
		const body = await request.json();
		const context = extractRequestContext(request);
		const result = await registerUser({
			name: body.name,
			email: body.email,
			password: body.password,
			context,
		});

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		const status = error.message.includes("exists") ? 409 : 400;
		return NextResponse.json({ success: false, message: error.message }, { status });
	}
}

export async function handleLogin(request) {
	try {
		const body = await request.json();
		const context = extractRequestContext(request);
		const result = await startLogin({
			email: body.email,
			password: body.password,
			context,
		});

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		return NextResponse.json({ success: false, message: error.message }, { status: 401 });
	}
}

export async function handleOtpVerification(request) {
	try {
		const body = await request.json();
		const { email, code, action } = body;

		if (!["signup", "login"].includes(action)) {
			throw new Error("Invalid verification action");
		}

		const result = await completeVerification({ email, code, action });

		const response = NextResponse.json(result, { status: 200 });
		setAuthCookie(response, result.token);
		return response;
	} catch (error) {
		return NextResponse.json({ success: false, message: error.message }, { status: 400 });
	}
}

export async function handleLogout() {
	const response = NextResponse.json({ success: true }, { status: 200 });
	response.cookies.set({
		name: "authToken",
		value: "",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		expires: new Date(0),
	});
	return response;
}

export async function handlePasswordResetRequest(request) {
	try {
		const body = await request.json();
		const context = extractRequestContext(request);
		const result = await initiatePasswordReset({
			email: body.email,
			context,
		});

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 400 },
		);
	}
}

export async function handlePasswordResetVerify(request) {
	try {
		const body = await request.json();
		const { email, code, password } = body;

		const result = await completePasswordReset({ email, code, password });

		const response = NextResponse.json(result, { status: 200 });
		setAuthCookie(response, result.token);
		return response;
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 400 },
		);
	}
}

