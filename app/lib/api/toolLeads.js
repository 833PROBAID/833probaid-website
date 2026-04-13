import apiClient from "./client";

class ToolLeadsApi {
	async getAll(params = {}) {
		const {
			search = "",
			sourceType = "",
			toolPage = "",
			page = 1,
			limit = 20,
		} = params;

		const q = new URLSearchParams();
		if (search) q.append("search", search);
		if (sourceType) q.append("sourceType", sourceType);
		if (toolPage) q.append("toolPage", toolPage);
		q.append("page", page.toString());
		q.append("limit", limit.toString());

		return apiClient.get(`/api/tool-leads?${q.toString()}`);
	}

	async getById(id) {
		return apiClient.get(`/api/tool-leads/${id}`);
	}

	async create(formData) {
		return apiClient.post("/api/tool-leads", formData);
	}

	async delete(id) {
		return apiClient.delete(`/api/tool-leads/${id}`);
	}
}

const toolLeadsApi = new ToolLeadsApi();
export default toolLeadsApi;
