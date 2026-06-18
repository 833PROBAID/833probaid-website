import { upload } from "@vercel/blob/client";

/**
 * Upload a File directly from the browser to Vercel Blob.
 *
 * This bypasses the Vercel serverless 4.5 MB request-body limit (which caused
 * HTTP 413 errors when heavy files were posted through our own API routes).
 * The browser fetches a short-lived token from `/api/blob/upload` and streams
 * the file straight to Blob storage.
 *
 * Returns a metadata object matching the `uploadedFiles` schema stored on
 * vendor/referral documents.
 *
 * @param {File} file       - the file to upload
 * @param {string} folder   - blob folder prefix (e.g. "vendor", "referral")
 * @param {string} [fieldName] - optional named-field tag (vendor forms only)
 */
export async function uploadToBlob(file, folder, fieldName = "") {
	const timestamp = Date.now();
	const random = Math.random().toString(36).slice(2, 8);
	const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
	const name = `${timestamp}-${random}-${safeName}`;

	const blob = await upload(`${folder}/${name}`, file, {
		access: "public",
		handleUploadUrl: "/api/blob/upload",
	});

	const meta = {
		originalName: file.name,
		name,
		size: file.size,
		mimeType: file.type,
		path: blob.url,
	};
	if (fieldName) meta.fieldName = fieldName;
	return meta;
}
