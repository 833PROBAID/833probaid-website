import { NextResponse } from "next/server";
import * as newsletterSubscriptionController from "../../controllers/newsletterSubscriptionController.js";
import { requireAuth } from "@/app/utils/requireAuth";

export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
// Throwaway / fake inbox services — not real subscribers
const THROWAWAY = new Set([
	"mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "10minutemail.com", "10minutemail.net",
	"tempmail.com", "temp-mail.org", "temp-mail.io", "tempmailo.com", "tempmail.net", "tempr.email", "throwawaymail.com",
	"yopmail.com", "yopmail.net", "getnada.com", "nada.email", "trashmail.com", "trashmail.de", "dispostable.com",
	"maildrop.cc", "mailnesia.com", "mintemail.com", "fakeinbox.com", "emailondeck.com", "mohmal.com", "burnermail.io",
	"spamgourmet.com", "mailcatch.com", "moakt.com", "inboxkitten.com", "1secmail.com", "1secmail.net", "mail.tm",
	"discard.email", "dropmail.me", "emailfake.com", "fakemail.net", "spambox.us", "trbvm.com", "example.com", "test.com",
]);
const looksLikeLink = (v) => /(https?:|www\.|\.[a-z]{2,}\/|<|>|@)/i.test(v);
function fakePhone(phone) {
	const d = String(phone).replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
	if (d.length !== 10) return true;
	if (/^[01]/.test(d) || /^\d{3}[01]/.test(d)) return true; // invalid US area/exchange
	if (d.slice(3, 6) === "555") return true; // movie numbers
	if (/^(\d)\1{9}$/.test(d) || d === "1234567890" || d === "0123456789") return true;
	return false;
}
// Bots get a normal-looking "success" so they don't learn anything — nothing is saved
const silentOk = () => NextResponse.json({ success: true }, { status: 201 });
const clip = (v, n) => String(v ?? "").trim().slice(0, n);

function pickSourceDetails(input = {}) {
	return {
		source: clip(input.source, 120),
		medium: clip(input.medium, 120),
		campaign: clip(input.campaign, 180),
		term: clip(input.term, 180),
		content: clip(input.content, 180),
		referrer: clip(input.referrer, 500),
	};
}

async function readPayload(request) {
	const contentType = request.headers.get("content-type") || "";

	if (contentType.includes("multipart/form-data")) {
		const formData = await request.formData();
		const jsonRaw = formData.get("data");

		if (typeof jsonRaw === "string" && jsonRaw.trim()) {
			if (jsonRaw.length > 20_000) throw new SyntaxError("Too large");
			return JSON.parse(jsonRaw);
		}

		return {
			fullName: formData.get("fullName") || "",
			email: formData.get("email") || "",
			phone: formData.get("phone") || "",
			capturePoint: formData.get("capturePoint") || "footer",
			pageUrl: formData.get("pageUrl") || "",
			sourceType: formData.get("sourceType") || "website",
			sourceDetails: {
				source: formData.get("source") || "",
				medium: formData.get("medium") || "",
				campaign: formData.get("campaign") || "",
				term: formData.get("term") || "",
				content: formData.get("content") || "",
				referrer: formData.get("referrer") || "",
			},
		};
	}

	const raw = await request.text();
	if (raw.length > 20_000) throw new SyntaxError("Too large");
	return JSON.parse(raw);
}

// LIST — dashboard login required (was public: anyone could download every subscriber's name, email, phone and IP)
export const GET = requireAuth(async (request) => {
	try {
		const { searchParams } = new URL(request.url);
		const search = clip(searchParams.get("search"), 100);
		const sourceType = clip(searchParams.get("sourceType"), 20);
		const capturePoint = clip(searchParams.get("capturePoint"), 60);
		const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
		const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));

		const result = await newsletterSubscriptionController.handleGetAllNewsletterSubscriptions({
			search,
			sourceType,
			capturePoint,
			page,
			limit,
		});

		const res = NextResponse.json(result);
		res.headers.set("Cache-Control", "no-store");
		return res;
	} catch (error) {
		console.error("Newsletter GET error:", error);
		return NextResponse.json({ success: false, error: "Failed to fetch newsletter subscriptions" }, { status: 500 });
	}
});

