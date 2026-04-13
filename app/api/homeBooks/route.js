import { NextResponse } from "next/server";
import * as homeBookController from "../../controllers/homeBookController.js";

// GET all homeBooks
export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const page = parseInt(searchParams.get('page')) || 1;
		const limit = parseInt(searchParams.get('limit')) || 10;
		const homepage = searchParams.get('homepage') === 'true';
		
		const result = await homeBookController.handleGetAllHomeBooks({ search, page, limit, homepage });
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}
}

// POST create new homeBook
export async function POST(request) {
	try {
		const body = await request.json();
		const result = await homeBookController.handleCreateHomeBook(body);
		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}
}
