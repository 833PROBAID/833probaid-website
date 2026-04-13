import { NextResponse } from "next/server";
import connectToDatabase from "@/app/utils/db";
import AiConfig from "@/app/models/AiConfig";

const MASKED_KEY = "***saved***";

async function getOrCreateConfig() {
	let config = await AiConfig.findOne({});
	if (!config) {
		config = await AiConfig.create({});
	}
	return config;
}

export async function GET(request) {
	try {
		await connectToDatabase();
		const config = await getOrCreateConfig();

		return NextResponse.json({
			systemPrompt: config.systemPrompt,
			model: config.model,
			maxTokens: config.maxTokens,
			temperature: config.temperature,
			// Never send the real key — show masking placeholder if one is stored
			groqApiKey: config.groqApiKey ? MASKED_KEY : "",
		});
	} catch (error) {
		console.error("AI config GET error:", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function PUT(request) {
	try {
		await connectToDatabase();
		const body = await request.json();

		const { systemPrompt, model, maxTokens, temperature, groqApiKey } = body;

		const config = await getOrCreateConfig();

		if (systemPrompt !== undefined) config.systemPrompt = systemPrompt;
		if (model !== undefined) config.model = model;
		if (maxTokens !== undefined) config.maxTokens = Number(maxTokens);
		if (temperature !== undefined) config.temperature = Number(temperature);

		// Only overwrite the stored key if the client sent a real (non-masked) value
		if (groqApiKey !== undefined && groqApiKey !== MASKED_KEY) {
			config.groqApiKey = groqApiKey;
		}

		await config.save();

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("AI config PUT error:", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