// SUBSCRIBE from the website — stays open to the public (same as before).
export async function POST(request) {
	try {
		// Only accept sign-ups from our own website
		const origin = request.headers.get("origin");
		const host = request.headers.get("host");
		if (origin && host && new URL(origin).host !== host) {
			return NextResponse.json({ success: false, error: "Not allowed" }, { status: 403 });
		}

		const payload = await readPayload(request);
		if (!payload || typeof payload !== "object") {
			return NextResponse.json({ success: false, error: "Invalid submission" }, { status: 400 });
		}

		const fullName = clip(payload.fullName, 140);
		const email = clip(payload.email, 180).toLowerCase();
		const phone = clip(payload.phone, 40);

		if (!fullName || !email || !phone) {
			return NextResponse.json({ success: false, error: "fullName, email, and phone are required" }, { status: 400 });
		}

		if (!EMAIL_PATTERN.test(email)) {
			return NextResponse.json({ success: false, error: "A valid email address is required" }, { status: 400 });
		}

		// ── Bot & junk filters ──
		if (clip(payload.website, 200)) return silentOk(); // hidden field only bots fill in
		const startedAt = Number(payload.startedAt) || 0;
		if (startedAt && Date.now() - startedAt < 2500) return silentOk(); // filled faster than a human can
		if (looksLikeLink(fullName)) {
			return NextResponse.json({ success: false, error: "Please enter your real name." }, { status: 400 });
		}
		if (THROWAWAY.has(email.split("@")[1])) {
			return NextResponse.json({ success: false, error: "Please use your real email address — temporary inboxes can’t receive our newsletter." }, { status: 400 });
		}
		if (fakePhone(phone)) {
			return NextResponse.json({ success: false, error: "Please enter a real 10-digit US phone number." }, { status: 400 });
		}

		const existingSubscription = await newsletterSubscriptionController.handleGetNewsletterSubscriptionByEmail(email);

		if (existingSubscription.success) {
			return NextResponse.json({ success: false, error: "This email is already subscribed to our newsletter." }, { status: 409 });
		}

		const forwardedFor = request.headers.get("x-forwarded-for") || "";
		const ipAddress = clip(forwardedFor.split(",")[0], 120);
		const userAgent = clip(request.headers.get("user-agent"), 500);

		const result = await newsletterSubscriptionController.handleCreateNewsletterSubscription({
			fullName,
			firstName: clip(payload.firstName, 70),
			lastName: clip(payload.lastName, 70),
			email,
			phone,
			capturePoint: clip(payload.capturePoint, 60) || "footer",
			pageUrl: clip(payload.pageUrl, 500),
			sourceType: payload.sourceType === "newsletter" ? "newsletter" : "website",
			sourceDetails: pickSourceDetails(payload.sourceDetails || {}),
			meta: { userAgent, ipAddress },
			submittedAt: new Date(),
		});

		// Same reply as before, minus the visitor's IP/device info
		const safe = JSON.parse(JSON.stringify(result ?? {}));
		for (const v of Object.values(safe)) if (v && typeof v === "object") delete v.meta;
		delete safe.meta;
		return NextResponse.json(safe, { status: 201 });
	} catch (error) {
		if (error?.code === 11000 && error?.keyPattern?.email) {
			return NextResponse.json({ success: false, error: "This email is already subscribed to our newsletter." }, { status: 409 });
		}

		const isBad = error?.name === "ValidationError" || error instanceof SyntaxError;
		console.error("Newsletter POST error:", error);
		return NextResponse.json(
			{
				success: false,
				error: isBad ? "Please check your details and try again." : "Could not subscribe right now. Please call (833) 776-2243.",
			},
			{ status: isBad ? 400 : 500 },
		);
	}
}
