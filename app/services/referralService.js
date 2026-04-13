import { unlink } from "fs/promises";
import path from "path";
import connectToDatabase from "../utils/db.js";
import Referral from "../models/Referral.js";

export async function getAllReferrals(options = {}) {
	await connectToDatabase();
	const { search = "", page = 1, limit = 20 } = options;
	const skip = (page - 1) * limit;

	const query = {};
	if (search) {
		query.$or = [
			{ referringPartyName: { $regex: search, $options: "i" } },
			{ referringEmail: { $regex: search, $options: "i" } },
			{ clientName: { $regex: search, $options: "i" } },
			{ propertyAddress: { $regex: search, $options: "i" } },
			{ caseNumber: { $regex: search, $options: "i" } },
		];
	}

	const [referrals, total] = await Promise.all([
		Referral.find(query).sort({ submittedAt: -1 }).skip(skip).limit(limit),
		Referral.countDocuments(query),
	]);

	return {
		referrals,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
			hasMore: page * limit < total,
		},
	};
}

export async function getReferralById(id) {
	await connectToDatabase();
	return Referral.findById(id);
}

export async function createReferral(data) {
	await connectToDatabase();
	return Referral.create(data);
}

export async function deleteReferral(id) {
	await connectToDatabase();
	const referral = await Referral.findById(id);
	if (!referral) return null;

	// Delete uploaded files from disk
	if (referral.uploadedFiles && referral.uploadedFiles.length > 0) {
		await Promise.allSettled(
			referral.uploadedFiles.map((file) => {
				const filePath = typeof file === "string" ? file : file.path;
				const absPath = path.join(process.cwd(), "public", filePath);
				return unlink(absPath).catch(() => {});
			}),
		);
	}

	return Referral.findByIdAndDelete(id);
}
