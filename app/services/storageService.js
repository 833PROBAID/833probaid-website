import Media from "../models/Media.js";

/**
 * Get storage statistics
 */
export const getStorageStats = async () => {
	try {
		const allMedia = await Media.find({});

		// Calculate total storage used
		const totalUsed = allMedia.reduce((sum, item) => sum + (item.size || 0), 0);

		// Storage by file type
		const byType = {};
		const typeCategories = ["image", "pdf", "document", "video", "audio", "other"];
		
		typeCategories.forEach(type => {
			const typeMedia = allMedia.filter(item => item.fileType === type);
			byType[type] = {
				count: typeMedia.length,
				size: typeMedia.reduce((sum, item) => sum + (item.size || 0), 0)
			};
		});

		// Storage by folder
		const byFolder = {};
		allMedia.forEach(item => {
			const folder = item.folder || "/";
			if (!byFolder[folder]) {
				byFolder[folder] = {
					count: 0,
					size: 0
				};
			}
			byFolder[folder].count++;
			byFolder[folder].size += item.size || 0;
		});

		// Get largest files
		const largestFiles = allMedia
			.sort((a, b) => (b.size || 0) - (a.size || 0))
			.slice(0, 5)
			.map(item => ({
				id: item._id,
				filename: item.originalName,
				title: item.title,
				size: item.size,
				fileType: item.fileType,
				folder: item.folder,
				url: item.url
			}));

		// Storage limit (configurable - default 1GB)
		const storageLimit = process.env.STORAGE_LIMIT || 1024 * 1024 * 1024; // 1GB in bytes

		return {
			total: {
				used: totalUsed,
				limit: storageLimit,
				available: storageLimit - totalUsed,
				percentUsed: (totalUsed / storageLimit) * 100,
				fileCount: allMedia.length
			},
			byType,
			byFolder,
			largestFiles
		};
	} catch (error) {
		throw new Error(`Error getting storage stats: ${error.message}`);
	}
};

/**
 * Check if storage limit is exceeded
 */
export const checkStorageLimit = async (newFileSize = 0) => {
	try {
		const stats = await getStorageStats();
		const wouldExceed = (stats.total.used + newFileSize) > stats.total.limit;
		
		return {
			canUpload: !wouldExceed,
			currentUsed: stats.total.used,
			limit: stats.total.limit,
			available: stats.total.available,
			newFileSize,
			totalAfterUpload: stats.total.used + newFileSize
		};
	} catch (error) {
		throw new Error(`Error checking storage limit: ${error.message}`);
	}
};
