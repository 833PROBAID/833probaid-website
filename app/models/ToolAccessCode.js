import mongoose from "mongoose";

const toolAccessCodeSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			maxlength: 180,
			index: true,
		},
		codeHash: { type: String, required: true },
		expiresAt: { type: Date, required: true, expires: 0 },
		attempts: { type: Number, default: 0 },
		firstName: { type: String, required: true, trim: true, maxlength: 70 },
		lastName: { type: String, required: true, trim: true, maxlength: 70 },
		phone: { type: String, required: true, trim: true, maxlength: 40 },
		toolPage: { type: String, required: true, trim: true, maxlength: 120 },
		pageUrl: { type: String, default: "", trim: true, maxlength: 500 },
		ipAddress: { type: String, default: "", maxlength: 120 },
	},
	{ timestamps: true, versionKey: false },
);

if (mongoose.models.ToolAccessCode) {
	delete mongoose.models.ToolAccessCode;
}

const ToolAccessCode = mongoose.model("ToolAccessCode", toolAccessCodeSchema);

export default ToolAccessCode;
