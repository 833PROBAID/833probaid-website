import { NextResponse } from "next/server";
import * as blogController from "../../controllers/blogController.js";

// GET all blogs with search and pagination
export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '10');
		
		const result = await blogController.handleGetAllBlogs({ search, page, limit });
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}
}

// POST create new blog
export async function POST(request) {
	try {
		const body = await request.json();
		const result = await blogController.handleCreateBlog(body);
		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}
}
