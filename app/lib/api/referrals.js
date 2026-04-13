import apiClient from "./client";

class ReferralsApi {
	async getAll(params = {}) {
		const { search = "", page = 1, limit = 20 } = params;
		const q = new URLSearchParams();
		if (search) q.append("search", search);
		q.append("page", page.toString());
		q.append("limit", limit.toString());
		return apiClient.get(`/api/referrals?${q.toString()}`);
	}

	async getById(id) {
		return apiClient.get(`/api/referrals/${id}`);
	}

	async create(formData, files = []) {
		const fd = new FormData();
		fd.append("data", JSON.stringify(formData));
		for (const file of files) {
			fd.append("files", file);
		}
		return apiClient.post("/api/referrals", fd);
	}

	async delete(id) {
		return apiClient.delete(`/api/referrals/${id}`);
	}
}

const referralsApi = new ReferralsApi();
export default referralsApi;
