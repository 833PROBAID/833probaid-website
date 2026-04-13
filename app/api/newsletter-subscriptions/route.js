import { NextResponse } from "next/server";
import * as newsletterSubscriptionController from "../../controllers/newsletterSubscriptionController.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pickSourceDetails(input = {}) {
	return {
		source: String(input.source || ""),
		medium: String(input.medium || ""),
		campaign: String(input.campaign || ""),
		term: String(input.term || ""),
		content: String(input.content || ""),
		referrer: String(input.referrer || ""),
	};
}

async function readPayload(request) {
	const contentType = request.headers.get("content-type") || "";

	if (contentType.includes("multipart/form-data")) {
		const formData = await request.formData();
		const jsonRaw = formData.get("data");

		if (typeof jsonRaw === "string" && jsonRaw.trim()) {
			return JSON.parse(jsonRaw);
		}

		return {
			fullName: formData.get("fullName") || "",
			email: formData.get("email") || "",
			phone: formData.get("phone") || "",
			capturePoint: formData.get("capturePoint") || "footer",
			pageUrl: formData.get("pageUrl") || "",
			sourceType: formData.get("sourceType") || "website",
			sourceDetails: pickSourceDetails({
				source: formData.get("source") || "",
				medium: formData.get("medium") || "",
				campaign: formData.get("campaign") || "",
				term: formData.get("term") || "",
				content: formData.get("content") || "",
				referrer: formData.get("referrer") || "",
			}),
		};
	}

	return request.json();
}

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const search = searchParams.get("search") || "";
		const sourceType = searchParams.get("sourceType") || "";
		const capturePoint = searchParams.get("capturePoint") || "";
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "20", 10);

		const result =
			await newsletterSubscriptionController.handleGetAllNewsletterSubscriptions({
				search,
				sourceType,
				capturePoint,
				page,
				limit,
			});

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to fetch newsletter subscriptions",
			},
			{ status: 500 },
		);
	}
}

export async function POST(request) {
	try {
		const payload = await readPayload(request);

		const fullName = String(payload.fullName || "").trim();
		const email = String(payload.email || "").trim().toLowerCase();
		const phone = String(payload.phone || "").trim();

		if (!fullName || !email || !phone) {
			return NextResponse.json(
				{ success: false, error: "fullName, email, and phone are required" },
				{ status: 400 },
			);
		}

		if (!EMAIL_PATTERN.test(email)) {
			return NextResponse.json(
				{ success: false, error: "A valid email address is required" },
				{ status: 400 },
			);
		}

		const existingSubscription =
			await newsletterSubscriptionController.handleGetNewsletterSubscriptionByEmail(
				email,
			);

		if (existingSubscription.success) {
			return NextResponse.json(
				{
					success: false,
					error: "This email is already subscribed to our newsletter.",
				},
				{ status: 409 },
			);
		}

		const forwardedFor = request.headers.get("x-forwarded-for") || "";
		const ipAddress = forwardedFor.split(",")[0]?.trim() || "";
		const userAgent = request.headers.get("user-agent") || "";

		const result =
			await newsletterSubscriptionController.handleCreateNewsletterSubscription({
				fullName,
				email,
				phone,
				capturePoint: String(payload.capturePoint || "footer").trim() || "footer",
				pageUrl: String(payload.pageUrl || "").trim(),
				sourceType:
					payload.sourceType === "newsletter" ? "newsletter" : "website",
				sourceDetails: pickSourceDetails(payload.sourceDetails || {}),
				meta: {
					userAgent,
					ipAddress,
				},
				submittedAt: new Date(),
			});

		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		if (error?.code === 11000 && error?.keyPattern?.email) {
			return NextResponse.json(
				{
					success: false,
					error: "This email is already subscribed to our newsletter.",
				},
				{ status: 409 },
			);
		}

		const status =
			error?.name === "ValidationError" || error instanceof SyntaxError ? 400 : 500;

		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to create newsletter subscription",
			},
			{ status },
		);
	}
}
