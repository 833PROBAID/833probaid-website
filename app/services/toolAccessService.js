import crypto from "crypto";
import jwt from "jsonwebtoken";
import connectToDatabase from "../utils/db.js";
import ToolAccessCode from "../models/ToolAccessCode.js";
import ToolLead from "../models/ToolLead.js";
import NewsletterSubscription from "../models/NewsletterSubscription.js";
import { sendOtpEmail } from "./emailService.js";
import { isValidEmail, isValidUSPhone, formatUSPhone } from "../utils/formValidation.js";
import { validateName, validateOtp } from "../utils/validation.js";

export const TOOL_ACCESS_COOKIE = "toolAccessToken";
export const TOOL_ACCESS_DAYS = 15;
export const NEWSLETTER_LINK_DAYS = 90;
export const NEWSLETTER_SESSION_HOURS = 12;
const OTP_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const MAX_CODES_PER_WINDOW = 3;
const CODE_WINDOW_MS = 15 * 60 * 1000;
const SAME_TOOL_WINDOW_MS = 2 * 60 * 1000;

export const TOOL_LINK_TARGETS = [
	{
		toolPage: "probate-property-insurance-risk-checker",
		label: "Probate Property Insurance Risk Checker",
	},
	{
		toolPage: "court-confirmation-overbid-calculator",
		label: "Court Confirmation Overbid Calculator",
	},
	{
		toolPage: "occupant-access-risk-analyzer",
		label: "Occupant Access Risk Analyzer",
	},
	{
		toolPage: "executor-readiness-quiz",
		label: "Executor Readiness Quiz",
	},
];

export const TOOL_PAGES = new Set(TOOL_LINK_TARGETS.map((target) => target.toolPage));

function getJwtSecret() {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error("JWT_SECRET is not set");
	return secret;
}

function hashCode(code) {
	return crypto.createHash("sha256").update(code).digest("hex");
}

function hashesMatch(stored, incoming) {
	const left = Buffer.from(stored);
	const right = Buffer.from(incoming);
	if (left.length !== right.length) return false;
	return crypto.timingSafeEqual(left, right);
}

function normalizeToolPage(value) {
	const toolPage = String(value || "")
		.trim()
		.replace(/^\/+/, "")
		.split("/")[0];
	if (!TOOL_PAGES.has(toolPage)) {
		throw new Error("Unknown tool");
	}
	return toolPage;
}

function normalizeProfile(input) {
	const firstName = validateName(input.firstName);
	const lastName = validateName(input.lastName);
	const email = String(input.email || "").trim().toLowerCase();
	if (!isValidEmail(email)) {
		throw new Error("A valid email address is required");
	}
	if (!isValidUSPhone(input.phone)) {
		throw new Error("A valid 10-digit US phone number is required");
	}
	return {
		firstName,
		lastName,
		email,
		phone: formatUSPhone(input.phone),
		toolPage: normalizeToolPage(input.toolPage),
		pageUrl: String(input.pageUrl || "").trim().slice(0, 500),
	};
}

export async function requestToolAccessCode(input, context = {}) {
	const profile = normalizeProfile(input);
	await connectToDatabase();

	const since = new Date(Date.now() - CODE_WINDOW_MS);
	const recentCount = await ToolAccessCode.countDocuments({
		email: profile.email,
		createdAt: { $gte: since },
	});
	if (recentCount >= MAX_CODES_PER_WINDOW) {
		throw new Error("Please wait before requesting another code");
	}

	const code = crypto.randomInt(100000, 999999).toString();
	const record = await ToolAccessCode.create({
		...profile,
		codeHash: hashCode(code),
		expiresAt: new Date(Date.now() + OTP_MINUTES * 60000),
		ipAddress: context.ipAddress || "",
	});

	try {
		await sendOtpEmail({
			to: profile.email,
			code,
			subject: "Your 833PROBAID tool access code",
			templateData: {
				name: profile.firstName,
				purpose: "access the 833PROBAID tools",
			},
		});
	} catch (error) {
		await record.deleteOne();
		throw error;
	}

	return { email: profile.email };
}

