import { NextResponse } from "next/server";
import * as homeBookController from "../../../controllers/homeBookController.js";

// GET single homeBook by ID
export async function GET(request, { params }) {
	try {
		const { id } = await params;
		const result = await homeBookController.handleGetHomeBookById(id);
		
		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}
}

// PUT update homeBook
export async function PUT(request, { params }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const result = await homeBookController.handleUpdateHomeBook(id, body);

		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}
}

// DELETE homeBook
export async function DELETE(request, { params }) {
	try {
		const { id } = await params;
		const result = await homeBookController.handleDeleteHomeBook(id);

		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}
}
