import apiClient from "./client";

class VendorsApi {
	async getAll(params = {}) {
		const { search = "", page = 1, limit = 20 } = params;
		const q = new URLSearchParams();
		if (search) q.append("search", search);
		q.append("page", page.toString());
		q.append("limit", limit.toString());
		return apiClient.get(`/api/vendors?${q.toString()}`);
	}

	async getById(id) {
		return apiClient.get(`/api/vendors/${id}`);
	}

	// Files are uploaded directly to Blob from the browser (see
	// app/lib/blobUpload.js); `data` carries their metadata in `uploadedFiles`.
	async create(data) {
		return apiClient.post("/api/vendors", data);
	}

	async delete(id) {
		return apiClient.delete(`/api/vendors/${id}`);
	}
}

const vendorsApi = new VendorsApi();
export default vendorsApi;
