import connectToDatabase from "../utils/db.js";
import HomeBook from "../models/HomeBook.js";
import { unstable_cache } from "next/cache";

const getPublishedHomeBooksForHomepageCached = unstable_cache(
	async () => {
		await connectToDatabase();

		return HomeBook.find({ status: "published" })
			.select({
				no: 1,
				title: 1,
				subtitle: 1,
				description: 1,
				slug: 1,
				icon: 1,
				image: 1,
			})
			.sort({ no: 1 })
			.limit(100)
			.lean();
	},
	["homebooks-homepage-v1"],
	{ revalidate: 300, tags: ["homebooks"] },
);

// Get all home books with search and pagination
export async function getAllHomeBooks(options = {}) {
	await connectToDatabase();

	const { search = "", page = 1, limit = 10 } = options;
	const skip = (page - 1) * limit;

	// Build search query
	const query = {};

	// For homepage, only show published homeBooks
	if (options.homepage) {
		query.status = "published";
	}

	if (search) {
		query.$or = [
			{ title: { $regex: search, $options: "i" } },
			{ subtitle: { $regex: search, $options: "i" } },
			{ tags: { $regex: search, $options: "i" } },
			{ category: { $regex: search, $options: "i" } },
			{ author: { $regex: search, $options: "i" } },
		];
	}

	const [homeBooks, total] = await Promise.all([
		(options.homepage
			? HomeBook.find(query)
					.select({
						no: 1,
						title: 1,
						subtitle: 1,
						image: 1,
						slug: 1,
						icon: 1,
						description: 1,
					})
					.sort({ no: 1 })
					.skip(skip)
					.limit(limit)
					.lean()
			: HomeBook.find(query).sort({ no: 1 }).skip(skip).limit(limit)),
		HomeBook.countDocuments(query),
	]);

	return {
		homeBooks,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
			hasMore: page * limit < total,
		},
	};
}

// Get home book by ID
export async function getHomeBookById(homeBookId) {
	await connectToDatabase();
	return HomeBook.findById(homeBookId);
}

// Get home book by slug
export async function getHomeBookBySlug(slug) {
	await connectToDatabase();
	return HomeBook.findOne({ slug });
}

// Create new home book
export async function createHomeBook(homeBookData) {
	await connectToDatabase();

	if (!homeBookData.slug) {
		throw new Error("Slug is required. Please set canonical URL with a slug.");
	}

	const homeBook = await HomeBook.create({
		...homeBookData,
		publishedDate: new Date(),
		modifiedDate: new Date(),
	});

	return homeBook;
}

// Update existing home book
export async function updateHomeBook(homeBookId, homeBookData) {
	await connectToDatabase();

	const homeBook = await HomeBook.findById(homeBookId);
	if (!homeBook) {
		return null;
	}

	// Update fields
	Object.keys(homeBookData).forEach((key) => {
		if (key !== "id" && key !== "_id" && homeBookData[key] !== undefined) {
			homeBook[key] = homeBookData[key];
		}
	});

	homeBook.modifiedDate = new Date();
	await homeBook.save();

	return homeBook;
}

// Delete home book
export async function deleteHomeBook(homeBookId) {
	await connectToDatabase();
	return HomeBook.findByIdAndDelete(homeBookId);
}

// Increment view count
export async function incrementHomeBookViews(homeBookId) {
	await connectToDatabase();
	return HomeBook.findByIdAndUpdate(
		homeBookId,
		{ $inc: { views: 1 } },
		{ new: true },
	);
}

export async function getPublishedHomeBooksForHomepage() {
	return getPublishedHomeBooksForHomepageCached();
}

export async function getPublishedHomeBookSlugs() {
	await connectToDatabase();

	const rows = await HomeBook.find({ status: "published" })
		.select({ slug: 1, _id: 0 })
		.sort({ no: 1 })
		.lean();

	return rows
		.map((row) => row?.slug)
		.filter((slug) => typeof slug === "string" && slug.length > 0);
}

// Get adjacent published home books by serial number (no)
export async function getAdjacentPublishedHomeBooksByNo(no) {
	await connectToDatabase();

	const parsedNo = Number(no);
	if (!Number.isFinite(parsedNo)) {
		return { previous: null, next: null };
	}

	const [previous, next] = await Promise.all([
		HomeBook.findOne({ status: "published", no: { $lt: parsedNo } })
			.select({ no: 1, slug: 1, title: 1 })
			.sort({ no: -1 })
			.lean(),
		HomeBook.findOne({ status: "published", no: { $gt: parsedNo } })
			.select({ no: 1, slug: 1, title: 1 })
			.sort({ no: 1 })
			.lean(),
	]);

	return { previous, next };
}
