import connectToDatabase from "../utils/db.js";
import NewsletterSubscription from "../models/NewsletterSubscription.js";

const ALLOWED_SOURCE_TYPES = new Set(["website", "newsletter"]);

export async function getAllNewsletterSubscriptions(options = {}) {
	await connectToDatabase();

	const {
		search = "",
		sourceType = "",
		capturePoint = "",
		page = 1,
		limit = 20,
	} = options;

	const safePage = Math.max(Number(page) || 1, 1);
	const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
	const skip = (safePage - 1) * safeLimit;

	const query = {};
	const normalizedSearch = String(search || "").trim();
	if (normalizedSearch) {
		query.$or = [
			{ fullName: { $regex: normalizedSearch, $options: "i" } },
			{ email: { $regex: normalizedSearch, $options: "i" } },
			{ phone: { $regex: normalizedSearch, $options: "i" } },
			{ pageUrl: { $regex: normalizedSearch, $options: "i" } },
			{ "sourceDetails.source": { $regex: normalizedSearch, $options: "i" } },
			{ "sourceDetails.campaign": { $regex: normalizedSearch, $options: "i" } },
		];
	}

	if (ALLOWED_SOURCE_TYPES.has(sourceType)) {
		query.sourceType = sourceType;
	}

	const normalizedCapturePoint = String(capturePoint || "").trim();
	if (normalizedCapturePoint) {
		query.capturePoint = { $regex: normalizedCapturePoint, $options: "i" };
	}

	const [subscriptions, total] = await Promise.all([
		NewsletterSubscription.find(query)
			.sort({ submittedAt: -1 })
			.skip(skip)
			.limit(safeLimit),
		NewsletterSubscription.countDocuments(query),
	]);

	return {
		subscriptions,
		pagination: {
			page: safePage,
			limit: safeLimit,
			total,
			totalPages: Math.ceil(total / safeLimit),
			hasMore: safePage * safeLimit < total,
		},
	};
}

export async function getNewsletterSubscriptionById(id) {
	await connectToDatabase();
	return NewsletterSubscription.findById(id);
}

export async function getNewsletterSubscriptionByEmail(email) {
	await connectToDatabase();
	const normalizedEmail = String(email || "").trim().toLowerCase();
	if (!normalizedEmail) return null;

	return NewsletterSubscription.findOne({ email: normalizedEmail });
}

export async function createNewsletterSubscription(data) {
	await connectToDatabase();
	return NewsletterSubscription.create(data);
}

export async function deleteNewsletterSubscription(id) {
	await connectToDatabase();
	return NewsletterSubscription.findByIdAndDelete(id);
}
