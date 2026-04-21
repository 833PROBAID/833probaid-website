import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

const ALLOWED_CORS_ORIGINS = new Set([
	"https://833probaid.com",
	"https://833probate.com",
]);

const getSecretKey = () => {
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not set");
	}
	return new TextEncoder().encode(JWT_SECRET);
};

/**
 * 🔒 SECURITY: Add security headers to response
 * Protects against common web vulnerabilities
 */
function addSecurityHeaders(response, options = {}) {
	const {
		includeHSTS = process.env.NODE_ENV === "production",
		includeCSP = true,
		strictCache = false,
	} = options;

	// Prevent MIME type sniffing
	response.headers.set("X-Content-Type-Options", "nosniff");

	// Prevent clickjacking attacks
	response.headers.set("X-Frame-Options", "DENY");

	// Enable XSS protection (legacy browsers)
	response.headers.set("X-XSS-Protection", "1; mode=block");

	// Control referrer information
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

	// HSTS - Force HTTPS
	if (includeHSTS) {
		response.headers.set(
			"Strict-Transport-Security",
			"max-age=31536000; includeSubDomains; preload",
		);
	}

	// Content Security Policy
	if (includeCSP) {
		const cspDirectives = [
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
			"style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
			"img-src 'self' data: https: blob:",
			"font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com",
			"connect-src 'self' https: wss: ws:",
			"frame-src 'self'",
			"object-src 'none'",
			"base-uri 'self'",
			"form-action 'self'",
			"frame-ancestors 'none'",
		];
		response.headers.set("Content-Security-Policy", cspDirectives.join("; "));
	}

	// Cache control for sensitive pages
	if (strictCache) {
		response.headers.set(
			"Cache-Control",
			"no-store, no-cache, must-revalidate, proxy-revalidate",
		);
		response.headers.set("Pragma", "no-cache");
		response.headers.set("Expires", "0");
	}

	// Permissions Policy (restrict browser features)
	response.headers.set(
		"Permissions-Policy",
		"camera=(), microphone=(), geolocation=(), interest-cohort=()",
	);

	return response;
}

function normalizeOrigin(origin) {
	if (!origin || origin === "null" || origin === "undefined") return null;
	try {
		const url = new URL(origin);
		return `${url.protocol}//${url.host}`;
	} catch {
		return null;
	}
}

function isAllowedCorsOrigin(origin) {
	const normalizedOrigin = normalizeOrigin(origin);
	if (!normalizedOrigin) return false;

	// Keep local development workable without opening production CORS.
	if (process.env.NODE_ENV === "development") {
		if (
			normalizedOrigin === "http://localhost:3000" ||
			normalizedOrigin === "http://localhost:3001"
		) {
			return true;
		}
	}

	return ALLOWED_CORS_ORIGINS.has(normalizedOrigin);
}

/**
 * 🔒 SECURITY: Verify JWT token from request
 * Returns decoded token or null if invalid
 * Uses jose library for Edge Runtime compatibility
 */
async function verifyToken(request) {
	try {
		// Try to get token from Authorization header
		const authHeader = request.headers.get("Authorization");
		let token = authHeader?.replace("Bearer ", "");

		// Fallback: Try to get token from cookie
		if (!token) {
			const cookies = request.headers.get("cookie");
			if (cookies) {
				const authCookie = cookies
					.split(";")
					.find((c) => c.trim().startsWith("authToken="));
				if (authCookie) {
					token = authCookie.split("=")[1];
				}
			}
		}

		if (!token) {
			// No token found anywhere
			return null;
		}

		// Verify token using jose (Edge Runtime compatible)
		const { payload } = await jwtVerify(token, getSecretKey(), {
			algorithms: ["HS256"],
		});

		// Check token expiration manually (jose doesn't use maxAge)
		if (payload.exp && payload.exp * 1000 < Date.now()) {
			return null;
		}

		return payload;
	} catch (error) {
		return null;
	}
}

