// Constant Contact sends you back here after you click Allow.
// It shows your refresh token ONCE so you can save it in Vercel as CTCT_REFRESH_TOKEN.
import { ctctExchangeCode } from "@/app/lib/constantContact";

export const dynamic = "force-dynamic";

const page = (title, body) =>
	new Response(
		`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 16px;color:#1f2937">
<h1 style="color:#0097A7">${title}</h1>${body}</body></html>`,
		{ headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
	);

export async function GET(request) {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const saved = request.cookies?.get?.("ctct_state")?.value || (request.headers.get("cookie") || "").match(/ctct_state=([a-f0-9]+)/)?.[1];
	if (url.searchParams.get("error")) return page("Not connected", `<p>${url.searchParams.get("error_description") || url.searchParams.get("error")}</p>`);
	if (!code || !state || state !== saved) return page("Not connected", "<p>This link expired. Open /api/constant-contact/connect again.</p>");
	try {
		const tokens = await ctctExchangeCode(code, `${url.origin}/api/constant-contact/callback`);
		if (!tokens.refresh_token) return page("Almost", "<p>Constant Contact didn’t return a refresh token. Make sure the app uses Long Lived Refresh Tokens.</p>");
		return page(
			"Constant Contact connected",
			`<p><b>Copy this code now.</b> It is shown only once.</p>
<textarea readonly style="width:100%;height:90px;font-size:14px;padding:8px">${tokens.refresh_token}</textarea>
<ol><li>Vercel → 833probaid-website → Settings → Environment Variables → Add Environment Variable</li>
<li>Type: Secret · Key: <b>CTCT_REFRESH_TOKEN</b> · Value: the code above · Environments: Production and Preview</li>
<li>Save, then Redeploy.</li></ol>`,
		);
	} catch (err) {
		return page("Not connected", `<p>${String(err.message || err)}</p>`);
	}
}
