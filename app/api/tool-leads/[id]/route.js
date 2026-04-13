import { NextResponse } from "next/server";
import * as toolLeadController from "../../../controllers/toolLeadController.js";

export async function GET(request, { params }) {
	try {
		const { id } = await params;
		const result = await toolLeadController.handleGetToolLeadById(id);

		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message || "Failed to fetch tool lead" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request, { params }) {
	try {
		const { id } = await params;
		const result = await toolLeadController.handleDeleteToolLead(id);

		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message || "Failed to delete tool lead" },
			{ status: 500 },
		);
	}
}
