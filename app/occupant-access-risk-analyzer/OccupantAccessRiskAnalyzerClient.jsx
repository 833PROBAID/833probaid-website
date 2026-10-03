"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ToolLeadCaptureModal from "@/components/ToolLeadCaptureModal";
import { useEffect, useMemo, useState } from "react";

/* =====================================================================
   833PROBAID® — Occupant Access Risk Analyzer
   - Questions unlock after role + valid property address
   - Live Access Readiness % (no "generate" button)
   - Feedback under every answer + vendor call-to-action
   - Recommended sale path + lead stage
   - Action plan blurred on screen; full plan is emailed
   - Report form: user email (+ optional attorney copy)
   Report delivery: POST /api/tool-report (see REPORT_ENDPOINT below).
   ===================================================================== */

const REPORT_ENDPOINT = "/api/tool-report";
const TOOL_PAGE = "occupant-access-risk-analyzer";
const STORAGE_KEY = "tool-access-v2";
const PHONE = "(833) 776-2243";
const TEL = "tel:8337762243";
const TERMS_URL = "/privacy";

const TEAL = "#0097A7";
const TEAL_DEEP = "#004E57";
const ORANGE = "#FD7702";

const shellShadow =
	"0 clamp(12px, 2.5vw, 20px) clamp(26px, 5.5vw, 48px) rgba(15, 23, 42, 0.16), 0 1px 0 rgba(255,255,255,0.3) inset";
const heroPanelShadow =
	"0 clamp(10px, 2vw, 16px) clamp(20px, 4.5vw, 32px) rgba(15, 23, 42, 0.17), 0 1px 0 rgba(255,255,255,0.24) inset";
const sectionCardShadow =
	"0 clamp(8px, 1.7vw, 14px) clamp(16px, 3.4vw, 30px) rgba(15, 23, 42, 0.11), 0 1px 0 rgba(255,255,255,0.45) inset";

/* ------------------------------------------------------------------ copy */
const ROLES = {
	executor: { label: "Executor / Administrator", title: "executor", ent: "the estate" },
	trustee: { label: "Successor Trustee", title: "trustee", ent: "the trust" },
	conservator: { label: "Conservator", title: "conservator", ent: "the conservatorship estate" },
	other: { label: "Attorney / other", title: "fiduciary", ent: "the estate" },
};
const roleOf = (A) => ROLES[A.role] || ROLES.other;
const occupiedOf = (A) => !!A.occ && A.occ !== "vacant";

const ATTY =
	"Contact your attorney. If you don’t have one, call our office at (833) 776-2243 and we’ll refer you to a reputable one. Choosing and hiring an attorney is your decision and responsibility.";
const SELF_HELP =
	"Changing locks, shutting off utilities, or removing an occupant’s belongings without court process may be an illegal “self-help” eviction in California.";
const AS_IS =
	"We can still list and sell the property as-is. Without interior access there are no photos or showings, so it will mainly attract cash-buyer offers, which are typically significantly lower than a full market sale.";
const VENDOR =
	"833PROBAID® works with vetted vendors who can handle this for you. Call us and we’ll get it scheduled.";

// factor: 0 = good, 0.5 = partial / unsure, 1 = full risk
const YN = (badWhen) =>
	badWhen === "no"
		? [["yes", "Yes", 0], ["no", "No", 1], ["unsure", "Unsure", 0.5]]
		: [["no", "No", 0], ["yes", "Yes", 1], ["unsure", "Unsure", 0.5]];

