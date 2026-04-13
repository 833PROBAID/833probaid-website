import connectToDatabase from "../utils/db.js";
import Blog from "../models/Blog.js";
import { unstable_cache } from "next/cache";

const getPublishedBlogsFirstPageCached = unstable_cache(
	async () => {
		await connectToDatabase();

		const page = 1;
			   const limit = 5;
		const query = { status: "published" };

		const [blogs, total] = await Promise.all([
			Blog.find(query).sort({ publishedDate: -1, _id: -1 }).limit(limit).lean(),
			Blog.countDocuments(query),
		]);

		return {
			blogs,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
				hasMore: page * limit < total,
			},
		};
	},
	["blogs-first-page-v1"],
	{ revalidate: 300, tags: ["blogs"] },
);

// Get all blogs with search and pagination
export async function getAllBlogs(options = {}) {
	await connectToDatabase();
	
	const { search = '', page = 1, limit = 5 } = options;
	const skip = (page - 1) * limit;
	
	// Build search query
	const query = {};
	if (search) {
		query.$or = [
			{ title: { $regex: search, $options: 'i' } },
			{ description: { $regex: search, $options: 'i' } },
			{ tags: { $regex: search, $options: 'i' } },
			{ category: { $regex: search, $options: 'i' } },
			{ author: { $regex: search, $options: 'i' } },
		];
	}
	
	const [blogs, total] = await Promise.all([
		Blog.find(query)
			.sort({ publishedDate: -1 })
			.skip(skip)
			.limit(limit),
		Blog.countDocuments(query),
	]);
	
	return {
		blogs,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
			hasMore: page * limit < total,
		},
	};
}

// Get blog by ID
export async function getBlogById(blogId) {
	await connectToDatabase();
	return Blog.findById(blogId);
}

// Get blog by slug
export async function getBlogBySlug(slug) {
	await connectToDatabase();
	return Blog.findOne({ slug });
}

// Create new blog
export async function createBlog(blogData) {
	await connectToDatabase();

	if (!blogData.slug) {
		throw new Error("Slug is required. Please set canonical URL with a slug.");
	}

	const blog = await Blog.create({
		...blogData,
		publishedDate: new Date(),
		modifiedDate: new Date(),
	});

	return blog;
}

// Update existing blog
export async function updateBlog(blogId, blogData) {
	await connectToDatabase();
	
	const blog = await Blog.findById(blogId);
	if (!blog) {
		return null;
	}

	// Update fields
	Object.keys(blogData).forEach((key) => {
		if (key !== "id" && key !== "_id" && blogData[key] !== undefined) {
			blog[key] = blogData[key];
		}
	});

	blog.modifiedDate = new Date();
	await blog.save();

	return blog;
}

// Delete blog
export async function deleteBlog(blogId) {
	await connectToDatabase();
	return Blog.findByIdAndDelete(blogId);
}

// Increment view count
export async function incrementBlogViews(blogId) {
	await connectToDatabase();
	return Blog.findByIdAndUpdate(
		blogId,
		{ $inc: { views: 1 } },
		{ new: true }
	);
}

export async function getPublishedBlogsFirstPage() {
	return getPublishedBlogsFirstPageCached();
}

export async function getPublishedBlogSlugs() {
	await connectToDatabase();

	const rows = await Blog.find({ status: "published" })
		.select({ slug: 1, _id: 0 })
		.sort({ publishedDate: -1, _id: -1 })
		.lean();

	return rows
		.map((row) => row?.slug)
		.filter((slug) => typeof slug === "string" && slug.length > 0);
}

// Get adjacent published blogs using listing order (publishedDate desc, _id desc)
export async function getAdjacentPublishedBlogs({ publishedDate, blogId }) {
	await connectToDatabase();

	const currentDate = new Date(publishedDate);
	if (!blogId || Number.isNaN(currentDate.getTime())) {
		return { previous: null, next: null };
	}

	const [previous, next] = await Promise.all([
		Blog.findOne({
			status: "published",
			$or: [
				{ publishedDate: { $gt: currentDate } },
				{ publishedDate: currentDate, _id: { $gt: blogId } },
			],
		})
			.select({ slug: 1, title: 1, publishedDate: 1 })
			.sort({ publishedDate: 1, _id: 1 })
			.lean(),
		Blog.findOne({
			status: "published",
			$or: [
				{ publishedDate: { $lt: currentDate } },
				{ publishedDate: currentDate, _id: { $lt: blogId } },
			],
		})
			.select({ slug: 1, title: 1, publishedDate: 1 })
			.sort({ publishedDate: -1, _id: -1 })
			.lean(),
	]);

	return { previous, next };
}
