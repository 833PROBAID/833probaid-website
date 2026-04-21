import { NextResponse } from "next/server";
import { extractTokenFromRequest, verifyJwtToken } from "./auth.js";

/**
 * Wrap a route handler so it only runs when a valid JWT is present.
 * Uses the project's existing auth (httpOnly `authToken` cookie or Bearer header).
 * The handler receives (request, context, auth) — where auth is the session object
 * returned by verifyJwtToken ({ id, name, email, roles, ... }).
 */
export function requireAuth(handler) {
  return async (request, context) => {
    try {
      const token = extractTokenFromRequest(request);
      const session = await verifyJwtToken(token);

      if (!session) {
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: 401 }
        );
      }

      return handler(request, context, session);
    } catch (err) {
      return NextResponse.json(
        { message: err.message || "Unauthorized" },
        { status: 401 }
      );
    }
  };
}
