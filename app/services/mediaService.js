import connectToDatabase from "../utils/db.js";
import Media from "../models/Media.js";
import fs from "fs/promises";
import path from "path";

// Get all media files with optional filtering
export async function getAllMedia({ folder, fileType, tags, search } = {}) {
	await connectToDatabase();
	
	const query = {};
	
	if (folder) {
		query.folder = folder;
	}
	
	if (fileType) {
		query.fileType = fileType;
	}
	
	if (tags && tags.length > 0) {
		query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
	}
	
	if (search) {
		query.$text = { $search: search };
	}
	
	return Media.find(query).sort({ createdAt: -1 });
}

// Get media by ID
export async function getMediaById(mediaId) {
	await connectToDatabase();
	return Media.findById(mediaId);
}

// Create new media record
export async function createMedia(mediaData) {
	await connectToDatabase();
	const media = await Media.create(mediaData);
	return media;
}

// Update media metadata
export async function updateMedia(mediaId, updateData) {
	await connectToDatabase();
	
	const media = await Media.findById(mediaId);
	if (!media) {
		return null;
	}
	
	// Update allowed fields
	const allowedFields = ["title", "description", "folder", "tags", "isPublic"];
	allowedFields.forEach((field) => {
		if (updateData[field] !== undefined) {
			media[field] = updateData[field];
		}
	});
	
	await media.save();
	return media;
}

// Delete media file
export async function deleteMedia(mediaId) {
	await connectToDatabase();
	
	const media = await Media.findById(mediaId);
	if (!media) {
		return null;
	}
	
	// Delete physical file
	try {
		const filePath = path.join(process.cwd(), "public", media.path);
		await fs.unlink(filePath);
	} catch (error) {
		console.error("Error deleting file:", error);
	}
	
	await Media.findByIdAndDelete(mediaId);
	return media;
}

// Get all unique folders
export async function getAllFolders() {
	await connectToDatabase();
	const folders = await Media.distinct("folder");
	return folders.sort();
}

// Get all unique tags
export async function getAllTags() {
	await connectToDatabase();
	const tags = await Media.distinct("tags");
	return tags.sort();
}