/* ------------------------------------------------------------- questions */
const QUESTIONS = [
	{
		id: "occ", sec: "Occupancy", w: 8, stack: true,
		opts: [
			["vacant", "No one — the property is vacant", 0],
			["family", "Family member or heir", 0.5],
			["tenant", "Tenant with a lease or rental agreement", 0.5],
			["friend", "Caregiver or friend, no lease", 0.75],
			["squatter", "Squatter or unauthorized person", 1],
			["unsure", "Not sure", 0.75],
		],
		q: () => "Who is living in the property?",
		help: () => "This decides your sale path more than anything else.",
		gap: (v) => ({
			family: "A family member is still living in the property",
			tenant: "A tenant is living in the property",
			friend: "A caregiver or friend is living there with no lease",
			squatter: "An unauthorized person is occupying the property",
			unsure: "It isn’t confirmed who is living in the property",
		}[v]),
		act: (v) =>
			v === "unsure" ? "Find out who is living there — drive by, check with neighbors, and look for signs of occupancy."
				: v === "squatter" ? ATTY
					: v === "tenant" ? "Get a copy of the lease and confirm its end date and rent with your attorney before planning the sale."
						: "Agree on a move-out date with the occupant and put it in writing.",
		alert: (v) =>
			v === "squatter" ? ["An unauthorized occupant usually can’t be removed without court process. " + ATTY, "risk"]
				: v === "tenant" ? ["A lease usually survives a sale — the tenant may have the right to stay through the lease term. California tenant rules are strict; confirm with your attorney.", "warn"]
					: v === "unsure" ? ["Find out who is living there before anything else. Every next step depends on it.", "warn"]
						: null,
	},
	{
		id: "coop", sec: "Occupancy", w: 6, cap: 59, showIf: occupiedOf,
		opts: [["yes", "Yes", 0], ["some", "Somewhat", 0.5], ["no", "No / hostile", 1]],
		q: () => "Is the occupant cooperating with access and move-out?",
		help: () => "Access for inspections, photos, and showings — and a willingness to leave.",
		gap: (v) => (v === "no" ? "Occupant is not cooperating" : "Occupant is only partly cooperating"),
		act: (v) => (v === "no" ? ATTY : "Put access times and a move-out date in writing and confirm the occupant received them."),
		alert: (v) => (v === "no" ? ["Don’t try to force access or confront the occupant — it can create legal and safety problems.", "risk"] : null),
	},
	{
		id: "agree", sec: "Occupancy", w: 4, opts: YN("no"),
		showIf: (A) => occupiedOf(A) && A.occ !== "squatter",
		q: (A) => (A.occ === "tenant" ? "Do you have a copy of the signed lease or rental agreement?" : "Is there a written agreement on access or a move-out date?"),
		help: () => "Verbal promises don’t hold up when plans change.",
		gap: (v, A) => (A.occ === "tenant" ? "No copy of the lease on file" : "No written access or move-out agreement"),
		act: (v, A) => (A.occ === "tenant" ? "Get a copy of the lease and any rent records." : "Put the move-out date and access schedule in a short written agreement signed by the occupant."),
		alert: () => null,
	},
	{
		id: "notice", sec: "Occupancy", w: 4, opts: YN("no"), showIf: occupiedOf,
		q: () => "Has a written notice to vacate been served, with your attorney’s guidance?",
		help: () => "The type of notice and the waiting period depend on who the occupant is.",
		gap: () => "No written notice to vacate has been served",
		act: () => "Ask your attorney which notice applies and have it served properly.",
		alert: (v, A) => (v === "no" && A.coop && A.coop !== "yes" ? [SELF_HELP, "risk"] : null),
	},
	{
		id: "rent", sec: "Occupancy", w: 2, opts: YN("no"),
		showIf: (A) => occupiedOf(A) && A.occ !== "squatter",
		q: () => "Is the occupant paying rent or covering the property’s costs?",
		help: () => "Mortgage, taxes, insurance, and utilities keep running either way.",
		gap: () => "Occupant isn’t paying rent or costs",
		act: () => "Document who pays what while the occupant stays, in writing.",
		alert: (v, A) => (v === "no" && A.occ === "family" ? ["Other beneficiaries may object to someone living in the home rent-free. Put the arrangement in writing.", "warn"] : null),
	},
	{
		id: "keys", sec: "Control & keys", w: 5,
		opts: [["all", "All keys", 0], ["some", "Some keys", 0.5], ["none", "No keys", 1]],
		q: () => "Do you have keys to every door, gate, and garage?",
		help: () => "Including side doors, sheds, mailboxes, and storage.",
		gap: (v) => (v === "none" ? "No keys to the property" : "Missing some keys"),
		act: (v, A) =>
			occupiedOf(A)
				? "Collect keys from everyone who has them. Rekey only once the property is vacant and you have the legal right to — 833PROBAID can send a vetted locksmith."
				: "Rekey every exterior door and keep a key log — 833PROBAID can send a vetted locksmith.",
		alert: () => null,
	},
	{
		id: "codes", sec: "Control & keys", w: 2, opts: YN("no"),
		q: () => "Do you have the alarm codes, gate codes, and garage remotes?",
		help: () => "Vendors, inspectors, and buyers will need them.",
		gap: () => "Missing alarm codes, gate codes, or remotes",
		act: () => "Get the codes and remotes, or have the alarm company and gate reset them.",
		alert: () => null,
	},
	{
		id: "outside", sec: "Control & keys", w: 3, opts: YN("yes"),
		q: () => "Does anyone outside your control still have keys? (relatives, neighbors, caregivers)",
		help: () => "Anyone with a key can remove items or let people in.",
		gap: () => "People outside your control still have keys",
		act: () => "Ask for keys back in writing, and rekey once the property is vacant.",
		alert: (v) => (v === "yes" ? ["Anyone with a key can remove belongings or let others in — and you may be held responsible.", "warn"] : null),
	},
	{
		id: "auth", sec: "Authority & family", w: 8, cap: 39, opts: YN("no"),
		q: (A) =>
			({
				executor: "Has the court issued your Letters (Testamentary or of Administration)?",
				trustee: "Do you have a signed trust certification showing you’re the acting trustee?",
				conservator: "Has the court issued Letters of Conservatorship of the estate?",
			}[A.role] || "Has the fiduciary’s legal authority been established (court Letters or trust certification)?"),
		help: () => "Without legal authority you can’t take possession, sign a listing, or remove an occupant.",
		gap: () => "Legal authority to act is not yet in place",
		act: (v, A) => (A.role === "trustee" ? "Have your attorney prepare a trust certification and confirm you’re the acting trustee." : "Work with your attorney to obtain the Letters from the court."),
		alert: (v) => (v === "no" ? ["Without legal authority you can’t take possession, sign a listing, or remove an occupant yet.", "risk"] : null),
	},
	{
		id: "dispute", sec: "Authority & family", w: 5,
		opts: [["none", "None", 0], ["minor", "Minor", 0.5], ["major", "Major", 1]],
		q: () => "Is there disagreement among heirs or beneficiaries about access or selling?",
		help: () => "Disputes are one of the most common reasons sales stall.",
		gap: (v) => (v === "major" ? "Major disagreement among heirs or beneficiaries" : "Some disagreement among heirs or beneficiaries"),
		act: (v) => (v === "major" ? "Involve your attorney to resolve the dispute before listing." : "Get the family’s agreement on the plan in writing."),
		alert: (v) => (v === "major" ? ["Heir disputes can stall the sale and court approval. Get agreement in writing, and involve your attorney.", "risk"] : null),
	},
	{
		id: "inventory", sec: "Authority & family", w: 3,
		opts: [["yes", "Yes", 0], ["empty", "Nothing left inside", 0], ["no", "No", 1], ["unsure", "Unsure", 0.5]],
		q: () => "Have the belongings inside been inventoried and photographed?",
		help: () => "Before anything is removed, sold, donated, or given to family.",
		gap: () => "Belongings haven’t been inventoried",
		act: () => "Walk through with a camera: photograph and list contents room by room before anything leaves.",
		alert: (v) => (v === "no" ? ["Don’t remove, sell, or give away belongings before they’re inventoried and photographed.", "risk"] : null),
	},
	{
		id: "cond", sec: "Condition & safety", w: 4,
		opts: [["clean", "Clean", 0], ["avg", "Average", 0.5], ["poor", "Poor (hoarding, biohazard)", 1]],
		q: () => "What is the interior condition?",
		help: () => "Your best guess is fine.",
		gap: (v) => (v === "poor" ? "Interior in poor condition (hoarding or biohazard)" : "Interior needs clean-up before photos"),
		act: (v) => (v === "poor" ? "Call 833PROBAID at (833) 776-2243 to schedule a vetted clean-out and biohazard crew once you have possession." : "Plan a clean-out and basic prep before photos — 833PROBAID can schedule a vetted crew."),
		alert: (v) => (v === "poor" ? ["Hoarding or biohazard conditions may need specialized clean-up before inspections or showings.", "warn"] : null),
	},
	{
		id: "safety", sec: "Condition & safety", w: 5,
		opts: [["none", "None", 0], ["minor", "Minor", 0.5], ["serious", "Serious", 1]],
		q: () => "Any safety concerns? (weapons, aggressive animals, threats, drug activity)",
		help: () => "Your safety comes first.",
		gap: (v) => (v === "serious" ? "Serious safety concerns at the property" : "Some safety concerns at the property"),
		act: (v) => (v === "serious" ? "Don’t enter alone. Involve your attorney or law enforcement before anyone goes in." : "Never go alone — bring a second person and tell someone when you’re there."),
		alert: (v) => (v === "serious" ? ["Don’t enter alone. Involve your attorney or law enforcement before entering.", "risk"] : null),
	},
];

/* ---------------------------------------------- feedback under every answer
   [text, tone ("good" | "warn" | "risk"), showVendorCTA?] */
