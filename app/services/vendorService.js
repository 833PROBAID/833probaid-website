import { unlink } from "fs/promises";
import path from "path";
import connectToDatabase from "../utils/db.js";
import Vendor from "../models/Vendor.js";

export async function getAllVendors(options = {}) {
	await connectToDatabase();
	const { search = "", page = 1, limit = 20 } = options;
	const skip = (page - 1) * limit;

	const query = {};
	if (search) {
		query.$or = [
			{ businessName: { $regex: search, $options: "i" } },
			{ yourName: { $regex: search, $options: "i" } },
			{ email: { $regex: search, $options: "i" } },
			{ headquarters: { $regex: search, $options: "i" } },
		];
	}

	const [vendors, total] = await Promise.all([
		Vendor.find(query).sort({ submittedAt: -1 }).skip(skip).limit(limit),
		Vendor.countDocuments(query),
	]);

	return {
		vendors,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
			hasMore: page * limit < total,
		},
	};
}

export async function getVendorById(id) {
	await connectToDatabase();
	return Vendor.findById(id);
}

export async function createVendor(data) {
	await connectToDatabase();
	return Vendor.create(data);
}

export async function deleteVendor(id) {
	await connectToDatabase();
	const vendor = await Vendor.findById(id);
	if (!vendor) return null;

	if (vendor.uploadedFiles && vendor.uploadedFiles.length > 0) {
		await Promise.allSettled(
			vendor.uploadedFiles.map((file) => {
				const filePath = typeof file === "string" ? file : file.path;
				const absPath = path.join(process.cwd(), "public", filePath);
				return unlink(absPath).catch(() => {});
			}),
		);
	}

	return Vendor.findByIdAndDelete(id);
}
