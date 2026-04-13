import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			maxlength: 500,
		},
		category: {
			type: String,
			trim: true,
			default: "Uncategorized",
		},
		tags: {
			type: [String],
			default: [],
		},
		author: {
			type: String,
			trim: true,
			default: "Anonymous",
		},
		image: {
			type: String,
			trim: true,
		},
		readingTime: {
			type: String,
			default: "5 min read",
		},
		views: {
			type: Number,
			default: 0,
		},
		content: {
			type: mongoose.Schema.Types.Mixed,
			default: {},
		},
		publishedDate: {
			type: Date,
			default: Date.now,
		},
		modifiedDate: {
			type: Date,
			default: Date.now,
		},
		status: {
			type: String,
			enum: ["draft", "published", "archived"],
			default: "published",
		},
		videoLink: {
			type: String,
			trim: true,
			default: "",
		},
		seo: {
			metaTitle: { type: String, trim: true, default: "" },
			metaDescription: { type: String, trim: true, default: "" },
			keywords: { type: String, trim: true, default: "" },
			canonicalUrl: { type: String, trim: true, default: "" },
			ogTitle: { type: String, trim: true, default: "" },
			ogDescription: { type: String, trim: true, default: "" },
			ogImage: { type: String, trim: true, default: "" },
			ogImageAlt: { type: String, trim: true, default: "" },
			ogType: { type: String, trim: true, default: "article" },
			twitterCard: { type: String, trim: true, default: "summary_large_image" },
			twitterSite: { type: String, trim: true, default: "" },
			twitterTitle: { type: String, trim: true, default: "" },
			twitterDescription: { type: String, trim: true, default: "" },
			twitterImage: { type: String, trim: true, default: "" },
			twitterCreator: { type: String, trim: true, default: "" },
			robots: { type: String, trim: true, default: "index, follow" },
			googleBot: { type: String, trim: true, default: "" },
			structuredData: { type: mongoose.Schema.Types.Mixed, default: null },
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

// Update modifiedDate on save
blogSchema.pre("save", function (next) {
	this.modifiedDate = new Date();
	next();
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
