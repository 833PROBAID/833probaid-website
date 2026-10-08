import mongoose from "mongoose";

const sourceDetailsSchema = new mongoose.Schema(
	{
		source: { type: String, default: "", trim: true, maxlength: 120 },
		medium: { type: String, default: "", trim: true, maxlength: 120 },
		campaign: { type: String, default: "", trim: true, maxlength: 180 },
		term: { type: String, default: "", trim: true, maxlength: 180 },
		content: { type: String, default: "", trim: true, maxlength: 180 },
		referrer: { type: String, default: "", trim: true, maxlength: 500 },
	},
	{ _id: false },
);

const metaSchema = new mongoose.Schema(
	{
		userAgent: { type: String, default: "", trim: true, maxlength: 500 },
		ipAddress: { type: String, default: "", trim: true, maxlength: 120 },
	},
	{ _id: false },
);

const newsletterSubscriptionSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true, trim: true, maxlength: 140 },
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			maxlength: 180,
			unique: true,
		},
		phone: { type: String, required: true, trim: true, maxlength: 40 },
		capturePoint: {
			type: String,
			trim: true,
			default: "footer",
			maxlength: 80,
			index: true,
		},
		pageUrl: { type: String, default: "", trim: true, maxlength: 500 },
		sourceType: {
			type: String,
			enum: ["website", "newsletter"],
			default: "website",
			index: true,
		},
		sourceDetails: { type: sourceDetailsSchema, default: () => ({}) },
		meta: { type: metaSchema, default: () => ({}) },
		submittedAt: { type: Date, default: Date.now, index: true },
	},
	{ timestamps: true },
);

newsletterSubscriptionSchema.index({ submittedAt: -1, sourceType: 1 });
newsletterSubscriptionSchema.index({ capturePoint: 1, submittedAt: -1 });
newsletterSubscriptionSchema.index({ email: 1 }, { unique: true });

if (mongoose.models.NewsletterSubscription) {
	delete mongoose.models.NewsletterSubscription;
}

const NewsletterSubscription = mongoose.model(
	"NewsletterSubscription",
	newsletterSubscriptionSchema,
);

export default NewsletterSubscription;