export async function proxy(request) {
	// Get the pathname of the request
	const pathname = request.nextUrl.pathname;

	// 🔒 SECURITY: Protect /api/dashboard/* routes — return 401 JSON (no redirect)
	if (pathname.startsWith("/api/dashboard/")) {
		const user = await verifyToken(request);
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		// Authenticated — let the request continue to the API handler
		return NextResponse.next();
	}

	// 🔒 SECURITY: Protect ALL dashboard routes
	// Server-side authentication check BEFORE React loads
	if (pathname.startsWith("/dashboard")) {
		// Verify authentication token
		const user = await verifyToken(request);

		if (!user) {
			// Not authenticated - redirect to login
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("redirect", pathname);

			// 🔒 SECURITY: Log blocked access attempt
			const clientIP =
				request.headers.get("x-forwarded-for")?.split(",")[0] ||
				request.headers.get("x-real-ip") ||
				"unknown";

			console.warn(`🔒 SECURITY: Blocked unauthenticated access to ${pathname}`, {
				ip: clientIP,
				userAgent: request.headers.get("user-agent"),
			});

			return NextResponse.redirect(loginUrl);
		}

		const response = NextResponse.next();
		addSecurityHeaders(response, {
			includeHSTS: true,
			includeCSP: true,
			strictCache: true,
		});

		// Additional check for admin routes
		if (pathname.startsWith("/dashboard/admin/")) {
			const roles = Array.isArray(user.roles) ? user.roles : [];
			if (!roles.includes("admin")) {
				console.warn(
					`🔒 SECURITY: Blocked non-admin user ${user.email || "unknown"} from ${pathname}`,
				);
				const dashboardUrl = new URL("/dashboard", request.url);
				return NextResponse.redirect(dashboardUrl);
			}
		}

		return response;
	}

	// Handle API routes
	if (pathname.startsWith("/api/")) {
		const origin = request.headers.get("origin");
		const isAllowedOrigin = isAllowedCorsOrigin(origin);

		// Handle CORS preflight requests for allowed origins only.
		if (request.method === "OPTIONS") {
			if (!isAllowedOrigin) {
				return new NextResponse(null, { status: 403 });
			}

			return new NextResponse(null, {
				status: 204,
				headers: {
					"Access-Control-Allow-Origin": normalizeOrigin(origin),
					"Access-Control-Allow-Methods":
						"GET, POST, PUT, PATCH, DELETE, OPTIONS",
					"Access-Control-Allow-Headers":
						"Content-Type, Authorization, X-API-Key, X-CSRF-Token, X-TOTP-Code, X-Wallet-Address, X-Mobile-API-Key",
					"Access-Control-Allow-Credentials": "true",
					"Access-Control-Max-Age": "86400",
					Vary: "Origin",
				},
			});
		}

		// For admin API routes, add additional security headers
		if (pathname.startsWith("/api/admin/")) {
			const response = NextResponse.next();

			addSecurityHeaders(response, {
				includeHSTS: true,
				includeCSP: true,
				strictCache: false,
			});

			if (isAllowedOrigin) {
				response.headers.set("Access-Control-Allow-Origin", normalizeOrigin(origin));
				response.headers.set("Access-Control-Allow-Credentials", "true");
				response.headers.set("Vary", "Origin");
			}

			return response;
		}

		// For regular API routes
		const response = NextResponse.next();

		// Basic security headers to all API routes
		addSecurityHeaders(response, {
			includeHSTS: process.env.NODE_ENV === "production",
			includeCSP: false, // Less strict for API endpoints
			strictCache: false,
		});

		if (isAllowedOrigin) {
			response.headers.set("Access-Control-Allow-Origin", normalizeOrigin(origin));
			response.headers.set("Access-Control-Allow-Credentials", "true");
			response.headers.set("Vary", "Origin");
		}

		return response;
	}

	return NextResponse.next();
}

// 🔒 Proxy configuration
export const config = {
	matcher: ["/api/:path*", "/dashboard/:path*"],
};
