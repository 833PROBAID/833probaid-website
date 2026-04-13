import apiClient from "./client";

class NewsletterSubscriptionsApi {
	async getAll(params = {}) {
		const { search = "", sourceType = "", capturePoint = "", page = 1, limit = 20 } =
			params;

		const q = new URLSearchParams();
		if (search) q.append("search", search);
		if (sourceType) q.append("sourceType", sourceType);
		if (capturePoint) q.append("capturePoint", capturePoint);
		q.append("page", page.toString());
		q.append("limit", limit.toString());

		return apiClient.get(`/api/newsletter-subscriptions?${q.toString()}`);
	}

	async getById(id) {
		return apiClient.get(`/api/newsletter-subscriptions/${id}`);
	}

	async create(data) {
		return apiClient.post("/api/newsletter-subscriptions", data);
	}

	async delete(id) {
		return apiClient.delete(`/api/newsletter-subscriptions/${id}`);
	}
}

const newsletterSubscriptionsApi = new NewsletterSubscriptionsApi();
export default newsletterSubscriptionsApi;
