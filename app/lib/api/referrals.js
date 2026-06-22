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

	// Files are uploaded directly to Blob from the browser (see
	// app/lib/blobUpload.js); `data` carries their metadata in `uploadedFiles`.
	async create(data) {
		return apiClient.post("/api/referrals", data);
	}

	async delete(id) {
		return apiClient.delete(`/api/referrals/${id}`);
	}
}

const referralsApi = new ReferralsApi();
export default referralsApi;