const FEEDBACK = {
	occ: {
		vacant: ["Vacant means full access: interior photos, showings, and the best shot at top price.", "good"],
		family: ["Family in the home is common. What keeps the sale on schedule is a written move-out date.", "warn"],
		friend: ["Even without a lease, a caregiver or friend may have rights as an occupant. Get a written move-out agreement, and talk to your attorney if they won’t commit.", "warn"],
	},
	coop: {
		yes: ["Cooperation is your biggest asset. Lock it in writing before plans change.", "good"],
		some: ["Partial cooperation tends to break down under pressure. Put access times and a move-out date in writing now.", "warn"],
	},
	agree: {
		yes: (A) => [A.occ === "tenant" ? "Good — the lease terms decide when and how the property can be sold." : "Good — a written agreement protects you if the occupant changes their mind.", "good"],
		no: (A) => [A.occ === "tenant" ? "Get a copy of the lease. Its terms decide when and how you can sell." : "Verbal promises don’t hold up. Get it in writing, signed by the occupant.", "risk"],
		unsure: ["Find it or create one. Without it, there’s nothing to hold anyone to.", "warn"],
	},
	notice: {
		yes: ["Good. Follow the timeline your attorney gave you, and don’t change locks until the process is complete.", "good"],
		no: (A) => (A.coop && A.coop !== "yes" ? [SELF_HELP, "risk"] : ["If move-out plans slip, ask your attorney which notice applies.", "warn"]),
		unsure: ["Check with your attorney whether notice was served and which type applies.", "warn"],
	},
	rent: {
		yes: ["Good — costs are covered while they stay. Keep it documented.", "good"],
		no: (A) => (A.occ === "family" ? ["Other beneficiaries may object to someone living in the home rent-free. Put the arrangement in writing.", "risk"] : ["Every month without rent is a cost to the estate. Document it and set a move-out date.", "risk"]),
		unsure: ["Find out who is paying what. It matters for your accounting to the court and beneficiaries.", "warn"],
	},
	keys: {
		all: (A) => [occupiedOf(A) ? "Good. Once the property is vacant, rekey so no old copies work." : "Full key control. Rekey once so no old copies work.", "good"],
		some: ["Missing keys mean someone else may still get in, and you can’t open every area for inspections.", "warn", true],
		none: (A) => (occupiedOf(A) ? ["Don’t force entry — if someone lives there, entering without the right process can be illegal. Contact your attorney first.", "risk"] : ["Without keys you can’t inspect, insure, or show the property.", "risk", true]),
	},
	codes: {
		yes: ["Good — vendors, inspectors, and buyers can get in without delays.", "good"],
		no: ["Without codes, alarms and gates block every inspection and showing.", "risk", true],
		unsure: ["Check with the alarm company and HOA. They can usually reset codes with proof of your authority.", "warn", true],
	},
	outside: {
		no: ["Good — you control who gets in.", "good"],
		yes: ["Anyone with a key can remove belongings or let others in — and you may be held responsible.", "risk", true],
		unsure: ["Assume extra keys exist. Rekeying once the home is vacant is cheap protection.", "warn", true],
	},
	auth: {
		yes: ["Authority in place — you can act for the property.", "good"],
		unsure: ["Ask your attorney to confirm. Nothing can be signed until your authority is in place.", "warn"],
	},
	dispute: {
		none: ["Family alignment keeps the sale moving. Keep everyone updated in writing.", "good"],
		minor: ["Small disagreements grow during a sale. Get the plan agreed in writing now.", "warn"],
	},
	inventory: {
		yes: ["Good — a photo inventory protects you if anyone later says something went missing.", "good"],
		empty: ["Empty home — one less step before listing.", "good"],
		no: ["Don’t remove, sell, or give away belongings before they’re inventoried and photographed.", "risk", true],
		unsure: ["If you’re not sure, do it now. A room-by-room walkthrough video is a fast start.", "warn", true],
	},
	cond: {
		clean: ["Clean homes photograph well and draw stronger offers.", "good"],
		avg: ["A clean-out and light prep usually pays for itself in the sale price.", "warn", true],
		poor: ["Hoarding or biohazard conditions can be a health hazard and may need specialized crews before anyone inspects or shows the home. Act on this as soon as possible.", "risk", true],
	},
	safety: {
		none: ["Good. Still, never go alone — always bring someone.", "good"],
		minor: ["Bring a second person, tell someone when you’re there, and keep visits short.", "warn"],
	},
};

const feedbackFor = (q, v, A) => {
	const entry = FEEDBACK[q.id]?.[v];
	const val = typeof entry === "function" ? entry(A) : entry;
	return val || q.alert(v, A);
};

const LEVELS = [
	[80, "CLEAR ACCESS", "low", "Access is under control. You’re positioned for a full market sale."],
	[60, "MINOR FRICTION", "mid", "A few items to close before listing. Handle them now to avoid delays."],
	[40, "DELAYS LIKELY", "mid", "Access issues will likely delay the sale. Work the action plan before planning a listing date."],
	[0, "BLOCKED", "high", "The property can’t move forward until the blocking issue is resolved."],
];
const levelFor = (pct) => LEVELS.find((l) => pct >= l[0]);

/* --------------------------------------------------------------- engine */
function salePath(A) {
	if (A.auth === "no")
		return ["NOT AUTHORIZED YET", "Get legal authority first", [
			"You can’t take possession, sign a listing, or remove an occupant yet.",
			A.role === "trustee" ? "Have your attorney confirm your authority as trustee with a trust certification." : "Work with your attorney to obtain the Letters from the court.",
			"Meanwhile, use this time to gather keys, codes, and information about the property.",
		]];
	const occupied = occupiedOf(A);
	if (A.occ === "squatter" || (occupied && A.coop === "no"))
		return ["NEEDS ATTORNEY", "Occupant issue — two options", [
			"Option 1 — Get possession first: " + ATTY + " Expect time and legal costs.",
			"Option 2 — Sell as-is with the occupant inside: " + AS_IS,
		]];
	if (occupied)
		return ["NEEDS PREP", A.occ === "tenant" ? "Plan around the tenant" : "Plan the move-out first",
			A.occ === "tenant"
				? ["Confirm the lease terms with your attorney. The property can be sold with the tenant in place, or after the lease ends or proper notice is given.", "If the tenant won’t allow showings: " + AS_IS]
				: ["Lock in a written move-out date, then list the property vacant for the best price.", "If the occupant agrees, showings can be scheduled while they’re still there.", "If cooperation breaks down: " + ATTY]];
	if (A.occ === "vacant" && A.keys === "all")
		return ["READY TO LIST", "Full market sale", ["Vacant with full access: interior photos, open houses, and retail buyers — the path to the best price."]];
	if (A.occ === "vacant")
		return ["NEEDS PREP", "Secure access, then list", ["Get every key and code under your control, then you’re positioned for a full market sale."]];
	return ["IN PROGRESS", "Answer the occupancy question", ["Your sale path appears once we know who is living in the property."]];
}

