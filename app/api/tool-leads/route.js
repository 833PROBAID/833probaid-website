import { NextResponse } from "next/server";
import * as toolLeadController from "../../controllers/toolLeadController.js";

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
			company: formData.get("company") || "",
			role: formData.get("role") || "",
			notes: formData.get("notes") || "",
			toolPage: formData.get("toolPage") || "",
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
		const toolPage = searchParams.get("toolPage") || "";
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "20", 10);

		const result = await toolLeadController.handleGetAllToolLeads({
			search,
			sourceType,
			toolPage,
			page,
			limit,
		});

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message || "Failed to fetch tool leads" },
			{ status: 500 },
		);
	}
}

export async function POST(request) {
	try {
		const payload = await readPayload(request);

		const fullName = String(payload.fullName || "").trim();
		const email = String(payload.email || "").trim().toLowerCase();
		const toolPage = String(payload.toolPage || "").trim();

		if (!fullName || !email || !toolPage) {
			return NextResponse.json(
				{
					success: false,
					error: "fullName, email, and toolPage are required",
				},
				{ status: 400 },
			);
		}

		if (!EMAIL_PATTERN.test(email)) {
			return NextResponse.json(
				{ success: false, error: "A valid email address is required" },
				{ status: 400 },
			);
		}

		const forwardedFor = request.headers.get("x-forwarded-for") || "";
		const ipAddress = forwardedFor.split(",")[0]?.trim() || "";
		const userAgent = request.headers.get("user-agent") || "";

		const result = await toolLeadController.handleCreateToolLead({
			fullName,
			email,
			phone: String(payload.phone || "").trim(),
			company: String(payload.company || "").trim(),
			role: String(payload.role || "").trim(),
			notes: String(payload.notes || "").trim(),
			toolPage,
			pageUrl: String(payload.pageUrl || "").trim(),
			sourceType: payload.sourceType === "newsletter" ? "newsletter" : "website",
			sourceDetails: pickSourceDetails(payload.sourceDetails || {}),
			meta: {
				userAgent,
				ipAddress,
			},
			submittedAt: new Date(),
		});

		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		const status =
			error?.name === "ValidationError" || error instanceof SyntaxError ? 400 : 500;

		return NextResponse.json(
			{ success: false, error: error.message || "Failed to create tool lead" },
			{ status },
		);
	}
}
