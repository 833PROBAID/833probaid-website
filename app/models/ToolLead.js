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

const toolLeadSchema = new mongoose.Schema(
	{
		firstName: { type: String, default: "", trim: true, maxlength: 70 },
		lastName: { type: String, default: "", trim: true, maxlength: 70 },
		fullName: { type: String, required: true, trim: true, maxlength: 140 },
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			maxlength: 180,
		},
		phone: { type: String, default: "", trim: true, maxlength: 40 },
		company: { type: String, default: "", trim: true, maxlength: 140 },
		role: { type: String, default: "", trim: true, maxlength: 100 },
		notes: { type: String, default: "", trim: true, maxlength: 1000 },
		toolPage: { type: String, required: true, trim: true, maxlength: 120 },
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
		verified: { type: Boolean, default: false, index: true },
		verifiedAt: { type: Date, default: null },
		firstTool: { type: String, default: "", trim: true, maxlength: 120 },
		lastToolUsed: { type: String, default: "", trim: true, maxlength: 120 },
		firstAccess: { type: Date, default: null },
		lastAccess: { type: Date, default: null },
		totalToolUses: { type: Number, default: 0 },
		accessExpiresAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

toolLeadSchema.index({ toolPage: 1, submittedAt: -1 });
toolLeadSchema.index({ email: 1, submittedAt: -1 });

if (mongoose.models.ToolLead) {
	delete mongoose.models.ToolLead;
}

const ToolLead = mongoose.model("ToolLead", toolLeadSchema);

export default ToolLead;
