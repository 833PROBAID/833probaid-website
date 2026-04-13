import apiClient from "./client";

class MediaApi {
	// Get all media with filters
	async getAll(filters = {}) {
		try {
			const params = new URLSearchParams();
			if (filters.folder) params.append("folder", filters.folder);
			if (filters.fileType) params.append("fileType", filters.fileType);
			if (filters.tags?.length) params.append("tags", filters.tags.join(","));
			if (filters.search) params.append("search", filters.search);

			const query = params.toString() ? `?${params.toString()}` : "";
			const result = await apiClient.get(`/api/media${query}`);
			return result;
		} catch (error) {
			console.error("MediaApi: Error fetching media:", error);
			throw error;
		}
	}

	// Get media by ID
	async getById(id) {
		try {
			const result = await apiClient.get(`/api/media/${id}`);
			return result;
		} catch (error) {
			console.error("MediaApi: Error fetching media by ID:", error);
			throw error;
		}
	}

	// Upload new media
	async upload(file, metadata = {}) {
		try {
			const formData = new FormData();
			formData.append("file", file);
			if (metadata.folder) formData.append("folder", metadata.folder);
			if (metadata.title) formData.append("title", metadata.title);
			if (metadata.description) formData.append("description", metadata.description);
			if (metadata.tags?.length) formData.append("tags", metadata.tags.join(","));

			const response = await fetch("/api/media", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			return await response.json();
		} catch (error) {
			console.error("MediaApi: Error uploading file:", error);
			throw error;
		}
	}

	// Update media metadata
	async update(id, data) {
		try {
			const result = await apiClient.put(`/api/media/${id}`, data);
			return result;
		} catch (error) {
			console.error("MediaApi: Error updating media:", error);
			throw error;
		}
	}

	// Delete media
	async delete(id) {
		try {
			const result = await apiClient.delete(`/api/media/${id}`);
			return result;
		} catch (error) {
			console.error("MediaApi: Error deleting media:", error);
			throw error;
		}
	}

	// Get all folders
	async getFolders() {
		try {
			const result = await apiClient.get("/api/media/folders");
			return result;
		} catch (error) {
			console.error("MediaApi: Error fetching folders:", error);
			throw error;
		}
	}

	// Get all tags
	async getTags() {
		try {
			const result = await apiClient.get("/api/media/tags");
			return result;
		} catch (error) {
			console.error("MediaApi: Error fetching tags:", error);
			throw error;
		}
	}
}

const mediaApi = new MediaApi();
export default mediaApi;
