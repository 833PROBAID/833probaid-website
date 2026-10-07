import { NextResponse } from "next/server";
import { getNewsletterSubscriptionById } from "@/app/services/newsletterSubscriptionService.js";
import { buildNewsletterToolLinks } from "@/app/services/toolAccessService.js";

export async function GET(_request, { params }) {
	try {
		const { id } = await params;
		const subscription = await getNewsletterSubscriptionById(id);
		if (!subscription || subscription.status === "revoked") {
			return NextResponse.json(
				{ success: false, error: "Newsletter subscription not found" },
				{ status: 404 },
			);
		}

		const links = buildNewsletterToolLinks(subscription._id);
		return NextResponse.json({ success: true, ...links });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message || "Unable to build newsletter tool links" },
			{ status: 400 },
		);
	}
}
