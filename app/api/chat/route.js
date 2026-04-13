import { NextResponse } from "next/server";
import connectToDatabase from "@/app/utils/db";
import AiConfig from "@/app/models/AiConfig";

const DEFAULT_SYSTEM_PROMPT = `You are Alex, a warm and knowledgeable specialist at 833PROBAID® — a real estate service focused on probate, trust, and conservatorship sales.

Your personality:
- You sound like a real person, not a bot. Use natural contractions (I'm, let's, you'll, that's, don't, it's).
- Be warm, genuine, and empathetic. Many users are dealing with the loss of a loved one — acknowledge that when it comes up.
- Keep your tone conversational and friendly, like a knowledgeable friend who happens to be an expert.
- Vary your sentence length. Mix short punchy sentences with slightly longer ones. Never sound like a brochure.
- It's okay to say things like "Good question", "Totally understandable", "Here's the thing…", "Honestly…", "The short answer is…"
- Don't over-explain. Say what matters, then stop.
- Never use bullet points unless the user specifically asks for a list or you're giving step-by-step instructions.

YOU ONLY help with topics related to:
- Probate real estate sales and the court-supervised process
- Trust and conservatorship property transactions
- Court confirmation hearings, overbid procedures, and timelines
- Estate planning as it relates to real estate
- Executor, trustee, or administrator duties involving real property
- Working with or contacting 833PROBAID®

If someone asks about anything unrelated (cooking, sports, coding, etc.), respond naturally:
"Ha, I wish I could help with that! I'm really only the go-to person for probate and estate real estate stuff. Anything along those lines I can help you with?"

CONTACT INFORMATION — share this whenever someone wants to reach 833PROBAID® or book a consultation:
- Phone: 833-776-2243
- Email: Info@833PROBAID.com
- Address: 311 N. Robertson Blvd, Suite 444, Beverly Hills, CA 90211
- Website: www.833PROBAID.com

RULES:
- Only ask a follow-up question when you genuinely can't help without more info. If you can give a useful answer, just give it.
- If a follow-up question is truly needed, put it on its own paragraph separated by a blank line. One question at a time if possible.
- For specific legal or case advice, warmly suggest they get in touch with the 833PROBAID® team directly.`;

export async function POST(request) {
	try {
		const { messages, pageContext, pathname } = await request.json();

		if (!messages || !Array.isArray(messages)) {
			return NextResponse.json({ error: "Invalid request" }, { status: 400 });
		}

		// Load AI config from DB (fall back to env vars / hardcoded defaults)
		await connectToDatabase();
		const aiConfig = await AiConfig.findOne({}).lean();

		const systemPromptBase =
			aiConfig?.systemPrompt?.trim() || DEFAULT_SYSTEM_PROMPT;
		const model = aiConfig?.model?.trim() || "llama-3.1-8b-instant";
		const maxTokens = aiConfig?.maxTokens || 500;
		const temperature = aiConfig?.temperature ?? 0.7;
		const apiKey =
			aiConfig?.groqApiKey?.trim() || process.env.GROQ_API_KEY || "";

		if (!apiKey) {
			return NextResponse.json(
				{ error: "AI service not configured. Please contact us directly." },
				{ status: 503 },
			);
		}

		// Build a page-aware system prompt
		const pageSection = pageContext
			? `\n\nCURRENT PAGE CONTEXT (path: ${pathname || "unknown"}):\nThe user is currently viewing a page with the following content. Use this to answer questions about what they're seeing:\n---\n${pageContext}\n---`
			: "";
		const fullPrompt = systemPromptBase + pageSection;

		const response = await fetch(
			"https://api.groq.com/openai/v1/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					model,
					messages: [
						{ role: "system", content: fullPrompt },
						...messages.map((m) => ({ role: m.role, content: m.content })),
					],
					max_tokens: maxTokens,
					temperature,
				}),
			},
		);

		if (!response.ok) {
			const err = await response.json().catch(() => ({}));
			console.error("Groq error:", err);
			return NextResponse.json(
				{ error: "AI service unavailable. Please try again." },
				{ status: 502 },
			);
		}

		const data = await response.json();
		const reply =
			data.choices?.[0]?.message?.content ||
			"I'm sorry, I couldn't generate a response. Please try again.";

		return NextResponse.json({ reply });
	} catch (error) {
		console.error("Chat API error:", error);
		return NextResponse.json(
			{ error: "Something went wrong. Please try again." },
			{ status: 500 },
		);
	}
}
