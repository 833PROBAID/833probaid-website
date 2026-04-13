import apiClient from "./client";

class HomeBooksApi {
	// Get all home books with search and pagination
	async getAll(params = {}) {
		try {
			const { search = "", page = 1, limit = 10, homepage = false } = params;
			const queryParams = new URLSearchParams();
			if (search) queryParams.append("search", search);
			queryParams.append("page", page.toString());
			queryParams.append("limit", limit.toString());
			if (homepage) queryParams.append("homepage", "true");

			const result = await apiClient.get(
				`/api/homeBooks?${queryParams.toString()}`,
			);
			return result;
		} catch (error) {
			console.error("HomeBooksApi: Error fetching home books:", error);
			throw error;
		}
	}

	// Get home book by slug
	async getBySlug(slug) {
		try {
			const result = await apiClient.get(`/api/homeBooks/${slug}`);
			return result;
		} catch (error) {
			console.error("HomeBooksApi: Error fetching home book:", error);
			throw error;
		}
	}

	// Get home book by ID
	async getById(id) {
		try {
			const result = await apiClient.get(`/api/homeBooks/${id}`);
			return result;
		} catch (error) {
			console.error("HomeBooksApi: Error fetching home book by ID:", error);
			throw error;
		}
	}

	// Create new home book
	async create(homeBookData) {
		try {
			const result = await apiClient.post("/api/homeBooks", homeBookData);
			return result;
		} catch (error) {
			console.error("HomeBooksApi: Error creating home book:", error);
			throw error;
		}
	}

	// Update existing home book
	async update(id, homeBookData) {
		try {
			const result = await apiClient.put(`/api/homeBooks/${id}`, homeBookData);
			return result;
		} catch (error) {
			console.error("HomeBooksApi: Error updating home book:", error);
			throw error;
		}
	}

	// Delete home book by id
	async delete(id) {
		try {
			const result = await apiClient.delete(`/api/homeBooks/${id}`);
			return result;
		} catch (error) {
			console.error("HomeBooksApi: Error deleting home book:", error);
			throw error;
		}
	}
}

const homeBooksApi = new HomeBooksApi();
export default homeBooksApi;