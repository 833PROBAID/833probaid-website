import * as vendorService from "../services/vendorService.js";

export async function handleGetAllVendors(options = {}) {
	const { search = "", page = 1, limit = 20 } = options;
	const result = await vendorService.getAllVendors({ search, page, limit });
	return {
		success: true,
		vendors: result.vendors.map((v) => ({
			id: v._id.toString(),
			...v.toObject(),
		})),
		pagination: result.pagination,
	};
}

export async function handleGetVendorById(id) {
	const vendor = await vendorService.getVendorById(id);
	if (!vendor) return { success: false, error: "Vendor not found" };
	return {
		success: true,
		vendor: { id: vendor._id.toString(), ...vendor.toObject() },
	};
}

export async function handleCreateVendor(data) {
	const vendor = await vendorService.createVendor(data);
	return {
		success: true,
		vendor: { id: vendor._id.toString(), ...vendor.toObject() },
	};
}

export async function handleDeleteVendor(id) {
	const deleted = await vendorService.deleteVendor(id);
	if (!deleted) return { success: false, error: "Vendor not found" };
	return { success: true };
}
