import { NextResponse } from "next/server";
import * as mediaController from "../../../controllers/mediaController.js";

// GET single media by ID
export async function GET(request, { params }) {
	try {
		const { id } = await params;
		const result = await mediaController.handleGetMediaById(id);

		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// PUT update media metadata
export async function PUT(request, { params }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const result = await mediaController.handleUpdateMedia(id, body);

		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// DELETE media
export async function DELETE(request, { params }) {
	try {
		const { id } = await params;
		const result = await mediaController.handleDeleteMedia(id);

		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
