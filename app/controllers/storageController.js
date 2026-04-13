import * as storageService from "../services/storageService.js";

/**
 * Get storage statistics
 */
export const handleGetStorageStats = async () => {
	try {
		const stats = await storageService.getStorageStats();
		return {
			success: true,
			stats
		};
	} catch (error) {
		return {
			success: false,
			error: error.message
		};
	}
};

/**
 * Check storage limit before upload
 */
export const handleCheckStorageLimit = async (fileSize) => {
	try {
		const result = await storageService.checkStorageLimit(fileSize);
		return {
			success: true,
			...result
		};
	} catch (error) {
		return {
			success: false,
			error: error.message
		};
	}
};
