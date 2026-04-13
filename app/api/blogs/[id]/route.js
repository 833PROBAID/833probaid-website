import { NextResponse } from "next/server";
import * as blogController from "../../../controllers/blogController.js";

// GET single blog by ID
export async function GET(request, { params }) {
	try {
		const { id } = await params;
		const result = await blogController.handleGetBlogById(id);

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

// PUT update blog
export async function PUT(request, { params }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const result = await blogController.handleUpdateBlog(id, body);

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

// DELETE blog
export async function DELETE(request, { params }) {
	try {
		const { id } = await params;
		const result = await blogController.handleDeleteBlog(id);

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
