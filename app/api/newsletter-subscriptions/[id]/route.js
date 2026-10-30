import { NextResponse } from "next/server";
import * as newsletterSubscriptionController from "../../../controllers/newsletterSubscriptionController.js";
import { requireAuth } from "@/app/utils/requireAuth";

export const dynamic = "force-dynamic";

const validId = (id) => typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);

// VIEW one subscriber — dashboard login required (was public)
export const GET = requireAuth(async (request, { params }) => {
	try {
		const { id } = await params;
		if (!validId(id)) return NextResponse.json({ success: false, error: "Subscriber not found" }, { status: 404 });
		const result = await newsletterSubscriptionController.handleGetNewsletterSubscriptionById(id);
		if (!result.success) return NextResponse.json(result, { status: 404 });
		const res = NextResponse.json(result);
		res.headers.set("Cache-Control", "no-store");
		return res;
	} catch (error) {
		console.error("Newsletter GET by id error:", error);
		return NextResponse.json({ success: false, error: "Failed to fetch newsletter subscription" }, { status: 500 });
	}
});

// DELETE one subscriber — dashboard login required (was public: anyone could delete your subscribers)
export const DELETE = requireAuth(async (request, { params }) => {
	try {
		const { id } = await params;
		if (!validId(id)) return NextResponse.json({ success: false, error: "Subscriber not found" }, { status: 404 });
		const result = await newsletterSubscriptionController.handleDeleteNewsletterSubscription(id);
		if (!result.success) return NextResponse.json(result, { status: 404 });
		return NextResponse.json(result);
	} catch (error) {
		console.error("Newsletter DELETE error:", error);
		return NextResponse.json({ success: false, error: "Failed to delete newsletter subscription" }, { status: 500 });
	}
});
