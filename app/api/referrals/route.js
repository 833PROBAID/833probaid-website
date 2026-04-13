import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
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
		const contentType = request.headers.get("content-type") || "";

		let formFields = {};
		let savedFilePaths = [];

		if (contentType.includes("multipart/form-data")) {
			const formData = await request.formData();

			// Extract the JSON payload
			const jsonRaw = formData.get("data");
			if (jsonRaw) {
				try {
					formFields = JSON.parse(jsonRaw);
				} catch {
					return NextResponse.json(
						{ success: false, error: "Invalid form data JSON" },
						{ status: 400 },
					);
				}
			}

			// Process file uploads
			const uploadDir = path.join(process.cwd(), "public", "uploads", "referral");
			await mkdir(uploadDir, { recursive: true });

			const files = formData.getAll("files");
			for (const file of files) {
				if (!(file instanceof File)) continue;
				const bytes = await file.arrayBuffer();
				const buffer = Buffer.from(bytes);
				const timestamp = Date.now();
				const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
				const filename = `${timestamp}-${safeName}`;
				await writeFile(path.join(uploadDir, filename), buffer);
				savedFilePaths.push({
					originalName: file.name,
					name: filename,
					size: file.size,
					mimeType: file.type,
					path: `/uploads/referral/${filename}`,
				});
			}
		} else {
			// JSON-only fallback (no files)
			formFields = await request.json();
		}

		// Ensure uploadedFiles are plain objects (not class instances)
		formFields.uploadedFiles = savedFilePaths.map((f) => ({ ...f }));

		const result = await referralController.handleCreateReferral(formFields);
		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		console.error("Referral POST error:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
