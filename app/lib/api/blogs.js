import apiClient from "./client";

class BlogsApi {
	// Get all blogs with search and pagination
	async getAll(params = {}) {
		try {
			const { search = '', page = 1, limit = 10 } = params;
			const queryParams = new URLSearchParams();
			if (search) queryParams.append('search', search);
			queryParams.append('page', page.toString());
			queryParams.append('limit', limit.toString());
			
			const result = await apiClient.get(`/api/blogs?${queryParams.toString()}`);
			return result;
		} catch (error) {
			console.error('BlogsApi: Error fetching blogs:', error);
			throw error;
		}
	}

	// Get blog by slug or ID
	async getBySlug(slug) {
		try {
			const result = await apiClient.get("/api/blogs", { slug });
			return result;
		} catch (error) {
			console.error('BlogsApi: Error fetching blog:', error);
			throw error;
		}
	}

	// Get blog by ID
	async getById(id) {
		try {
			const result = await apiClient.get(`/api/blogs/${id}`);
			return result;
		} catch (error) {
			console.error('BlogsApi: Error fetching blog by ID:', error);
			throw error;
		}
	}

	// Create new blog
	async create(blogData) {
		try {
			const result = await apiClient.post("/api/blogs", blogData);
			return result;
		} catch (error) {
			console.error('BlogsApi: Error creating blog:', error);
			throw error;
		}
	}

	// Update existing blog
	async update(id, blogData) {
		try {
			const result = await apiClient.put(`/api/blogs/${id}`, blogData);
			return result;
		} catch (error) {
			console.error('BlogsApi: Error updating blog:', error);
			throw error;
		}
	}

	// Delete blog by id
	async delete(id) {
		try {
			const result = await apiClient.delete(`/api/blogs/${id}`);
			return result;
		} catch (error) {
			console.error('BlogsApi: Error deleting blog:', error);
			throw error;
		}
	}
}

const blogsApi = new BlogsApi();
export default blogsApi;
