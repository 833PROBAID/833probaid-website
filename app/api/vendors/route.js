import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
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
		const contentType = request.headers.get("content-type") || "";

		let formFields = {};
		let savedFiles = [];

		if (contentType.includes("multipart/form-data")) {
			const formData = await request.formData();

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

			const uploadDir = path.join(process.cwd(), "public", "uploads", "vendor");
			await mkdir(uploadDir, { recursive: true });

			// Named file fields with their display labels
			const fileFields = [
				{ key: "w9Form", label: "W-9 Form" },
				{ key: "serviceFeeSheet", label: "Service Fee Sheet" },
				{ key: "coiFile", label: "Certificate of Insurance" },
				{ key: "bondCertFile", label: "Bond Certificate" },
				{ key: "certificationFile", label: "Translation Certification" },
			];

			for (const { key, label } of fileFields) {
				const file = formData.get(key);
				if (!(file instanceof File)) continue;
				const bytes = await file.arrayBuffer();
				const buffer = Buffer.from(bytes);
				const timestamp = Date.now();
				const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
				const filename = `${timestamp}-${safeName}`;
				await writeFile(path.join(uploadDir, filename), buffer);
				savedFiles.push({
					originalName: file.name,
					name: filename,
					size: file.size,
					mimeType: file.type,
					path: `/uploads/vendor/${filename}`,
					fieldName: key,
				});
			}
		} else {
			formFields = await request.json();
		}

		formFields.uploadedFiles = savedFiles;

		const result = await vendorController.handleCreateVendor(formFields);
		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		console.error("Vendor POST error:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
