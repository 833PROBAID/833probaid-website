import { NextResponse } from "next/server";
import * as newsletterSubscriptionController from "../../../controllers/newsletterSubscriptionController.js";

export async function GET(request, { params }) {
	try {
		const { id } = await params;
		const result =
			await newsletterSubscriptionController.handleGetNewsletterSubscriptionById(id);

		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to fetch newsletter subscription",
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(request, { params }) {
	try {
		const { id } = await params;
		const result =
			await newsletterSubscriptionController.handleDeleteNewsletterSubscription(id);

		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to delete newsletter subscription",
			},
			{ status: 500 },
		);
	}
}
