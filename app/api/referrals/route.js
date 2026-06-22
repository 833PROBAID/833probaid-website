import { NextResponse } from "next/server";
import * as referralController from "../../controllers/referralController.js";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const search = searchParams.get("search") || "";
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "20");
		const result = await referralController.handleGetAllReferrals({ search, page, limit });
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
		formFields.uploadedFiles = Array.isArray(formFields.uploadedFiles)
			? formFields.uploadedFiles.map((f) => ({ ...f }))
			: [];

		const result = await referralController.handleCreateReferral(formFields);
		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		console.error("Referral POST error:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
