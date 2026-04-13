import * as blogService from "../services/blogService.js";

export async function handleGetAllBlogs(options = {}) {
	try {
		const { search = '', page = 1, limit = 10 } = options;
		const result = await blogService.getAllBlogs({ search, page, limit });
		
		return {
			success: true,
			blogs: result.blogs.map((blog) => ({
				id: blog._id.toString(),
				...blog.toObject(),
			})),
			pagination: result.pagination,
		};
	} catch (error) {
		console.error("Error fetching blogs:", error);
		throw new Error("Failed to fetch blogs");
	}
}

export async function handleGetBlogById(blogId) {
	try {
		// Check if it's a valid MongoDB ObjectId (24 character hex string)
		const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(blogId);
		
		let blog;
		if (isValidObjectId) {
			blog = await blogService.getBlogById(blogId);
		} else {
			// Treat as slug
			blog = await blogService.getBlogBySlug(blogId);
		}
		
		if (!blog) {
			return { success: false, error: "Blog not found" };
		}

		// Increment view count
		await blogService.incrementBlogViews(blog._id.toString());

		return {
			success: true,
			blog: {
				id: blog._id.toString(),
				...blog.toObject(),
			},
		};
	} catch (error) {
		console.error("Error fetching blog:", error);
		throw new Error("Failed to fetch blog");
	}
}

export async function handleGetBlogBySlug(slug) {
	try {
		const blog = await blogService.getBlogBySlug(slug);
		if (!blog) {
			return { success: false, error: "Blog not found" };
		}

		return {
			success: true,
			blog: {
				id: blog._id.toString(),
				...blog.toObject(),
			},
		};
	} catch (error) {
		console.error("Error fetching blog:", error);
		throw new Error("Failed to fetch blog");
	}
}

export async function handleCreateBlog(blogData) {
	try {
		const blog = await blogService.createBlog(blogData);
		return {
			success: true,
			blog: {
				id: blog._id.toString(),
				...blog.toObject(),
			},
		};
	} catch (error) {
		console.error("Error creating blog:", error);
		throw new Error("Failed to create blog");
	}
}

export async function handleUpdateBlog(blogId, blogData) {
	try {
		const blog = await blogService.updateBlog(blogId, blogData);
		if (!blog) {
			return { success: false, error: "Blog not found" };
		}

		return {
			success: true,
			blog: {
				id: blog._id.toString(),
				...blog.toObject(),
			},
		};
	} catch (error) {
		console.error("Error updating blog:", error);
		throw new Error("Failed to update blog");
	}
}

export async function handleDeleteBlog(blogId) {
	try {
		const blog = await blogService.deleteBlog(blogId);
		if (!blog) {
			return { success: false, error: "Blog not found" };
		}

		return {
			success: true,
			message: "Blog deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting blog:", error);
		throw new Error("Failed to delete blog");
	}
}
