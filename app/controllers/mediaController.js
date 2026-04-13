import * as mediaService from "../services/mediaService.js";

export async function handleGetAllMedia(filters) {
	try {
		const media = await mediaService.getAllMedia(filters);
		return {
			success: true,
			media: media.map((item) => ({
				id: item._id.toString(),
				...item.toObject(),
			})),
		};
	} catch (error) {
		console.error("Error fetching media:", error);
		throw new Error("Failed to fetch media");
	}
}

export async function handleGetMediaById(mediaId) {
	try {
		const media = await mediaService.getMediaById(mediaId);
		if (!media) {
			return { success: false, error: "Media not found" };
		}

		return {
			success: true,
			media: {
				id: media._id.toString(),
				...media.toObject(),
			},
		};
	} catch (error) {
		console.error("Error fetching media:", error);
		throw new Error("Failed to fetch media");
	}
}

export async function handleCreateMedia(mediaData) {
	try {
		const media = await mediaService.createMedia(mediaData);
		return {
			success: true,
			media: {
				id: media._id.toString(),
				...media.toObject(),
			},
		};
	} catch (error) {
		console.error("Error creating media:", error);
		throw new Error("Failed to create media");
	}
}

export async function handleUpdateMedia(mediaId, updateData) {
	try {
		const media = await mediaService.updateMedia(mediaId, updateData);
		if (!media) {
			return { success: false, error: "Media not found" };
		}

		return {
			success: true,
			media: {
				id: media._id.toString(),
				...media.toObject(),
			},
		};
	} catch (error) {
		console.error("Error updating media:", error);
		throw new Error("Failed to update media");
	}
}

export async function handleDeleteMedia(mediaId) {
	try {
		const media = await mediaService.deleteMedia(mediaId);
		if (!media) {
			return { success: false, error: "Media not found" };
		}

		return {
			success: true,
			message: "Media deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting media:", error);
		throw new Error("Failed to delete media");
	}
}

export async function handleGetAllFolders() {
	try {
		const folders = await mediaService.getAllFolders();
		return {
			success: true,
			folders,
		};
	} catch (error) {
		console.error("Error fetching folders:", error);
		throw new Error("Failed to fetch folders");
	}
}

export async function handleGetAllTags() {
	try {
		const tags = await mediaService.getAllTags();
		return {
			success: true,
			tags,
		};
	} catch (error) {
		console.error("Error fetching tags:", error);
		throw new Error("Failed to fetch tags");
	}
}
