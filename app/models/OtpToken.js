import mongoose from "mongoose";

const otpTokenSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		action: {
			type: String,
			required: true,
			enum: ["signup", "login", "password_reset"],
		},
		codeHash: {
			type: String,
			required: true,
			select: false,
		},
		expiresAt: {
			type: Date,
			required: true,
			expires: 0,
		},
		attempts: {
			type: Number,
			default: 0,
		},
		ipAddress: {
			type: String,
			maxlength: 45,
		},
		userAgent: {
			type: String,
			maxlength: 512,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

otpTokenSchema.index({ user: 1, action: 1, createdAt: -1 });

const OtpToken =
	mongoose.models.OtpToken || mongoose.model("OtpToken", otpTokenSchema);

export default OtpToken;
