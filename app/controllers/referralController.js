import * as referralService from "../services/referralService.js";

export async function handleGetAllReferrals(options = {}) {
	const { search = "", page = 1, limit = 20 } = options;
	const result = await referralService.getAllReferrals({ search, page, limit });
	return {
		success: true,
		referrals: result.referrals.map((r) => ({
			id: r._id.toString(),
			...r.toObject(),
		})),
		pagination: result.pagination,
	};
}

export async function handleGetReferralById(id) {
	const referral = await referralService.getReferralById(id);
	if (!referral) return { success: false, error: "Referral not found" };
	return {
		success: true,
		referral: { id: referral._id.toString(), ...referral.toObject() },
	};
}

export async function handleCreateReferral(data) {
	const referral = await referralService.createReferral(data);
	return {
		success: true,
		referral: { id: referral._id.toString(), ...referral.toObject() },
	};
}

export async function handleDeleteReferral(id) {
	const deleted = await referralService.deleteReferral(id);
	if (!deleted) return { success: false, error: "Referral not found" };
	return { success: true };
}
