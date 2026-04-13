import connectToDatabase from "../utils/db.js";
import ToolLead from "../models/ToolLead.js";

const ALLOWED_SOURCE_TYPES = new Set(["website", "newsletter"]);

export async function getAllToolLeads(options = {}) {
	await connectToDatabase();

	const {
		search = "",
		sourceType = "",
		toolPage = "",
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
			{ company: { $regex: normalizedSearch, $options: "i" } },
			{ toolPage: { $regex: normalizedSearch, $options: "i" } },
			{ pageUrl: { $regex: normalizedSearch, $options: "i" } },
		];
	}

	if (ALLOWED_SOURCE_TYPES.has(sourceType)) {
		query.sourceType = sourceType;
	}

	const normalizedToolPage = String(toolPage || "").trim();
	if (normalizedToolPage) {
		query.toolPage = { $regex: normalizedToolPage, $options: "i" };
	}

	const [toolLeads, total] = await Promise.all([
		ToolLead.find(query).sort({ submittedAt: -1 }).skip(skip).limit(safeLimit),
		ToolLead.countDocuments(query),
	]);

	return {
		toolLeads,
		pagination: {
			page: safePage,
			limit: safeLimit,
			total,
			totalPages: Math.ceil(total / safeLimit),
			hasMore: safePage * safeLimit < total,
		},
	};
}

export async function getToolLeadById(id) {
	await connectToDatabase();
	return ToolLead.findById(id);
}

export async function createToolLead(data) {
	await connectToDatabase();
	return ToolLead.create(data);
}

export async function deleteToolLead(id) {
	await connectToDatabase();
	return ToolLead.findByIdAndDelete(id);
}
