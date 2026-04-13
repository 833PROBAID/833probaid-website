import mongoose from "mongoose";

// Singleton document — only one AI config record ever exists
const aiConfigSchema = new mongoose.Schema(
	{
		systemPrompt: {
			type: String,
			required: false,
			default: "",
		},
		model: {
			type: String,
			required: true,
			default: "llama-3.1-8b-instant",
		},
		maxTokens: {
			type: Number,
			required: true,
			default: 500,
			min: 100,
			max: 8000,
		},
		temperature: {
			type: Number,
			required: true,
			default: 0.7,
			min: 0,
			max: 2,
		},
		// API key stored server-side only — never sent back in full to the client
		groqApiKey: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true },
);

const AiConfig =
	mongoose.models.AiConfig || mongoose.model("AiConfig", aiConfigSchema);

export default AiConfig;