function compute(A) {
	const qs = QUESTIONS.filter((q) => !q.showIf || q.showIf(A));
	let risk = 0, max = 0, answered = 0, cap = 100;
	const gaps = [], alerts = [], actions = [], lines = [];
	qs.forEach((q) => {
		const v = A[q.id];
		const opt = q.opts.find((o) => o[0] === v);
		if (!opt) return;
		answered++;
		max += q.w;
		const r = opt[2] * q.w;
		risk += r;
		lines.push([q.q(A), opt[1]]);
		if (r > 0) {
			gaps.push([r, q.gap(v, A) + (v === "unsure" ? " (unconfirmed)" : "")]);
			const a = q.act(v, A);
			if (!actions.some((x) => x[1] === a)) actions.push([r, a]);
		}
		if (q.cap && opt[2] === 1) cap = Math.min(cap, q.cap);
		const al = q.alert(v, A);
		if (al && !alerts.includes(al[0])) alerts.push(al[0]);
	});
	if (A.occ === "squatter") cap = Math.min(cap, 39);
	if (occupiedOf(A) && A.coop && A.coop !== "yes" && A.notice === "no" && !alerts.includes(SELF_HELP)) alerts.push(SELF_HELP);
	let pct = 100 - (max ? Math.round((risk / max) * 100) : 0);
	const capped = answered > 0 && pct > cap;
	if (capped) pct = cap;
	const byW = (a, b) => b[0] - a[0];
	return {
		qs, answered, total: qs.length, pct, capped,
		gaps: gaps.sort(byW).map((g) => g[1]),
		actions: actions.sort(byW).map((g) => g[1]),
		alerts, lines, path: salePath(A),
	};
}

function reportText(A, c, lead, updatedAt, addr) {
	const lvl = c.answered ? levelFor(c.pct)[1] : "—";
	const complete = c.answered === c.total;
	const top = (c.gaps[0] || "access to the property").replace(/ \(unconfirmed\)$/, "");
	return [
		"OCCUPANT ACCESS READINESS REPORT — 833PROBAID®",
		`Status: ${complete ? "COMPLETED" : `IN PROGRESS — ${c.answered} of ${c.total} answered`}`,
		`Last updated: ${updatedAt ? new Date(updatedAt).toLocaleString("en-US") : "—"}`,
		lead ? `Name: ${lead.first} ${lead.last}` : "Name: (not yet submitted)",
		lead ? `Email: ${lead.email}` : "",
		lead ? `Phone: ${lead.phone}` : "",
		`Attorney copy: ${lead && lead.atty ? `Yes — ${lead.atty}` : "No"}`,
		`Role: ${ROLES[A.role] ? ROLES[A.role].label : "Not specified"}`,
		`Property: ${addr && addr.trim() ? addr.trim() : "Not provided"}`,
		"",
		`Access Readiness: ${c.answered ? c.pct + "%" : "—"} (${lvl})${c.capped ? " · capped by a blocking answer" : ""}`,
		`LEAD STAGE: ${c.path[0]}`,
		`Recommended sale path: ${c.path[1]}`,
		...c.path[2].map((l) => "  - " + l),
		"",
		"ANSWERS", ...c.lines.map(([q, a]) => `- ${q} — ${a}`),
		"",
		"ALERTS", ...(c.alerts.length ? c.alerts.map((l) => "- " + l) : ["- None"]),
		"",
		"TO REACH 100%, FIX:", ...(c.gaps.length ? c.gaps.map((l) => "- " + l) : ["- Nothing flagged"]),
		"",
		"ACTION PLAN", ...(c.actions.length ? c.actions.map((l, i) => `${i + 1}. ${l}`) : ["- None"]),
		"",
		"CALL SCRIPT",
		`Hey ${lead ? lead.first : "[name]"}, I read your access report — you’re about ${c.pct}% ready. The main thing holding it up: ${top.charAt(0).toLowerCase() + top.slice(1)}. That’s usually what stalls these sales. What have you been able to handle so far? While you finish the rest, I can come take a look at the property and prepare the pricing analysis, so we’re ready to list the day you’re done.`,
	].filter((l, i, arr) => l !== "" || arr[i - 1] !== "").join("\n");
}

/* ------------------------------------------------------ address check
   Format check only. For a guaranteed-real address, add Google Places
   Autocomplete (or USPS address verification) on the server side. */
