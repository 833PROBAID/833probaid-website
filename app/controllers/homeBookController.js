import * as homeBookService from "../services/homeBookService.js";

export async function handleGetAllHomeBooks(options = {}) {
	try {
		const result = await homeBookService.getAllHomeBooks(options);
		const homeBooks = result.homeBooks.map((homeBook) => {
			const bookObj = typeof homeBook?.toObject === "function" ? homeBook.toObject() : homeBook;
			if (options.homepage) {
				// Return only necessary fields for homepage
				return {
					id: (bookObj?._id || homeBook?._id)?.toString?.() || String(bookObj?._id || homeBook?._id),
					title: bookObj.title,
					subtitle: bookObj.subtitle,
					image: bookObj.image,
					slug: bookObj.slug,
					icon: bookObj.icon,
					description: bookObj.description,
				};
			}
			return {
				id: (bookObj?._id || homeBook?._id)?.toString?.() || String(bookObj?._id || homeBook?._id),
				...bookObj,
			};
		});
		return {
			success: true,
			homeBooks,
			pagination: result.pagination,
		};
	} catch (error) {
		console.error("Error fetching home books:", error);
		throw new Error("Failed to fetch home books");
	}
}

export async function handleGetHomeBookById(homeBookId) {
	try {
		// Check if it's a valid MongoDB ObjectId (24 character hex string)
		const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(homeBookId);

		let homeBook;
		if (isValidObjectId) {
			homeBook = await homeBookService.getHomeBookById(homeBookId);
		} else {
			// Treat as slug
			homeBook = await homeBookService.getHomeBookBySlug(homeBookId);
		}

		if (!homeBook) {
			return { success: false, error: "Home book not found" };
		}

		// Increment view count
		await homeBookService.incrementHomeBookViews(homeBook._id.toString());

		return {
			success: true,
			homeBook: {
				id: homeBook._id.toString(),
				...homeBook.toObject(),
			},
		};
	} catch (error) {
		console.error("Error fetching home book:", error);
		throw new Error("Failed to fetch home book");
	}
}

export async function handleGetHomeBookBySlug(slug) {
	try {
		const homeBook = await homeBookService.getHomeBookBySlug(slug);
		if (!homeBook) {
			return { success: false, error: "Home book not found" };
		}

		return {
			success: true,
			homeBook: {
				id: homeBook._id.toString(),
				...homeBook.toObject(),
			},
		};
	} catch (error) {
		console.error("Error fetching home book:", error);
		throw new Error("Failed to fetch home book");
	}
}

export async function handleCreateHomeBook(homeBookData) {
	try {
		const homeBook = await homeBookService.createHomeBook(homeBookData);
		return {
			success: true,
			homeBook: {
				id: homeBook._id.toString(),
				...homeBook.toObject(),
			},
		};
	} catch (error) {
		console.error("Error creating home book:", error);
		throw new Error("Failed to create home book");
	}
}

export async function handleUpdateHomeBook(homeBookId, homeBookData) {
	try {
		const homeBook = await homeBookService.updateHomeBook(
			homeBookId,
			homeBookData,
		);
		if (!homeBook) {
			return { success: false, error: "Home book not found" };
		}

		return {
			success: true,
			homeBook: {
				id: homeBook._id.toString(),
				...homeBook.toObject(),
			},
		};
	} catch (error) {
		console.error("Error updating home book:", error);
		throw new Error("Failed to update home book");
	}
}

export async function handleDeleteHomeBook(homeBookId) {
	try {
		const homeBook = await homeBookService.deleteHomeBook(homeBookId);
		if (!homeBook) {
			return { success: false, error: "Home book not found" };
		}

		return {
			success: true,
			message: "Home book deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting home book:", error);
		throw new Error("Failed to delete home book");
	}
}