export async function verifyToolAccessCode(input, context = {}) {
	const email = String(input.email || "").trim().toLowerCase();
	const code = validateOtp(input.code);
	if (!isValidEmail(email)) {
		throw new Error("A valid email address is required");
	}

	await connectToDatabase();
	const record = await ToolAccessCode.findOne({ email }).sort({ createdAt: -1 });
	if (!record) throw new Error("Verification code not found");
	if (record.expiresAt < new Date()) {
		await record.deleteOne();
		throw new Error("Verification code expired");
	}
	if (record.attempts >= MAX_ATTEMPTS) {
		await record.deleteOne();
		throw new Error("Too many invalid attempts");
	}
	if (!hashesMatch(record.codeHash, hashCode(code))) {
		record.attempts += 1;
		await record.save();
		throw new Error("Invalid verification code");
	}

	const now = new Date();
	const accessExpiresAt = new Date(now.getTime() + TOOL_ACCESS_DAYS * 24 * 60 * 60 * 1000);
	const fullName = `${record.firstName} ${record.lastName}`.trim();
	let lead = await ToolLead.findOne({ email }).sort({ submittedAt: -1 });

	if (!lead) {
		lead = await ToolLead.create({
			firstName: record.firstName,
			lastName: record.lastName,
			fullName,
			email,
			phone: record.phone,
			toolPage: record.toolPage,
			pageUrl: record.pageUrl,
			sourceType: "website",
			verified: true,
			verifiedAt: now,
			firstTool: record.toolPage,
			lastToolUsed: record.toolPage,
			firstAccess: now,
			lastAccess: now,
			totalToolUses: 0,
			accessExpiresAt,
			submittedAt: now,
			meta: {
				userAgent: context.userAgent || "",
				ipAddress: context.ipAddress || "",
			},
		});
	} else {
		lead.firstName = record.firstName;
		lead.lastName = record.lastName;
		lead.fullName = fullName;
		lead.phone = record.phone;
		lead.verified = true;
		lead.verifiedAt = now;
		lead.accessExpiresAt = accessExpiresAt;
		lead.lastAccess = now;
		if (!lead.firstTool) lead.firstTool = record.toolPage;
		if (!lead.firstAccess) lead.firstAccess = now;
		if (!lead.lastToolUsed) lead.lastToolUsed = record.toolPage;
		if (!lead.toolPage) lead.toolPage = record.toolPage;
		await lead.save();
	}

	await ToolAccessCode.deleteMany({ email });

	const token = jwt.sign(
		{
			purpose: "tool-access",
			sub: String(lead._id),
			email: lead.email,
		},
		getJwtSecret(),
		{ expiresIn: `${TOOL_ACCESS_DAYS}d` },
	);

	return {
		token,
		accessExpiresAt,
		leadId: String(lead._id),
		email: lead.email,
	};
}

export async function readToolAccessSession(token) {
	if (!token) return { authorized: false };

	let payload;
	try {
		payload = jwt.verify(token, getJwtSecret());
	} catch {
		return { authorized: false };
	}

	if (payload?.purpose !== "tool-access" || !payload.sub) {
		return { authorized: false };
	}

	await connectToDatabase();
	if (payload.grant === "newsletter") {
		return readNewsletterToolSession(payload);
	}
	if (!payload.email) {
		return { authorized: false };
	}
	const lead = await ToolLead.findById(payload.sub);
	if (!lead || !lead.verified || lead.email !== payload.email) {
		return { authorized: false };
	}
	if (!lead.accessExpiresAt || lead.accessExpiresAt < new Date()) {
		return { authorized: false };
	}

	return {
		authorized: true,
		email: lead.email,
		accessExpiresAt: lead.accessExpiresAt,
	};
}