const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
const STREET_TYPE = /\b(st|street|ave|avenue|blvd|boulevard|dr|drive|rd|road|ln|lane|way|ct|court|pl|place|cir|circle|ter|terrace|pkwy|parkway|hwy|highway|trl|trail|sq|square|loop|row|walk|path|pike|plz|plaza|aly|alley)\.?\b/i;
function checkAddress(ad) {
	const problems = [];
	const street = ad.street.trim();
	if (!/^\d+[A-Za-z]?\s+\S/.test(street)) problems.push("start the street with the house number (like 123 Main St)");
	else if (!/[A-Za-z]{2,}/.test(street.replace(/^\d+[A-Za-z]?\s+/, "")) || !STREET_TYPE.test(street)) problems.push("include the street name and type (St, Ave, Blvd, Dr…)");
	if (!/^[A-Za-z][A-Za-z .'-]{1,}$/.test(ad.city.trim())) problems.push("add the city");
	if (!STATES.includes(ad.state)) problems.push("pick the state");
	const zip = ad.zip.trim();
	if (!/^\d{5}(-\d{4})?$/.test(zip)) problems.push("add a 5-digit ZIP code");
	else if (ad.state === "CA" && (+zip.slice(0, 5) < 90001 || +zip.slice(0, 5) > 96162)) problems.push("that ZIP code isn’t in California");
	return problems;
}
const formatAddress = (ad) => (ad.street.trim() ? `${ad.street.trim()}, ${ad.city.trim()}, ${ad.state} ${ad.zip.trim()}` : "");

/* ------------------------------------------------------------ UI pieces */
const toneBox = {
	good: "border-green-700 bg-green-50 text-green-900",
	warn: "border-[#FD7702] bg-orange-50 text-[#7a3a00]",
	risk: "border-red-700 bg-red-50 text-red-900",
};
const tierColors = {
	low: { border: "#2e7d32", bg: "#f1f8f2", bar: "#2e7d32" },
	mid: { border: ORANGE, bg: "#fff7ef", bar: ORANGE },
	high: { border: "#c62828", bg: "#fdecea", bar: "#c62828" },
};

function Feedback({ fb }) {
	if (!fb) return null;
	const [text, tone, vendor] = fb;
	return (
		<div className={`mt-4 rounded-xl border-l-4 px-4 py-3 text-sm font-semibold leading-relaxed ${toneBox[tone] || toneBox.risk}`}>
			<p>{text}</p>
			{vendor ? (
				<>
					<p className='mt-2 font-bold'>{VENDOR}</p>
					<a
						href={TEL}
						className='mt-2 inline-block rounded-lg px-4 py-2 text-sm font-extrabold text-white no-underline transition-transform hover:scale-[1.02]'
						style={{ backgroundColor: ORANGE, boxShadow: "0 3px 0 #a84c00" }}>
						Call {PHONE}
					</a>
				</>
			) : null}
		</div>
	);
}

function Card({ title, tier, children, className = "" }) {
	const t = tier ? tierColors[tier] : null;
	return (
		<div
			className={`rounded-3xl border-l-[6px] p-5 sm:p-6 ${className}`}
			style={{
				borderColor: t ? t.border : TEAL,
				backgroundColor: t ? t.bg : "#e6f5f6",
				boxShadow: sectionCardShadow,
			}}>
			{title ? <p className='text-xs font-extrabold uppercase tracking-[0.15em] text-gray-600'>{title}</p> : null}
			{children}
		</div>
	);
}

const inputCls =
	"w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base text-gray-800 outline-none focus:border-[#0097A7]";

/* ================================================================ page */
const OccupantAccessRiskAnalyzerClient = () => {
	const [A, setA] = useState({});
	const [ad, setAd] = useState({ street: "", city: "", state: "CA", zip: "" });
	const addr = formatAddress(ad);
	const setPart = (k, v) => { setAd((cur) => ({ ...cur, [k]: v })); setUpdatedAt(Date.now()); };
	const [lead, setLead] = useState(null);
	const [sentAt, setSentAt] = useState(null);
	const [updatedAt, setUpdatedAt] = useState(null);
	const [form, setForm] = useState({ first: "", last: "", email: "", phone: "", atty: "", consent: false, hp: "" });
	const [invalid, setInvalid] = useState({});
	const [status, setStatus] = useState({ type: "", text: "" });
	const [sending, setSending] = useState(false);
	const [thanks, setThanks] = useState("");
	const [resendMsg, setResendMsg] = useState("");
	const [loaded, setLoaded] = useState(false);

	// restore within the same browser session
	useEffect(() => {
		try {
			const s = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
			if (s.answers) setA(s.answers);
			if (s.ad) setAd(s.ad);
			if (s.lead) setLead(s.lead);
			if (s.sentAt) setSentAt(s.sentAt);
			if (s.updatedAt) setUpdatedAt(s.updatedAt);
		} catch {}
		setLoaded(true);
	}, []);
	useEffect(() => {
		if (!loaded) return;
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: A, ad, lead, sentAt, updatedAt }));
		} catch {}
	}, [A, ad, lead, sentAt, updatedAt, loaded]);

	const c = useMemo(() => compute(A), [A]);
	const addrProblems = checkAddress(ad);
	const addrValid = addrProblems.length === 0;
	const addrStarted = !!(ad.street.trim() || ad.city.trim() || ad.zip.trim());
	const unlocked = !!A.role && addrValid;
	const complete = c.answered === c.total;
	const level = c.answered ? levelFor(c.pct) : null;
	const r = roleOf(A);

	const pick = (id, v) => {
		setA((cur) => ({ ...cur, [id]: v }));
		setUpdatedAt(Date.now());
	};
	const reset = () => {
		setA({});
		setUpdatedAt(null);
	};

	const sendReport = async (L) => {
		const lvl = c.answered ? levelFor(c.pct)[1] : "";
		const report = reportText(A, c, L, updatedAt, addr);
		const res = await fetch(REPORT_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				toolPage: TOOL_PAGE,
				isUpdate: !!sentAt,
				subject: `${sentAt ? "UPDATED " : ""}Access Readiness — ${L.first} ${L.last} — ${addr.trim()} — ${c.pct}% ${lvl} — ${c.path[0]}`,
				lead: { firstName: L.first, lastName: L.last, email: L.email, phone: L.phone },
				attorneyEmail: L.atty || null,
				role: ROLES[A.role] ? ROLES[A.role].label : null,
				propertyAddress: addr.trim(),
				answers: A,
				readiness: c.pct,
				level: lvl,
				leadStage: c.path[0],
				salePath: c.path[1],
				status: complete ? "completed" : "in_progress",
				answered: c.answered,
				total: c.total,
				alerts: c.alerts,
				gaps: c.gaps,
				actionPlan: c.actions,
				report,
				pageUrl: typeof window !== "undefined" ? window.location.href : "",
			}),
		});
		if (!res.ok) throw new Error("We couldn’t send your report right now.");
	};

	const submit = async (e) => {
		e.preventDefault();
		setStatus({ type: "", text: "" });
		if (form.hp) return; // bot
		const emailOk = (x) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.trim());
		const bad = {};
		if (!form.first.trim()) bad.first = true;
		if (!form.last.trim()) bad.last = true;
		if (!emailOk(form.email)) bad.email = true;
		if (form.phone.replace(/\D/g, "").length < 10) bad.phone = true;
		if (form.atty.trim() && !emailOk(form.atty)) bad.atty = true;
		if (!form.consent) bad.consent = true;
		if (!addrValid) bad.addr = true;
		setInvalid(bad);
		if (bad.addr && Object.keys(bad).length === 1) {
			setStatus({ type: "err", text: "Complete the property address at the top of the form, then click again." });
			document.getElementById("acc-property-address")?.scrollIntoView({ behavior: "smooth", block: "center" });
			return;
		}
		if (Object.keys(bad).length) {
			setStatus({ type: "err", text: `Please complete the highlighted fields (10-digit phone, valid emails, and the consent box)${bad.addr ? ", and complete the property address at the top of the form" : ""}.` });
			return;
		}
		const L = { first: form.first.trim(), last: form.last.trim(), email: form.email.trim(), phone: form.phone.trim(), atty: form.atty.trim() };
		setSending(true);
		try {
			await sendReport(L);
			setLead({ ...L, at: Date.now() });
			setSentAt(Date.now());
			setThanks(`Check your inbox, ${L.first} — your full report and action plan were sent to ${L.email}${L.atty ? `, with a copy to ${L.atty}` : ""}. Don’t see it? Check spam, or call ${PHONE}.`);
		} catch (err) {
			setStatus({ type: "err", text: `${err.message} Call ${PHONE} or email info@833probaid.com.` });
		} finally {
			setSending(false);
		}
	};

	const resend = async () => {
		setResendMsg("");
		setSending(true);
		try {
			await sendReport(lead);
			setSentAt(Date.now());
			setResendMsg("Updated report sent to your email. We’ll be in touch.");
		} catch (err) {
			setResendMsg(`${err.message} Call ${PHONE}.`);
		} finally {
			setSending(false);
		}
	};

	const scrollToReport = () => document.getElementById("access-report")?.scrollIntoView({ behavior: "smooth", block: "start" });

	let qNum = 0;
	let lastSec = "";
	const tier = level ? level[2] : null;
	const pathTier = { "READY TO LIST": "low", "NEEDS PREP": "mid", "IN PROGRESS": null }[c.path[0]] ?? "high";

	return (
		<div>
			<Navbar />
			<ToolLeadCaptureModal toolPage={TOOL_PAGE} title='Before You Use The Access Risk Analyzer' />
			<section className='min-h-screen py-8 sm:py-12 lg:py-16'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<div className='overflow-clip rounded-[28px] border-[3px] border-secondary sm:rounded-[40px]' style={{ boxShadow: shellShadow }}>
						{/* ------------------------------------------------ hero */}
						<div
							className='px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12'
							style={{ background: "linear-gradient(to bottom right, var(--color-primary), var(--color-primaryDark))" }}>
							<div className='flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between xl:gap-8'>
								<div className='flex-1'>
									<p className='mb-3 text-sm font-semibold tracking-[0.15em] text-white sm:text-base'>Occupant Command Deck</p>
									<h1 className='mb-3 text-[30px] font-extrabold leading-tight text-white sm:text-[38px]'>Occupant Access Risk Analyzer</h1>
									<p className='max-w-2xl text-base font-bold text-white/95 sm:text-xl'>
										Answer a few quick questions about who’s in the property, keys, authority, and condition. See your access readiness score, your best sale path, and exactly what stands between you and a listing.
									</p>
								</div>
								<div className='w-full xl:w-132.5'>
									<div
										className='rounded-3xl border px-6 py-6 backdrop-blur-sm sm:px-8 sm:py-8'
										style={{ backgroundColor: "rgba(0, 151, 167, 0.32)", borderColor: "rgba(255,255,255,0.18)", boxShadow: heroPanelShadow }}>
										<h2 className='text-center text-[18px] font-bold tracking-[0.08em] text-white sm:text-[20px]'>Access Readiness</h2>
										<p className='mt-2 text-center text-4xl font-extrabold text-white sm:text-6xl'>{c.answered ? `${c.pct}%` : "—"}</p>
										<p className='mt-2 text-center text-sm font-bold leading-relaxed text-white/95 sm:text-lg'>
											{c.answered ? `${level[1]} · ${c.answered} of ${c.total} answered` : "Your score updates with every answer."}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* ------------------------------------------------ body */}
						<div className='bg-linear-to-br from-gray-50 to-gray-100 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12'>
							<div className='grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]'>
								{/* questions */}
								<div>
									<div className='flex flex-wrap items-center justify-between gap-4'>
										<h2 className='text-2xl font-bold sm:text-3xl' style={{ color: TEAL }}>Occupancy &amp; Access Check</h2>
										<button
											type='button'
											onClick={reset}
											className='rounded-xl px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02]'
											style={{ backgroundColor: TEAL, boxShadow: `0 4px 0 ${TEAL_DEEP}` }}>
											Reset answers
										</button>
									</div>

									<div className='mt-6 space-y-4 sm:space-y-5'>
										{/* role */}
										<fieldset className='rounded-3xl border-2 p-4 sm:p-6' style={{ borderColor: TEAL, backgroundColor: "#e6f5f6", boxShadow: sectionCardShadow }}>
											<div className='flex justify-between text-xs font-bold text-gray-500'>
												<span>Start here</span>
												<span style={{ color: A.role ? TEAL : ORANGE }}>{A.role ? "Answered" : "Pending"}</span>
											</div>
											<legend className='sr-only'>What is your role?</legend>
											<h3 className='mt-1 text-lg font-extrabold text-gray-900'>What is your role?</h3>
											<p className='mt-1 text-sm text-gray-500'>This tailors the questions and your report.</p>
											<div className='mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2'>
												{Object.entries(ROLES).map(([k, role]) => {
													const on = A.role === k;
													return (
														<label key={k} className='cursor-pointer'>
															<input type='radio' name='acc-role' value={k} checked={on} onChange={() => pick("role", k)} className='peer sr-only' />
															<span
																className='block rounded-xl px-3 py-2.5 text-center text-sm font-bold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#FD7702]'
																style={{ backgroundColor: on ? TEAL : "#ffffff", color: on ? "#fff" : TEAL_DEEP }}>
																{role.label}
															</span>
														</label>
													);
												})}
											</div>
										</fieldset>

										{/* property address */}
										<div className='rounded-3xl border-2 p-4 sm:p-6' style={{ borderColor: invalid.addr && !addrValid ? "#c62828" : TEAL, backgroundColor: "#e6f5f6", boxShadow: sectionCardShadow }}>
											<div className='flex justify-between text-xs font-bold text-gray-500'>
												<span>Property</span>
												<span style={{ color: addrValid ? TEAL : ORANGE }}>{addrValid ? "Answered" : "Pending"}</span>
											</div>
											<h3 className='mt-1 text-lg font-extrabold text-gray-900'>What is the address of the property?</h3>
											<p className='mt-1 text-sm text-gray-500'>The property this check is for — whether it’s part of an estate, a trust, or a conservatorship.</p>
											<div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-6'>
												<label className='block sm:col-span-6'>
													<span className='text-sm font-bold text-gray-800'>Street address</span>
													<input id='acc-property-address' type='text' autoComplete='address-line1' placeholder='123 Main St' value={ad.street} onChange={(e) => setPart("street", e.target.value)} className={`${inputCls} mt-1`} />
												</label>
												<label className='block sm:col-span-3'>
													<span className='text-sm font-bold text-gray-800'>City</span>
													<input type='text' autoComplete='address-level2' placeholder='Los Angeles' value={ad.city} onChange={(e) => setPart("city", e.target.value)} className={`${inputCls} mt-1`} />
												</label>
												<label className='block sm:col-span-1'>
													<span className='text-sm font-bold text-gray-800'>State</span>
													<select autoComplete='address-level1' value={ad.state} onChange={(e) => setPart("state", e.target.value)} className={`${inputCls} mt-1 px-2`}>
														{STATES.map((st) => <option key={st} value={st}>{st}</option>)}
													</select>
												</label>
												<label className='block sm:col-span-2'>
													<span className='text-sm font-bold text-gray-800'>ZIP code</span>
													<input type='text' inputMode='numeric' autoComplete='postal-code' placeholder='90041' maxLength={10} value={ad.zip} onChange={(e) => setPart("zip", e.target.value)} className={`${inputCls} mt-1`} />
												</label>
											</div>
										</div>

										{/* unlock notice */}
										{unlocked ? (
											<p className='rounded-2xl border-l-4 border-green-700 bg-green-50 px-4 py-3 text-sm font-bold text-green-900'>
												Unlocked. Answer the questions below — your score updates with every answer.
											</p>
										) : (
											<div className='rounded-2xl border-l-4 px-4 py-3 text-sm font-bold' style={{ borderColor: ORANGE, backgroundColor: "#fff7ef", color: "#7a3a00" }}>
												<p>Answer both questions above to unlock the rest of the check.</p>
												<ul className='mt-2 space-y-1 font-semibold'>
													<li>{A.role ? "✓" : "○"} Your role</li>
													<li>{addrValid ? "✓" : "○"} Property address{addrStarted && !addrValid ? ` — ${addrProblems.join("; ")}` : ""}</li>
												</ul>
											</div>
										)}

										<fieldset disabled={!unlocked} aria-disabled={!unlocked} className={`m-0 min-w-0 space-y-4 border-0 p-0 transition-[filter,opacity] sm:space-y-5 ${unlocked ? "" : "pointer-events-none select-none opacity-50 blur-[2px]"}`}>
										<legend className='sr-only'>Access questions</legend>
										{c.qs.map((q) => {
											qNum++;
											const v = A[q.id];
											const opt = q.opts.find((o) => o[0] === v);
											const f = opt ? opt[2] : null;
											const border = !opt ? "#e5e7eb" : f === 1 ? "#c62828" : f > 0 ? ORANGE : TEAL;
											const statusText = !opt ? "Pending" : f === 1 ? "Risk flagged" : f > 0 ? "Needs attention" : "Good";
											const statusColor = !opt ? ORANGE : f === 1 ? "#c62828" : f > 0 ? "#d96300" : TEAL;
											const heading = q.sec !== lastSec ? q.sec : null;
											lastSec = q.sec;
											return (
												<div key={q.id}>
													{heading ? <h3 className='mb-3 mt-6 text-xl font-extrabold uppercase tracking-wide' style={{ color: ORANGE }}>{heading}</h3> : null}
													<fieldset className='rounded-3xl border-2 bg-white p-4 sm:p-6' style={{ borderColor: border, boxShadow: sectionCardShadow }}>
														<div className='flex justify-between text-xs font-bold text-gray-500'>
															<span>Question {qNum}</span>
															<span style={{ color: statusColor }}>{statusText}</span>
														</div>
														<legend className='sr-only'>{q.q(A)}</legend>
														<h4 className='mt-1 text-lg font-extrabold text-gray-900'>{q.q(A)}</h4>
														<p className='mt-1 text-sm text-gray-500'>{q.help(A)}</p>
														<div className={`mt-4 grid gap-2 ${q.stack ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
															{q.opts.map(([val, label, factor]) => {
																const on = v === val;
																const bg = on ? (factor === 1 ? "#c62828" : factor > 0 ? ORANGE : TEAL) : "#e6f5f6";
																return (
																	<label key={val} className='cursor-pointer'>
																		<input type='radio' name={`acc-${q.id}`} value={val} checked={on} onChange={() => pick(q.id, val)} className='peer sr-only' />
																		<span
																			className={`block rounded-xl px-3 py-2.5 text-sm font-bold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#FD7702] ${q.stack ? "text-left" : "text-center"}`}
																			style={{ backgroundColor: bg, color: on ? "#fff" : TEAL_DEEP }}>
																			{label}
																		</span>
																	</label>
																);
															})}
														</div>
														<Feedback fb={opt ? feedbackFor(q, v, A) : null} />
													</fieldset>
												</div>
											);
										})}
										</fieldset>
									</div>
								</div>

								{/* sticky score panel */}
								<aside className='space-y-4 lg:sticky lg:top-24 lg:self-start' aria-live='polite'>
									<Card title='Access readiness' tier={tier}>
										<p className='mt-1 text-5xl font-black' style={{ color: TEAL_DEEP }}>{c.answered ? `${c.pct}%` : "—"}</p>
										<div className='mt-3 h-2.5 overflow-hidden rounded-full bg-white'>
											<div className='h-full rounded-full transition-all' style={{ width: `${c.answered ? c.pct : 0}%`, backgroundColor: tier ? tierColors[tier].bar : TEAL }} />
										</div>
										<p className='mt-3 text-sm font-semibold text-gray-700'>
											{!c.answered ? "Answer the questions to see your score. It updates with every answer." : c.pct === 100 ? "Access is fully in place. You’re ready to move toward listing." : `${100 - c.pct}% of the work to get full access is still open.`}
										</p>
									</Card>
									<Card title='Readiness level' tier={tier}>
										<p className='mt-1 text-3xl font-black' style={{ color: TEAL_DEEP }}>{level ? level[1] : "—"}</p>
										{level ? (
											<p className='mt-2 text-sm text-gray-700'>
												{complete ? "" : "Provisional — based on the answers so far. "}
												{level[3]}
												{c.capped ? " (Score capped: one answer blocks the sale on its own.)" : ""}
											</p>
										) : null}
									</Card>
									<Card title='Your sale path'>
										<p className='mt-1 text-lg font-extrabold' style={{ color: TEAL_DEEP }}>{c.path[1]}</p>
										<p className='mt-1 text-sm text-gray-600'>
											{complete ? `All ${c.total} questions answered.` : `${c.answered} of ${c.total} answered${A.role ? "" : " · pick your role at the top"}.`}
										</p>
										<button
											type='button'
											onClick={scrollToReport}
											className='mt-3 rounded-xl px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02]'
											style={{ backgroundColor: ORANGE, boxShadow: "0 4px 0 #a84c00" }}>
											See what’s preventing 100%
										</button>
									</Card>
								</aside>
							</div>

							{/* ------------------------------------------------ report */}
							<div id='access-report' className='mt-12 scroll-mt-28 space-y-5'>
								<h2 className='text-3xl font-black uppercase sm:text-4xl' style={{ color: TEAL }}>Your access readiness report</h2>

								<Card title={`Recommended sale path: ${c.path[1]}`} tier={pathTier}>
									<ul className='mt-3 list-disc space-y-2 pl-5 text-sm text-gray-800'>
										{c.path[2].map((t, i) => <li key={i}>{t}</li>)}
									</ul>
								</Card>

								<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
									<Card title='To reach 100% access readiness, you must fix:' tier='mid'>
										<ul className='mt-3 list-disc space-y-2 pl-5 text-sm text-gray-800'>
											{c.gaps.length ? c.gaps.map((t, i) => <li key={i}>{t}</li>) : <li>{c.answered ? "Nothing flagged so far." : "Your gaps appear here as you answer."}</li>}
										</ul>
									</Card>
									<Card title='Alerts' tier='high'>
										<ul className='mt-3 list-disc space-y-2 pl-5 text-sm font-semibold text-red-900'>
											{c.alerts.length ? c.alerts.map((t, i) => <li key={i}>{t}</li>) : <li className='font-normal text-gray-700'>No alerts triggered{c.answered ? " so far" : " yet"}.</li>}
										</ul>
									</Card>
								</div>

								<Card title='Your action plan'>
									{c.actions.length ? (
										<>
											<p className='mt-2 font-bold' style={{ color: TEAL_DEEP }}>
												{lead
													? `Your ${c.actions.length}-step action plan was emailed to ${lead.email}. Changed answers? Use “Send my updated report” below.`
													: `${c.actions.length} required action${c.actions.length === 1 ? "" : "s"} ready. Enter your details below and we’ll email your step-by-step plan.`}
											</p>
											<ol className='pointer-events-none mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-800 blur-[5px] select-none' aria-hidden='true'>
												{c.actions.map((t, i) => <li key={i}>{t.replace(/\S/g, "x")}</li>)}
											</ol>
										</>
									) : (
										<p className='mt-2 text-sm text-gray-700'>{c.answered ? "No actions needed based on your answers so far." : "Your action plan builds as you answer."}</p>
									)}
								</Card>

								<Card title='If access isn’t resolved' tier='high'>
									<ul className='mt-3 list-disc space-y-2 pl-5 text-sm text-gray-800'>
										<li>The sale timeline — and any court timeline — slips</li>
										<li>Holding costs keep running: mortgage, taxes, insurance, utilities</li>
										<li>Buyers walk away or offer less</li>
										<li>The {r.title} may be blamed for delays or damage to the property</li>
									</ul>
								</Card>

								{!lead ? (
									<form onSubmit={submit} noValidate className='space-y-4 rounded-3xl border-[3px] bg-white p-5 sm:p-7' style={{ borderColor: TEAL, boxShadow: sectionCardShadow }}>
										<h2 className='text-2xl font-black uppercase sm:text-3xl' style={{ color: TEAL }}>Get your full report &amp; action plan</h2>
										<p className='text-gray-700'>Your step-by-step action plan and full report are sent to your email. Use an email you can open right now.</p>
										<input type='text' tabIndex={-1} autoComplete='off' value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} className='hidden' aria-hidden='true' />
										<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
											{[
												["first", "First name", "text", "given-name", ""],
												["last", "Last name", "text", "family-name", ""],
												["email", "Email", "email", "email", ""],
												["phone", "Phone", "tel", "tel", "(555) 234-5678"],
											].map(([k, label, type, ac, ph]) => (
												<label key={k} className='block'>
													<span className='text-sm font-bold text-gray-800'>{label} <span className='text-[#d96300]'>*</span></span>
													<input
														type={type}
														autoComplete={ac}
														placeholder={ph}
														value={form[k]}
														onChange={(e) => setForm({ ...form, [k]: e.target.value })}
														className={`${inputCls} mt-1 ${invalid[k] ? "!border-red-600" : ""}`}
													/>
												</label>
											))}
											<label className='block sm:col-span-2'>
												<span className='text-sm font-bold text-gray-800'>Also send a copy to my attorney (optional)</span>
												<input
													type='email'
													placeholder='attorney@lawfirm.com'
													value={form.atty}
													onChange={(e) => setForm({ ...form, atty: e.target.value })}
													className={`${inputCls} mt-1 ${invalid.atty ? "!border-red-600" : ""}`}
												/>
												<span className='mt-1 block text-xs text-gray-500'>Your attorney gets the same report when you click the button below. Leave blank to skip.</span>
											</label>
										</div>
										<label className={`flex items-start gap-3 text-sm ${invalid.consent ? "text-red-700" : "text-gray-700"}`}>
											<input type='checkbox' checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className='mt-1 h-4 w-4 accent-[#0097A7]' />
											<span>
												I agree that 833PROBAID® may contact me about this report by phone, text, or email, and I agree to the{" "}
												<a href={TERMS_URL} target='_blank' rel='noopener noreferrer' className='font-bold underline' style={{ color: TEAL }}>
													Website Terms of Use, Privacy Policy &amp; Disclosures
												</a>
												.
											</span>
										</label>
										<button
											type='submit'
											disabled={sending}
											className='rounded-xl px-6 py-3.5 text-base font-extrabold text-white transition-transform hover:scale-[1.02] disabled:opacity-60'
											style={{ backgroundColor: ORANGE, boxShadow: "0 4px 0 #a84c00" }}>
											{sending ? "Sending…" : "Email me my report & action plan"}
										</button>
										{status.text ? <p className={`font-bold ${status.type === "err" ? "text-red-700" : ""}`} role='status'>{status.text}</p> : null}
									</form>
								) : (
									<div className='rounded-3xl p-6 text-white' style={{ backgroundColor: TEAL }}>
										{thanks ? <p className='font-bold'>{thanks}</p> : null}
										<h2 className='mt-2 text-2xl font-black uppercase'>Need help getting access?</h2>
										<p className='mt-2 text-white/95'>We regularly help executors, trustees, and conservators work through occupied and hard-to-access properties — and when the property is ready, we’re ready to list.</p>
										<div className='mt-4 flex flex-wrap gap-3'>
											<a href={TEL} className='rounded-xl px-5 py-3 font-extrabold text-white no-underline' style={{ backgroundColor: ORANGE, boxShadow: "0 4px 0 #a84c00" }}>Call {PHONE}</a>
											<button type='button' onClick={resend} disabled={sending} className='rounded-xl bg-white px-5 py-3 font-extrabold disabled:opacity-60' style={{ color: TEAL_DEEP }}>
												{sending ? "Sending…" : "Done some steps? Send my updated report"}
											</button>
										</div>
										{resendMsg ? <p className='mt-3 font-bold'>{resendMsg}</p> : null}
									</div>
								)}

								<p className='rounded-2xl bg-white/70 p-4 text-xs text-gray-500'>
									This tool is for general information only and is not legal, insurance, or financial advice. Results depend on the answers entered and don’t account for every circumstance of a specific estate, trust, or conservatorship. Confirm requirements with your attorney and the court.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default OccupantAccessRiskAnalyzerClient;
