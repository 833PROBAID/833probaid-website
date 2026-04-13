import { NextResponse } from "next/server";
import * as mediaController from "../../../controllers/mediaController.js";

// GET all tags
export async function GET(request) {
	try {
		const result = await mediaController.handleGetAllTags();
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
