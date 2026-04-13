const API_BASE = "/api/storage";

export const storageApi = {
	/**
	 * Get storage statistics
	 */
	async getStats() {
		try {
			const response = await fetch(API_BASE);
			return await response.json();
		} catch (error) {
			console.error("Error fetching storage stats:", error);
			return { success: false, error: error.message };
		}
	},

	/**
	 * Check storage limit before upload
	 */
	async checkLimit(fileSize) {
		try {
			const response = await fetch(API_BASE, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ fileSize }),
			});
			return await response.json();
		} catch (error) {
			console.error("Error checking storage limit:", error);
			return { success: false, error: error.message };
		}
	},
};

export default storageApi;
