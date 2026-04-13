import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

const getSecretKey = () => {
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not set");
	}
	return new TextEncoder().encode(JWT_SECRET);
};

// In-memory log for blocked access attempts
const accessAttempts = new Map();

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

function isOriginAllowed(origin) {
	const allowedOrigins = [process.env.FRONTEND_URL];

	// Add development origins only in development mode
	if (process.env.NODE_ENV === "development") {
		allowedOrigins.push("http://localhost:3000", "http://localhost:3001");
	}

	// If no origin provided, only allow in development
	if (!origin || origin === "null" || origin === "undefined") {
		return process.env.NODE_ENV === "development";
	}

	// Parse and normalize origin URL
	let baseOrigin = origin;
	try {
		const url = new URL(origin);
		baseOrigin = `${url.protocol}//${url.host}`;
	} catch (error) {
		console.warn("🔒 MIDDLEWARE: Failed to parse origin URL:", origin);
		return false;
	}

	const isAllowed = allowedOrigins.includes(baseOrigin);
	return isAllowed;
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

export async function middleware(request) {
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

			console.warn(
				`🔒 SECURITY: Blocked unauthenticated access to ${pathname}`,
				{
					ip: clientIP,
					userAgent: request.headers.get("user-agent"),
				},
			);

			// Track repeated attempts
			const attemptKey = `${clientIP}:${pathname}`;
			const attempts = accessAttempts.get(attemptKey) || 0;
			accessAttempts.set(attemptKey, attempts + 1);

			// Clean up old entries every 100 attempts
			if (accessAttempts.size > 1000) {
				accessAttempts.clear();
			}

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

	// Handle CORS for API routes
	if (pathname.startsWith("/api/")) {
		const origin = request.headers.get("Origin");
		const mobileApiKey = request.headers.get("X-Mobile-API-Key");
		const isMobileApp = !!mobileApiKey;

		// For preflight requests
		if (request.method === "OPTIONS") {
			// Mobile app preflight
			if (isMobileApp) {
				return new NextResponse(null, {
					status: 200,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Methods":
							"GET, POST, PUT, DELETE, OPTIONS, PATCH",
						"Access-Control-Allow-Headers":
							"Content-Type, Authorization, X-API-Key, X-Mobile-API-Key",
						"Access-Control-Allow-Credentials": "false",
						"Access-Control-Max-Age": "86400",
					},
				});
			}
			// Web app preflight
			else if (origin && isOriginAllowed(origin)) {
				return new NextResponse(null, {
					status: 200,
					headers: {
						"Access-Control-Allow-Origin": origin,
						"Access-Control-Allow-Methods":
							"GET, POST, PUT, DELETE, OPTIONS, PATCH",
						"Access-Control-Allow-Headers":
							"Content-Type, Authorization, X-API-Key, X-CSRF-Token, X-TOTP-Code, X-Wallet-Address",
						"Access-Control-Allow-Credentials": "true",
						"Access-Control-Max-Age": "86400",
					},
				});
			} else {
				return new NextResponse(null, { status: 403 });
			}
		}

		// For admin API routes, add additional security headers
		if (pathname.startsWith("/api/admin/")) {
			const response = NextResponse.next();

			addSecurityHeaders(response, {
				includeHSTS: true,
				includeCSP: true,
				strictCache: false,
			});

			// Mobile app CORS
			if (isMobileApp) {
				response.headers.set("Access-Control-Allow-Origin", "*");
				response.headers.set("Access-Control-Allow-Credentials", "false");
				response.headers.set(
					"Access-Control-Allow-Methods",
					"GET, POST, PUT, DELETE, OPTIONS, PATCH",
				);
				response.headers.set(
					"Access-Control-Allow-Headers",
					"Content-Type, Authorization, X-API-Key, X-Mobile-API-Key",
				);
			}
			// Web app CORS
			else if (origin && isOriginAllowed(origin)) {
				response.headers.set("Access-Control-Allow-Origin", origin);
				response.headers.set("Access-Control-Allow-Credentials", "true");
				response.headers.set(
					"Access-Control-Allow-Methods",
					"GET, POST, PUT, DELETE, OPTIONS, PATCH",
				);
				response.headers.set(
					"Access-Control-Allow-Headers",
					"Content-Type, Authorization, X-API-Key, X-CSRF-Token, X-TOTP-Code, X-Wallet-Address",
				);
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

		// CORS: Set CORS headers with all required methods and headers
		// This ensures CORS works even if routes don't explicitly set headers
		if (isMobileApp) {
			response.headers.set("Access-Control-Allow-Origin", "*");
			response.headers.set("Access-Control-Allow-Credentials", "false");
			response.headers.set(
				"Access-Control-Allow-Methods",
				"GET, POST, PUT, DELETE, OPTIONS, PATCH",
			);
			response.headers.set(
				"Access-Control-Allow-Headers",
				"Content-Type, Authorization, X-API-Key, X-Mobile-API-Key",
			);
		}
		// Web app CORS
		else if (origin && isOriginAllowed(origin)) {
			response.headers.set("Access-Control-Allow-Origin", origin);
			response.headers.set("Access-Control-Allow-Credentials", "true");
			response.headers.set(
				"Access-Control-Allow-Methods",
				"GET, POST, PUT, DELETE, OPTIONS, PATCH",
			);
			response.headers.set(
				"Access-Control-Allow-Headers",
				"Content-Type, Authorization, X-API-Key, X-CSRF-Token, X-TOTP-Code, X-Wallet-Address",
			);
		}

		return response;
	}

	return NextResponse.next();
}

// 🔒 Middleware configuration
export const config = {
	matcher: ["/api/:path*", "/dashboard/:path*"],
};
