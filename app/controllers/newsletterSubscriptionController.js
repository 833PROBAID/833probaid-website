import * as newsletterSubscriptionService from "../services/newsletterSubscriptionService.js";

export async function handleGetAllNewsletterSubscriptions(options = {}) {
	const {
		search = "",
		sourceType = "",
		capturePoint = "",
		page = 1,
		limit = 20,
	} = options;

	const result = await newsletterSubscriptionService.getAllNewsletterSubscriptions({
		search,
		sourceType,
		capturePoint,
		page,
		limit,
	});

	return {
		success: true,
		subscriptions: result.subscriptions.map((subscription) => ({
			id: subscription._id.toString(),
			...subscription.toObject(),
		})),
		pagination: result.pagination,
	};
}

export async function handleGetNewsletterSubscriptionById(id) {
	const subscription =
		await newsletterSubscriptionService.getNewsletterSubscriptionById(id);

	if (!subscription) {
		return { success: false, error: "Newsletter subscription not found" };
	}

	return {
		success: true,
		subscription: { id: subscription._id.toString(), ...subscription.toObject() },
	};
}

export async function handleGetNewsletterSubscriptionByEmail(email) {
	const subscription =
		await newsletterSubscriptionService.getNewsletterSubscriptionByEmail(email);

	if (!subscription) {
		return { success: false, error: "Newsletter subscription not found" };
	}

	return {
		success: true,
		subscription: { id: subscription._id.toString(), ...subscription.toObject() },
	};
}

export async function handleCreateNewsletterSubscription(data) {
	const subscription =
		await newsletterSubscriptionService.createNewsletterSubscription(data);

	return {
		success: true,
		subscription: { id: subscription._id.toString(), ...subscription.toObject() },
	};
}

export async function handleDeleteNewsletterSubscription(id) {
	const deleted = await newsletterSubscriptionService.deleteNewsletterSubscription(id);

	if (!deleted) {
		return { success: false, error: "Newsletter subscription not found" };
	}

	return { success: true };
}
