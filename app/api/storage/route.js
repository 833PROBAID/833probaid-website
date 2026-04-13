import { NextResponse } from "next/server";
import * as storageController from "../../controllers/storageController.js";

// GET storage statistics
export async function GET(request) {
	try {
		const result = await storageController.handleGetStorageStats();
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// POST check storage limit (for pre-upload validation)
export async function POST(request) {
	try {
		const { fileSize } = await request.json();
		
		if (!fileSize || fileSize < 0) {
			return NextResponse.json(
				{ success: false, error: "Invalid file size" },
				{ status: 400 }
			);
		}

		const result = await storageController.handleCheckStorageLimit(fileSize);
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
