// Constant Contact helper — adds website subscribers to the "WEBSITE SUBSCRIBERS" list.
// Uses the keys saved in Vercel: CTCT_CLIENT_ID, CTCT_CLIENT_SECRET, CTCT_REFRESH_TOKEN.

const AUTH_BASE = "https://authentication.constantcontact.com/oauth2/default/v1";
const API_BASE = "https://api.cc.email/v3";
const LIST_NAME = process.env.CTCT_LIST_NAME || "WEBSITE SUBSCRIBERS";

let cachedToken = null; // { token, expiresAt }
let cachedListId = null;

function basicAuth() {
	const id = process.env.CTCT_CLIENT_ID || "";
	const secret = process.env.CTCT_CLIENT_SECRET || "";
	return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

export function ctctAuthorizeUrl(redirectUri, state) {
	const params = new URLSearchParams({
		client_id: process.env.CTCT_CLIENT_ID || "",
		redirect_uri: redirectUri,
		response_type: "code",
		scope: "contact_data offline_access",
		state,
	});
	return `${AUTH_BASE}/authorize?${params.toString()}`;
}

export async function ctctExchangeCode(code, redirectUri) {
	const res = await fetch(`${AUTH_BASE}/token`, {
		method: "POST",
		headers: { Authorization: basicAuth(), "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
		body: new URLSearchParams({ code, redirect_uri: redirectUri, grant_type: "authorization_code" }).toString(),
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.error_description || data.error || `Token exchange failed (${res.status})`);
	return data; // { access_token, refresh_token, expires_in, ... }
}

async function getAccessToken() {
	if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token;
	const refresh = process.env.CTCT_REFRESH_TOKEN;
	if (!refresh) throw new Error("CTCT_REFRESH_TOKEN is missing in Vercel");
	const res = await fetch(`${AUTH_BASE}/token`, {
		method: "POST",
		headers: { Authorization: basicAuth(), "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
		body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }).toString(),
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.error_description || data.error || `Token refresh failed (${res.status})`);
	cachedToken = { token: data.access_token, expiresAt: Date.now() + (Number(data.expires_in) || 3600) * 1000 };
	return cachedToken.token;
}

async function ctctFetch(path, options = {}) {
	const token = await getAccessToken();
	const res = await fetch(`${API_BASE}${path}`, {
		...options,
		headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json", ...(options.headers || {}) },
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		const msg = Array.isArray(data) ? data.map((e) => e.error_message).join("; ") : data.error_message || JSON.stringify(data);
		throw new Error(`Constant Contact ${res.status}: ${msg}`);
	}
	return data;
}

async function getListId() {
	if (process.env.CTCT_LIST_ID) return process.env.CTCT_LIST_ID;
	if (cachedListId) return cachedListId;
	const data = await ctctFetch("/contact_lists?limit=1000");
	const list = (data.lists || []).find((l) => String(l.name || "").trim().toLowerCase() === LIST_NAME.trim().toLowerCase());
	if (!list) throw new Error(`List "${LIST_NAME}" not found in Constant Contact`);
	cachedListId = list.list_id;
	return cachedListId;
}

function splitName(fullName = "") {
	const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
	if (!parts.length) return { first: "", last: "" };
	return { first: parts[0], last: parts.slice(1).join(" ") };
}

// Adds (or updates) one contact and puts them in WEBSITE SUBSCRIBERS.
export async function addWebsiteSubscriber({ email, fullName, firstName, lastName, phone }) {
	const cleanEmail = String(email || "").trim().toLowerCase();
	if (!cleanEmail) throw new Error("Email is required");
	const names = firstName || lastName ? { first: firstName || "", last: lastName || "" } : splitName(fullName);
	const listId = await getListId();
	const body = { email_address: cleanEmail, list_memberships: [listId] };
	if (names.first) body.first_name = names.first.slice(0, 50);
	if (names.last) body.last_name = names.last.slice(0, 50);
	const digits = String(phone || "").replace(/\D/g, "");
	if (digits) body.phone_number = digits.slice(-10);
	return ctctFetch("/contacts/sign_up_form", { method: "POST", body: JSON.stringify(body) });
}
