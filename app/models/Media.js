import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
	{
		filename: {
			type: String,
			required: true,
			trim: true,
		},
		originalName: {
			type: String,
			required: true,
			trim: true,
		},
		title: {
			type: String,
			trim: true,
			default: "",
		},
		description: {
			type: String,
			trim: true,
			maxlength: 500,
			default: "",
		},
		path: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		folder: {
			type: String,
			default: "/",
			trim: true,
		},
		fileType: {
			type: String,
			enum: ["image", "pdf", "document", "video", "audio", "other"],
			required: true,
		},
		mimeType: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			required: true,
		},
		tags: {
			type: [String],
			default: [],
		},
		uploadedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		isPublic: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

// Indexes for faster queries
mediaSchema.index({ folder: 1 });
mediaSchema.index({ fileType: 1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ title: "text", originalName: "text", description: "text" });

const Media = mongoose.models.Media || mongoose.model("Media", mediaSchema);

export default Media;
