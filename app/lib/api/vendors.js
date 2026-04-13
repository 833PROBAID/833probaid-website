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

	async create(formData, files = {}) {
		const fd = new FormData();
		fd.append("data", JSON.stringify(formData));
		for (const [fieldName, file] of Object.entries(files)) {
			if (file) fd.append(fieldName, file);
		}
		return apiClient.post("/api/vendors", fd);
	}

	async delete(id) {
		return apiClient.delete(`/api/vendors/${id}`);
	}
}

const vendorsApi = new VendorsApi();
export default vendorsApi;
