import { NextResponse } from "next/server";
import * as vendorController from "../../controllers/vendorController.js";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const search = searchParams.get("search") || "";
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "20");
		const result = await vendorController.handleGetAllVendors({ search, page, limit });
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		// Files are uploaded directly to Blob from the browser; the request body
		// is JSON carrying their metadata in `uploadedFiles`.
		const formFields = await request.json();
		if (!Array.isArray(formFields.uploadedFiles)) formFields.uploadedFiles = [];

		const result = await vendorController.handleCreateVendor(formFields);
		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		console.error("Vendor POST error:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
