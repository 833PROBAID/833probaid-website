import { NextResponse } from "next/server";
import * as mediaController from "../../controllers/mediaController.js";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET all media with optional filtering
export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const filters = {
			folder: searchParams.get("folder"),
			fileType: searchParams.get("fileType"),
			tags: searchParams.get("tags")?.split(",").filter(Boolean),
			search: searchParams.get("search"),
		};

		const result = await mediaController.handleGetAllMedia(filters);
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// POST upload new media
export async function POST(request) {
	try {
		const formData = await request.formData();
		const file = formData.get("file");
		const folder = formData.get("folder") || "/";
		const title = formData.get("title") || "";
		const description = formData.get("description") || "";
		const tags = formData.get("tags")?.split(",").filter(Boolean) || [];

		if (!file) {
			return NextResponse.json(
				{ success: false, error: "No file provided" },
				{ status: 400 }
			);
		}

		// Get file buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Determine file type
		const mimeType = file.type;
		let fileType = "other";
		if (mimeType.startsWith("image/")) fileType = "image";
		else if (mimeType === "application/pdf") fileType = "pdf";
		else if (mimeType.startsWith("video/")) fileType = "video";
		else if (mimeType.startsWith("audio/")) fileType = "audio";
		else if (
			mimeType.includes("document") ||
			mimeType.includes("word") ||
			mimeType.includes("text")
		)
			fileType = "document";

		// Create unique filename
		const timestamp = Date.now();
		const originalName = file.name;
		const ext = path.extname(originalName);
		const filename = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

		// Create folder path
		const folderPath = path.join(process.cwd(), "public", "uploads", folder);
		await mkdir(folderPath, { recursive: true });

		// Save file
		const filePath = path.join(folderPath, filename);
		await writeFile(filePath, buffer);

		// Create media record
		const mediaData = {
			filename,
			originalName,
			title: title || originalName,
			description,
			path: `/uploads/${folder}/${filename}`,
			url: `/uploads/${folder}/${filename}`,
			folder,
			fileType,
			mimeType,
			size: buffer.length,
			tags,
		};

		const result = await mediaController.handleCreateMedia(mediaData);
		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