export async function recordToolUse(token, toolPageInput) {
	const session = await readToolAccessSession(token);
	if (!session.authorized) {
		throw new Error("Tool access session is not active");
	}

	const toolPage = normalizeToolPage(toolPageInput);
	if (session.grant === "newsletter") {
		return { success: true, totalToolUses: 0 };
	}

	await connectToDatabase();
	const payload = jwt.verify(token, getJwtSecret());
	const lead = await ToolLead.findById(payload.sub);
	if (!lead) throw new Error("Tool access session is not active");

	const now = new Date();
	const sameRecentVisit =
		lead.lastToolUsed === toolPage &&
		lead.lastAccess &&
		now.getTime() - new Date(lead.lastAccess).getTime() < SAME_TOOL_WINDOW_MS;

	if (!sameRecentVisit) {
		lead.totalToolUses = (lead.totalToolUses || 0) + 1;
		lead.lastToolUsed = toolPage;
		lead.lastAccess = now;
		if (!lead.firstTool) lead.firstTool = toolPage;
		if (!lead.firstAccess) lead.firstAccess = now;
		await lead.save();
	}

	return { success: true, totalToolUses: lead.totalToolUses };
}

function siteOrigin() {
	return String(process.env.NEXT_PUBLIC_SITE_URL || "https://833probaid.com").replace(/\/$/, "");
}

function isActiveSubscriber(subscription) {
	return Boolean(subscription) && subscription.status !== "revoked";
}

async function readNewsletterToolSession(payload) {
	const subscription = await NewsletterSubscription.findById(payload.sub);
	if (!isActiveSubscriber(subscription)) {
		return { authorized: false };
	}

	const accessExpiresAt = payload.exp ? new Date(payload.exp * 1000) : null;
	if (!accessExpiresAt || accessExpiresAt < new Date()) {
		return { authorized: false };
	}

	return {
		authorized: true,
		grant: "newsletter",
		accessExpiresAt,
	};
}

export function buildNewsletterToolLinks(subscriptionId) {
	const sub = String(subscriptionId || "").trim();
	if (!/^[a-f\d]{24}$/i.test(sub)) {
		throw new Error("Unknown subscriber");
	}

	const token = jwt.sign(
		{ purpose: "newsletter-tool-link", sub },
		getJwtSecret(),
		{ expiresIn: `${NEWSLETTER_LINK_DAYS}d` },
	);
	const decoded = jwt.decode(token);
	const origin = siteOrigin();

	return {
		expiresAt: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null,
		links: TOOL_LINK_TARGETS.map((target) => ({
			toolPage: target.toolPage,
			label: target.label,
			url: `${origin}/api/tool-access/newsletter?token=${encodeURIComponent(token)}&tool=${target.toolPage}`,
		})),
	};
}

export async function redeemNewsletterToolLink({ token, toolPage }) {
	let payload;
	try {
		payload = jwt.verify(String(token || ""), getJwtSecret());
	} catch {
		throw new Error("This newsletter link is not valid");
	}

	if (payload?.purpose !== "newsletter-tool-link" || !payload.sub) {
		throw new Error("This newsletter link is not valid");
	}

	const normalizedTool = normalizeToolPage(toolPage);
	await connectToDatabase();
	const subscription = await NewsletterSubscription.findById(payload.sub);
	if (!isActiveSubscriber(subscription)) {
		throw new Error("This newsletter access is no longer active");
	}

	const accessExpiresAt = new Date(Date.now() + NEWSLETTER_SESSION_HOURS * 60 * 60 * 1000);
	const sessionToken = jwt.sign(
		{
			purpose: "tool-access",
			grant: "newsletter",
			sub: String(subscription._id),
		},
		getJwtSecret(),
		{ expiresIn: `${NEWSLETTER_SESSION_HOURS}h` },
	);

	return {
		token: sessionToken,
		toolPage: normalizedTool,
		accessExpiresAt,
	};
}
