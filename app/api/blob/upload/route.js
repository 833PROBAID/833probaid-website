import { NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";

// Content types accepted by the vendor & referral forms (mirrors the file
// pickers' `accept` attributes). Keep in sync with the forms.
const ALLOWED_CONTENT_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/png",
	"application/msword", // .doc
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
	"application/vnd.ms-excel", // .xls
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
	"application/zip",
	"application/x-zip-compressed",
];

// Generous upper bound — the whole point of direct uploads is to allow large
// files, but we still cap to protect storage.
const MAX_SIZE_IN_BYTES = 100 * 1024 * 1024; // 100 MB

/**
 * Issues short-lived client upload tokens for direct browser-to-Blob uploads.
 * Called automatically by `upload()` (see app/lib/blobUpload.js).
 */
export async function POST(request) {
	const body = await request.json();

	try {
		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async () => ({
				allowedContentTypes: ALLOWED_CONTENT_TYPES,
				maximumSizeInBytes: MAX_SIZE_IN_BYTES,
				addRandomSuffix: false,
			}),
			// File metadata is persisted by the vendor/referral create endpoints,
			// so nothing extra is needed on completion.
			onUploadCompleted: async () => {},
		});

		return NextResponse.json(jsonResponse);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
