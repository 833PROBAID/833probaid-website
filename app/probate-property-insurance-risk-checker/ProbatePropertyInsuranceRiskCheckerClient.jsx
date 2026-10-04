"use client";

import CTAButton from "@/components/CTAButton";
import ServiceLayout from "@/components/ServiceLayout";
import ToolLeadCaptureModal from "@/components/ToolLeadCaptureModal";
import { ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/* =====================================================================
   833PROBAID® — Probate Property Insurance Risk Checker
   Same engine and layout as the Occupant Access Risk Analyzer:
   - Live Insurance Readiness % (no "generate" button)
   - Feedback under every answer + vendor call-to-action
   - Recommended coverage path + lead stage
   - Action plan blurred on screen; full plan is emailed
   - Report form: user email (+ optional attorney copy)
   Report delivery: POST /api/tool-report (see REPORT_ENDPOINT below).
   ===================================================================== */

const REPORT_ENDPOINT = "/api/tool-report";
const TOOL_PAGE = "probate-property-insurance-risk-checker";
const STORAGE_KEY = "tool-insurance-v3";
const PHONE = "(833) 776-2243";
const TEL = "tel:8337762243";
// Link to the Website Terms of Use, Privacy Policy & Disclosures page — change if your page lives elsewhere
const TERMS_URL = "/privacy";

const TEAL = "#0097A7";
const TEAL_DEEP = "#004E57";
const ORANGE = "#FD7702";

const sectionCardShadow =
	"0 clamp(8px, 1.7vw, 14px) clamp(16px, 3.4vw, 30px) rgba(15, 23, 42, 0.11), 0 1px 0 rgba(255,255,255,0.45) inset";
const layerCardShadow =
	"rgba(0, 0, 0, 0.4) 0px 8px 12px, rgba(0, 0, 0, 0.4) 0px -5px 12px 1px";
const fieldShadow =
	"0 clamp(4px, 1.1vw, 6px) clamp(8px, 2.4vw, 14px) rgba(15, 23, 42, 0.11), 0 1px 0 rgba(255,255,255,0.5) inset";
const cardLift =
	"hover:-translate-y-1.25 hover:![box-shadow:rgba(0,0,0,0.5)_0px_12px_20px,rgba(0,0,0,0.5)_0px_-8px_16px_2px]";

/* ------------------------------------------------------------------ copy */
const ROLES = {
	executor: { label: "Executor / Administrator", title: "executor", ent: "the estate", poss: "the estate’s", docs: "Letters Testamentary or Letters of Administration" },
	trustee: { label: "Successor Trustee", title: "trustee", ent: "the trust", poss: "the trust’s", docs: "trust certification" },
	conservator: { label: "Conservator", title: "conservator", ent: "the conservatorship estate", poss: "the conservatorship estate’s", docs: "Letters of Conservatorship" },
	other: { label: "Attorney / other", title: "fiduciary", ent: "the estate", poss: "the estate’s", docs: "Letters or trust certification" },
};
const roleOf = (A) => ROLES[A.role] || ROLES.other;
const isCons = (A) => A.role === "conservator";
const vacantish = (A) => !!A.vacant && A.vacant !== "no";

const SECURE_ALERT = "Unsecured property increases vandalism risk and can give the carrier grounds to deny a claim.";
const VENDOR =
	"833PROBAID® works with vetted vendors who can handle this for you. Call us and we’ll get it scheduled.";

// factor: 0 = good, 0.5 = partial / unsure, 1 = full risk
const BAD_YES = [["yes", "Yes", 1], ["no", "No", 0], ["unsure", "Unsure", 0.5]];
const BAD_NO = [["yes", "Yes", 0], ["no", "No", 1], ["unsure", "Unsure", 0.5]];

/* ------------------------------------------------------------- questions */
const QUESTIONS = [
	{
		id: "vacant", sec: "Vacancy & policy", w: 6, opts: BAD_YES,
		q: (A) => (isCons(A) ? "Has the property been vacant or unoccupied for more than 30 days?" : "Has the property been vacant for more than 30 days?"),
		help: (A) => (isCons(A) ? "If the conservatee moved to care and the home sits furnished but empty, many policies treat it as “unoccupied,” which has its own limits. Answer Yes." : "Count from the day the last person stopped living there. Many policies limit coverage after 30–60 days."),
		gap: () => "Property vacant 30+ days — vacancy limits likely apply",
		act: () => "Confirm in writing what your policy covers once the home has been vacant 30–60 days.",
		alert: (v) =>
			v === "yes" ? ["Many policies restrict or exclude coverage for certain losses — vandalism, glass breakage, water damage — once a home has been vacant 30–60 days.", "risk"]
				: v === "unsure" ? ["Not sure how long it’s been empty? Assume the carrier will count from the day the last occupant left.", "warn"]
					: null,
	},
	{
		id: "notified", sec: "Vacancy & policy", w: 6, opts: BAD_NO, showIf: vacantish,
		q: () => "Has the insurance carrier been notified of the vacancy?",
		help: () => "Notice should be in writing, with a confirmation you keep in the file.",
		gap: () => "Insurance carrier has not been notified of the vacancy",
		act: () => "Notify the insurance carrier of the vacancy in writing and keep the confirmation.",
		alert: (v) => (v === "no" ? ["Failure to notify the insurer may result in denied claims.", "risk"] : null),
	},
	{
		id: "policy", sec: "Vacancy & policy", w: (A) => (A.vacant === "no" ? 2 : 6), stack: true,
		opts: [
			["standard", "Standard homeowner (HO-3)", 1],
			["landlord", "Landlord / dwelling policy (DP-1, DP-3)", 0.5],
			["vacant", "Vacant-property policy or vacancy endorsement", 0],
			["unsure", "Not sure", 0.5],
		],
		q: () => "What type of insurance policy is active?",
		help: () => "The policy form is printed on the declarations page.",
		gap: () => "Policy type may not fit a vacant property",
		act: () => "Ask the carrier or a broker about a vacant-property policy or vacancy endorsement.",
		alert: (v, A) =>
			v === "standard" && vacantish(A) ? ["A standard homeowner policy may not cover a vacant property. Ask about a vacancy endorsement or a vacant-property policy.", "risk"]
				: v === "unsure" ? ["Pull the declarations page — it lists the policy form (HO-3, DP-1, DP-3, or a vacancy endorsement).", "warn"]
					: null,
	},
	{
		id: "named", sec: "Vacancy & policy", w: 6, opts: BAD_NO,
		q: (A) => (isCons(A) ? "Has the carrier been told a conservator now manages the property?" : `Has the policy been updated to ${roleOf(A).poss} name (not only the deceased’s)?`),
		help: (A) => (isCons(A) ? "The carrier needs to know who has authority to receive notices and make claims." : "Policies often stay in the deceased owner’s name for months after death."),
		gap: (v, A) => (isCons(A) ? "Carrier hasn’t been told a conservator manages the property" : "Policy may still list only the deceased owner"),
		act: (v, A) => (isCons(A) ? "Send the carrier your Letters of Conservatorship and ask to be listed as the contact or an additional insured." : `Send the carrier the death certificate and your ${roleOf(A).docs}, and ask them to update the named insured.`),
		alert: (v, A) => (v === "no" ? [isCons(A) ? "If the carrier doesn’t know a conservator is in charge, notices and claim decisions may go to the wrong person." : "If the policy only names someone who has died, the carrier may dispute who is insured and who can make a claim.", "risk"] : null),
	},
	{
		id: "premium", sec: "Vacancy & policy", w: 6, cap: 39, opts: BAD_NO,
		q: () => "Is the premium paid and current?",
		help: () => "Autopay often fails once the owner’s bank account is frozen or closed, and the policy can lapse without anyone noticing.",
		gap: () => "Premium may not be current — policy could lapse",
		act: (v, A) => `Call the carrier today to confirm the policy is in force, and pay the premium from ${roleOf(A).poss} account.`,
		alert: (v) =>
			v === "no" ? ["A lapsed premium can mean there is no coverage at all.", "risk"]
				: v === "unsure" ? ["Call the carrier to confirm the policy is in force — don’t assume autopay is still working.", "warn"]
					: null,
	},
	{
		id: "secured", sec: "Property security", w: 5, opts: BAD_NO,
		q: () => "Are all doors and windows secured?",
		help: () => "Carriers expect a vacant home to be locked and intact.",
		gap: () => "Doors and windows not fully secured",
		act: () => "Secure or board every entry point and photograph the result for the file — 833PROBAID can send a vetted crew.",
		alert: (v) => (v === "no" ? [SECURE_ALERT, "risk"] : null),
	},
	{
		id: "locks", sec: "Property security", w: 4, opts: BAD_NO,
		q: () => "Have the locks been changed since occupancy changed?",
		help: () => "Old keys are often still with relatives, neighbors, caregivers, or contractors.",
		gap: () => "Locks have not been changed",
		act: () => "Rekey every exterior door and keep a written key log — 833PROBAID can send a vetted locksmith.",
		alert: (v) => (v === "no" ? [SECURE_ALERT, "risk"] : null),
	},
	{
		id: "yard", sec: "Property security", w: 2, opts: BAD_NO,
		q: () => "Is the property regularly maintained (yard, exterior)?",
		help: () => "A neglected exterior signals an empty house to trespassers.",
		gap: () => "Yard and exterior not regularly maintained",
		act: () => "Schedule recurring yard and exterior service so the home doesn’t look empty.",
		alert: () => null,
	},
	{
		id: "utilities", sec: "Damage prevention", w: 4, opts: BAD_NO,
		q: () => "Are utilities (power and gas) currently active?",
		help: () => "Power keeps alarms and heat running, and inspectors, appraisers, and buyers need it.",
		gap: () => "Utilities are off",
		act: (v, A) => `Keep power and gas on in ${roleOf(A).poss} name for heat, alarms, and showings.`,
		alert: () => null,
	},
	{
		id: "water", sec: "Damage prevention", w: 6, opts: BAD_NO,
		q: () => "Has the water supply been shut off or the plumbing properly winterized?",
		help: () => "Shut off at the main and drain the lines. Keep fire-sprinkler lines live if the home has them.",
		gap: () => "Water supply remains active",
		act: () => "Shut off the water at the main and drain the lines (leave fire sprinklers live).",
		alert: (v) => (v === "no" ? ["Active water supply is a major liability risk — burst pipes and slow leaks no one is there to see.", "risk"] : null),
	},
	{
		id: "damage", sec: "Damage prevention", w: 6, opts: BAD_YES,
		q: () => "Are there any known property damages? (roof, plumbing, fire, mold)",
		help: () => "Include anything you’ve seen or been told about, even if it seems minor.",
		gap: () => "Known damage on the property",
		act: () => "Repair and document the damage — photograph it, report it to the carrier, and get repair bids.",
		alert: (v) => (v === "yes" ? ["Existing damage may reduce or void future claims, and unrepaired damage can lead to more loss.", "risk"] : null),
	},
	{
		id: "inspections", sec: "Documentation", w: 3, opts: BAD_NO,
		q: () => "Are inspections being documented (photos, logs)?",
		help: () => "Many vacancy policies require regular inspections — often weekly.",
		gap: () => "Inspections are not documented",
		act: () => "Inspect at least weekly and log every visit with dated photos.",
		alert: () => null,
	},
	{
		id: "access", sec: "Documentation", w: 2, opts: BAD_NO,
		q: () => "Is there a record of who accesses the property?",
		help: () => "Agents, vendors, family, and inspectors should all be logged.",
		gap: () => "No record of who accesses the property",
		act: () => "Start an access log: who entered, when, and why.",
		alert: () => null,
	},
];

/* ---------------------------------------------- feedback under every answer
   [text, tone ("good" | "warn" | "risk"), showVendorCTA?] */
const FEEDBACK = {
	vacant: { no: ["Good — vacancy limits don’t apply yet. If the home becomes empty, notify the carrier right away.", "good"] },
	notified: {
		yes: ["Good — keep the carrier’s written confirmation in your file.", "good"],
		unsure: ["Call the carrier and confirm in writing. Don’t assume someone else already did.", "warn"],
	},
	policy: {
		standard: (A) => (A.vacant === "no" ? ["Fine while someone lives there. If the home becomes vacant, ask about a vacancy endorsement right away.", "good"] : null),
		landlord: ["Dwelling policies can still limit coverage after 30–60 days of vacancy. Ask the carrier exactly how long the home can sit empty.", "warn"],
		vacant: ["The right fit for an empty home. Confirm the inspection requirements written into the policy.", "good"],
	},
	named: {
		yes: ["Good — the right person can make a claim and receive notices.", "good"],
		unsure: ["Ask the carrier who the named insured is, and get the answer in writing.", "warn"],
	},
	premium: { yes: ["Good — note the next due date so the policy doesn’t lapse.", "good"] },
	secured: {
		yes: ["Good — photograph every door and window for your file.", "good"],
		no: [SECURE_ALERT, "risk", true],
		unsure: ["Walk the property this week and check every door and window.", "warn", true],
	},
	locks: {
		yes: ["Good — keep a key log of who has copies.", "good"],
		no: [SECURE_ALERT, "risk", true],
		unsure: ["Assume old keys are still out there. Rekeying is fast and inexpensive.", "warn", true],
	},
	yard: {
		yes: ["Good — a cared-for exterior keeps the home from looking empty.", "good"],
		no: ["An overgrown yard signals an empty house and invites trespassers.", "warn", true],
		unsure: ["Drive by and check — the outside is what trespassers see first.", "warn", true],
	},
	utilities: {
		yes: ["Good — alarms, heat, inspections, and showings all depend on it.", "good"],
		no: ["Without power, alarms and heat stop, and inspections and showings can’t happen. Restore service in the fiduciary’s name.", "risk"],
		unsure: ["Check with the utility companies and move the accounts into the fiduciary’s name.", "warn"],
	},
	water: {
		yes: ["Good — the biggest vacant-home risk is handled.", "good"],
		no: ["Active water supply is a major liability risk — burst pipes and slow leaks no one is there to see.", "risk", true],
		unsure: ["Check the main valve this week. A burst pipe in an empty house can run for weeks unnoticed.", "warn", true],
	},
	damage: {
		no: ["Good — photograph the current condition now so you can prove it later.", "good"],
		yes: ["Existing damage may reduce or void future claims, and unrepaired damage can lead to more loss.", "risk", true],
		unsure: ["Do a full walkthrough and photograph everything. Unknown damage is still damage.", "warn", true],
	},
	inspections: {
		yes: ["Good — dated photos prove the property was being checked.", "good"],
		no: ["Without records, it’s hard to prove the property was checked if a claim is filed.", "risk", true],
		unsure: ["Start now: a weekly visit with dated photos is enough.", "warn"],
	},
	access: {
		yes: ["Good — you can show exactly who was inside and when.", "good"],
		no: ["Start a simple log: who entered, when, and why.", "warn"],
		unsure: ["Start a simple log today: who entered, when, and why.", "warn"],
	},
};

const feedbackFor = (q, v, A) => {
	const entry = FEEDBACK[q.id]?.[v];
	const val = typeof entry === "function" ? entry(A) : entry;
	return val || q.alert(v, A);
};

const LEVELS = [
	[80, "READY", "low", "Coverage conditions look well managed. Keep documenting, and confirm coverage in writing."],
	[60, "MINOR ISSUES", "mid", "A few gaps a carrier could point to. Close them before a loss happens."],
	[40, "AT RISK", "mid", "Real gaps that could lead to a denied claim. Work the action plan this week."],
	[0, "CRITICAL", "high", "The property may be effectively uninsured right now. Contact the carrier today."],
];
const levelFor = (pct) => LEVELS.find((l) => pct >= l[0]);
const wOf = (q, A) => (typeof q.w === "function" ? q.w(A) : q.w);
// A standard homeowner policy is fine while someone still lives in the home
const factorOf = (q, val, base, A) => (q.id === "policy" && val === "standard" && A.vacant === "no" ? 0 : base);

/* --------------------------------------------------------------- engine */
// [lead stage, title, bullets]
function coveragePath(A, answered, pct, redFlags) {
	if (!answered) return ["IN PROGRESS", "Answer the questions", ["Your coverage path appears as you answer."]];
	if (A.premium === "no")
		return ["URGENT", "Confirm coverage today", [
			`A lapsed premium can mean there’s no coverage at all. Call the carrier today, confirm the policy is in force, and pay from ${roleOf(A).poss} account.`,
			"Until it’s confirmed in writing, treat the property as uninsured.",
		]];
	if (vacantish(A) && (A.policy === "standard" || A.policy === "unsure" || A.notified === "no" || A.notified === "unsure"))
		return [A.policy === "standard" && A.notified === "no" ? "URGENT" : "NEEDS FIXES", "Get vacancy coverage in place", [
			"Notify the carrier of the vacancy in writing and keep the confirmation.",
			"Ask for a vacancy endorsement or a vacant-property policy (often written on a DP-1 or DP-3 dwelling form).",
			"Confirm in writing what’s excluded: vandalism, theft, glass breakage, and water damage.",
			`Need a referral to an insurance professional who handles vacant and probate properties? Call ${PHONE}.`,
		]];
	if (A.named === "no")
		return ["NEEDS FIXES", isCons(A) ? "Register the conservator with the carrier" : "Update the policy to the right owner", [
			isCons(A) ? "Send the carrier your Letters of Conservatorship and ask to be listed as the contact or an additional insured." : `Send the carrier the death certificate and your ${roleOf(A).docs}, and ask them to update the named insured.`,
			"Get the change confirmed in writing.",
		]];
	if (pct >= 80 && !redFlags)
		return ["COVERAGE OK", "Keep coverage in good standing", [
			"Keep weekly inspections with dated photos.",
			"Re-check the policy if occupancy changes.",
			"Note the renewal date so the policy doesn’t lapse.",
		]];
	return ["NEEDS FIXES", "Close the gaps below", [
		"Work the action plan, then re-check your score.",
		`Need vendors or a referral to an insurance professional? Call ${PHONE}.`,
	]];
}

function compute(A) {
	const qs = QUESTIONS.filter((q) => !q.showIf || q.showIf(A));
	let risk = 0, max = 0, answered = 0, cap = 100, redFlags = 0;
	const gaps = [], alerts = [], actions = [], lines = [];
	qs.forEach((q) => {
		const v = A[q.id];
		const opt = q.opts.find((o) => o[0] === v);
		if (!opt) return;
		answered++;
		const w = wOf(q, A);
		max += w;
		const f = factorOf(q, v, opt[2], A);
		if (f === 1) redFlags++;
		const r = f * w;
		risk += r;
		lines.push([q.q(A), opt[1]]);
		if (r > 0) {
			gaps.push([r, q.gap(v, A) + (v === "unsure" ? " (unconfirmed)" : "")]);
			const a = q.act(v, A);
			if (!actions.some((x) => x[1] === a)) actions.push([r, a]);
		}
		if (q.cap && f === 1) cap = Math.min(cap, q.cap);
		const al = q.alert(v, A);
		if (al && !alerts.includes(al[0])) alerts.push(al[0]);
	});
	// Vacant + standard homeowner policy + carrier not told: capped at AT RISK
	if (A.vacant === "yes" && A.policy === "standard" && A.notified === "no") cap = Math.min(cap, 59);
	let pct = 100 - (max ? Math.round((risk / max) * 100) : 0);
	const capped = answered > 0 && pct > cap;
	if (capped) pct = cap;
	const byW = (a, b) => b[0] - a[0];
	return {
		qs, answered, total: qs.length, pct, capped,
		gaps: gaps.sort(byW).map((g) => g[1]),
		actions: actions.sort(byW).map((g) => g[1]),
		alerts, lines, path: coveragePath(A, answered, pct, redFlags),
	};
}

function reportText(A, c, lead, updatedAt, addr) {
	const lvl = c.answered ? levelFor(c.pct)[1] : "—";
	const complete = c.answered === c.total;
	const g0 = c.gaps.find((g) => !/^Property vacant/.test(g)) || c.gaps[0] || "keeping the property aligned with its insurance coverage";
	const top = g0.replace(/ \(unconfirmed\)$/, "");
	return [
		"INSURANCE READINESS REPORT — 833PROBAID®",
		`Status: ${complete ? "COMPLETED" : `IN PROGRESS — ${c.answered} of ${c.total} answered`}`,
		`Last updated: ${updatedAt ? new Date(updatedAt).toLocaleString("en-US") : "—"}`,
		lead ? `Name: ${lead.first} ${lead.last}` : "Name: (not yet submitted)",
		lead ? `Email: ${lead.email}` : "",
		lead ? `Phone: ${lead.phone}` : "",
		`Attorney copy: ${lead && lead.atty ? `Yes — ${lead.atty}` : "No"}`,
		`Role: ${ROLES[A.role] ? ROLES[A.role].label : "Not specified"}`,
		`Property: ${addr && addr.trim() ? addr.trim() : "Not provided"}`,
		"",
		`Insurance Readiness: ${c.answered ? c.pct + "%" : "—"} (${lvl})${c.capped ? " · capped by a critical answer" : ""}`,
		`You are ${100 - c.pct}% exposed to potential claim denial, coverage gaps, or liability risk.`,
		`LEAD STAGE: ${c.path[0]}`,
		`Recommended coverage path: ${c.path[1]}`,
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
		`Hey ${lead ? lead.first : "[name]"}, I reviewed your report — you’re about ${100 - c.pct}% exposed right now. The main issue: ${top.charAt(0).toLowerCase() + top.slice(1)}. That’s typically where claims get denied. Do you want help getting that cleaned up so ${roleOf(A).ent} isn’t at risk?`,
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
const reportInputCls =
	"w-full rounded-2xl border-2 px-4 py-2.5 text-base font-bold text-gray-900 outline-none transition-all focus:ring-2 placeholder:text-secondary";

function LayerRows({ items }) {
	if (!items.length) return null;
	return (
		<div className='mt-5 space-y-4 text-[1.375rem] leading-relaxed font-bold'>
			{items.map((text, index) => (
				<div
					key={`${text}-${index}`}
					className='flex items-start gap-6 rounded-2xl p-6 [box-shadow:rgba(0,0,0,0.4)_0px_8px_12px,rgba(0,0,0,0.4)_0px_-5px_12px_1px]'>
					<img src='https://833probaid.com/images/arrow.png' alt='' />
					<p>{text}</p>
				</div>
			))}
		</div>
	);
}

/* ================================================================ page */
const ProbatePropertyInsuranceRiskCheckerClient = () => {
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
	const handleCall = () => {
		window.location.href = TEL;
	};

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
				subject: `${sentAt ? "UPDATED " : ""}Insurance Readiness — ${L.first} ${L.last} — ${addr.trim()} — ${c.pct}% ${lvl} — ${c.path[0]}`,
				lead: { firstName: L.first, lastName: L.last, email: L.email, phone: L.phone },
				attorneyEmail: L.atty || null,
				role: ROLES[A.role] ? ROLES[A.role].label : null,
				propertyAddress: addr.trim(),
				answers: A,
				readiness: c.pct,
				level: lvl,
				leadStage: c.path[0],
				coveragePath: c.path[1],
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
			document.getElementById("ins-property-address")?.scrollIntoView({ behavior: "smooth", block: "center" });
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

	const scrollToReport = () => document.getElementById("insurance-report")?.scrollIntoView({ behavior: "smooth", block: "start" });

	let qNum = 0;
	let lastSec = "";
	const tier = level ? level[2] : null;

	return (
		<>
			<ToolLeadCaptureModal toolPage={TOOL_PAGE} title='Before You Use The Insurance Risk Checker' />
			<ServiceLayout
				toolPage={TOOL_PAGE}
				title="Insurance Governance"
				mainHeading="Probate Property Insurance Risk Checker"
				description="Answer 13 quick questions. See your insurance readiness score, what’s keeping it from 100%, and exactly how to close the gaps — before the estate faces a denied claim."
				logoImage="/icons/tool3.png"
				panelTitle="Insurance Readiness"
				panelValue={c.answered ? `${c.pct}%` : "—"}
				panelDetail={c.answered ? `${level[1]} · ${c.answered} of ${c.total} answered` : "Your score updates with every answer."}
			>
							<div className='grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]'>
								{/* questions */}
								<div>
									<div className='flex flex-wrap items-center justify-between gap-4'>
										<h2 className='text-2xl font-bold sm:text-3xl' style={{ color: TEAL }}>Insurance Readiness Check</h2>
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
													<input id='ins-property-address' type='text' autoComplete='address-line1' placeholder='123 Main St' value={ad.street} onChange={(e) => setPart("street", e.target.value)} className={`${inputCls} mt-1`} />
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
										<legend className='sr-only'>Insurance questions</legend>
										{c.qs.map((q) => {
											qNum++;
											const v = A[q.id];
											const opt = q.opts.find((o) => o[0] === v);
											const f = opt ? factorOf(q, v, opt[2], A) : null;
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
															{q.opts.map(([val, label, baseFactor]) => {
																const on = v === val;
																const factor = factorOf(q, val, baseFactor, A);
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
									<Card title='Insurance readiness' tier={tier}>
										<p className='mt-1 text-5xl font-black' style={{ color: TEAL_DEEP }}>{c.answered ? `${c.pct}%` : "—"}</p>
										<div className='mt-3 h-2.5 overflow-hidden rounded-full bg-white'>
											<div className='h-full rounded-full transition-all' style={{ width: `${c.answered ? c.pct : 0}%`, backgroundColor: tier ? tierColors[tier].bar : TEAL }} />
										</div>
										<p className='mt-3 text-sm font-semibold text-gray-700'>
											{!c.answered ? "Answer the questions to see your score. It updates with every answer." : `You are ${100 - c.pct}% exposed to potential claim denial, coverage gaps, or liability risk.`}
										</p>
									</Card>
									<Card title='Readiness level' tier={tier}>
										<p className='mt-1 text-3xl font-black' style={{ color: TEAL_DEEP }}>{level ? level[1] : "—"}</p>
										{level ? (
											<p className='mt-2 text-sm text-gray-700'>
												{complete ? "" : "Provisional — based on the answers so far. "}
												{level[3]}
												{c.capped ? " (Score capped: one answer is serious enough on its own to limit coverage.)" : ""}
											</p>
										) : null}
									</Card>
									<Card title='Your coverage path'>
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
							<div id='insurance-report' className='mt-12 scroll-mt-28'>
								<div
									className={`flex flex-col rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 ${cardLift}`}
									style={{ boxShadow: layerCardShadow }}>
									<div className='mb-8 flex gap-3'>
										<ShieldAlert
											className='mt-[-0.45em] ml-[-0.2em] h-8 w-8 shrink-0 text-secondary group-hover:text-primary'
											strokeWidth={2.5}
											aria-hidden='true'
											style={{ filter: "drop-shadow(0px 2px 0px rgba(0,0,0,0.25))" }}
										/>
										<div>
											<h2 className='mt-[-0.3em] text-[1.375rem] font-bold text-primary group-hover:text-secondary'>
												Your insurance readiness report
											</h2>
											<p className='mt-1 text-[1.375rem] font-bold text-black'>
												Recommended coverage path: {c.path[1]}
											</p>
										</div>
									</div>

									<div className='space-y-8'>
										<div
											className={`rounded-2xl border border-gray-200 bg-white p-6 pb-8 ${cardLift}`}
											style={{ boxShadow: layerCardShadow }}>
											<h3 className='-mt-[0.2em] text-[1.375rem] font-bold text-primary group-hover:text-secondary'>
												Recommended coverage path: {c.path[1]}
											</h3>
											<LayerRows items={c.path[2]} />
										</div>

										<div
											className={`rounded-2xl bg-secondary p-6 text-white ${cardLift}`}
											style={{ boxShadow: layerCardShadow }}>
											<p className='-mt-[0.15em] text-[1.375rem] font-bold tracking-[1px] text-white/80 uppercase'>
												Insurance Readiness
											</p>
											<p className='mt-2 text-4xl font-black sm:text-5xl'>{c.answered ? `${c.pct}%` : "—"}</p>
											<p className='-mb-[0.3em] mt-2 text-[1.375rem] font-bold text-white/85'>
												{level ? `${level[1]}. ${level[3]}` : "Your score updates with every answer."}
											</p>
										</div>

										<div
											className={`rounded-2xl border border-gray-200 bg-white p-6 pb-8 ${cardLift}`}
											style={{ boxShadow: layerCardShadow }}>
											<h3 className='-mt-[0.2em] text-[1.375rem] font-bold text-primary group-hover:text-secondary'>
												To reach 100% readiness, you must fix:
											</h3>
											{c.gaps.length ? (
												<LayerRows items={c.gaps} />
											) : (
												<p className='mt-5 text-[1.375rem] font-bold'>
													{c.answered ? "Nothing flagged so far." : "Your gaps appear here as you answer."}
												</p>
											)}
										</div>

										<div
											className={`rounded-2xl border border-gray-200 bg-white p-6 pb-8 ${cardLift}`}
											style={{ boxShadow: layerCardShadow }}>
											<h3 className='-mt-[0.2em] text-[1.375rem] font-bold text-primary group-hover:text-secondary'>Alerts</h3>
											{c.alerts.length ? (
												<LayerRows items={c.alerts} />
											) : (
												<p className='mt-5 text-[1.375rem] font-bold'>
													No alerts triggered{c.answered ? " so far" : " yet"}.
												</p>
											)}
										</div>

										<div
											className={`rounded-2xl border border-gray-200 bg-white p-6 pb-8 ${cardLift}`}
											style={{ boxShadow: layerCardShadow }}>
											<h3 className='-mt-[0.2em] text-[1.375rem] font-bold text-primary group-hover:text-secondary'>Your action plan</h3>
											{c.actions.length ? (
												<>
													<p className='mt-5 text-[1.375rem] font-bold text-black'>
														{lead
															? `Your ${c.actions.length}-step action plan was emailed to ${lead.email}. Changed answers? Use “Send my updated report” below.`
															: `${c.actions.length} required action${c.actions.length === 1 ? "" : "s"} ready. Enter your details below and we’ll email your step-by-step plan.`}
													</p>
													<div className='pointer-events-none mt-5 space-y-4 blur-[5px] select-none' aria-hidden='true'>
														{c.actions.map((text, index) => (
															<div
																key={index}
																className='flex items-start gap-6 rounded-2xl p-6 [box-shadow:rgba(0,0,0,0.4)_0px_8px_12px,rgba(0,0,0,0.4)_0px_-5px_12px_1px]'>
																<img src='https://833probaid.com/images/arrow.png' alt='' />
																<p className='text-[1.375rem] font-bold'>{text.replace(/\S/g, "x")}</p>
															</div>
														))}
													</div>
												</>
											) : (
												<p className='mt-5 text-[1.375rem] font-bold'>
													{c.answered ? "No actions needed based on your answers so far." : "Your action plan builds as you answer."}
												</p>
											)}
										</div>

										<div
											className={`rounded-2xl border border-gray-200 bg-white p-6 pb-8 ${cardLift}`}
											style={{ boxShadow: layerCardShadow }}>
											<h3 className='-mt-[0.2em] text-[1.375rem] font-bold text-primary group-hover:text-secondary'>If no action is taken</h3>
											<LayerRows
												items={[
													"Fire, water, or vandalism claims may be denied",
													`Liability exposure may fall on the ${r.title} personally`,
													"Insurance coverage may be considered void under current conditions",
												]}
											/>
										</div>

										<div
											className={`rounded-2xl border border-gray-200 bg-white p-6 pb-8 ${cardLift}`}
											style={{ boxShadow: layerCardShadow }}>
											<h3 className='-mt-[0.2em] text-[1.375rem] font-bold text-primary group-hover:text-secondary'>Coverage guidance</h3>
											<LayerRows
												items={[
													"Discuss vacant-property insurance with your insurer — often written on a DP-1 or DP-3 dwelling form, or added as a vacancy endorsement.",
													"Confirm in writing: when the vacancy clause starts, any inspection requirements, and exclusions for vandalism, theft, glass breakage, and water damage.",
												]}
											/>
										</div>

										{!lead ? (
											<form
												onSubmit={submit}
												noValidate
												className={`space-y-6 rounded-2xl border-[3px] border-secondary bg-white p-6 sm:p-8 ${cardLift}`}
												style={{ boxShadow: layerCardShadow }}>
												<p className='text-2xl font-bold tracking-[1px] text-secondary uppercase group-hover:text-primary'>
													Get your full report &amp; action plan
												</p>
												<h3 className='mt-2 text-2xl font-bold text-primary group-hover:text-secondary'>
													Your step-by-step action plan and full report are sent to your email. Use an email you can open right now.
												</h3>
												<input type='text' tabIndex={-1} autoComplete='off' value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} className='hidden' aria-hidden='true' />
												<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
													{[
														["first", "First name", "text", "given-name", ""],
														["last", "Last name", "text", "family-name", ""],
														["email", "Email", "email", "email", ""],
														["phone", "Phone", "tel", "tel", "(555) 234-5678"],
													].map(([k, label, type, ac, ph]) => (
														<label key={k} className='block'>
															<span className='text-[1.375rem] font-bold uppercase text-primary group-hover:text-secondary'>
																{label} <span className='text-secondary'>*</span>
															</span>
															<input
																type={type}
																autoComplete={ac}
																placeholder={ph}
																value={form[k]}
																onChange={(e) => setForm({ ...form, [k]: e.target.value })}
																className={`${reportInputCls} mt-2`}
																style={{
																	borderColor: invalid[k] ? "#dc2626" : "var(--color-primary)",
																	boxShadow: fieldShadow,
																	"--tw-ring-color": invalid[k] ? "rgba(220, 38, 38, 0.25)" : "rgba(0, 151, 167, 0.25)",
																}}
															/>
														</label>
													))}
													<label className='block sm:col-span-2'>
														<span className='text-[1.375rem] font-bold uppercase text-primary group-hover:text-secondary'>
															Also send a copy to my attorney (optional)
														</span>
														<input
															type='email'
															placeholder='attorney@lawfirm.com'
															value={form.atty}
															onChange={(e) => setForm({ ...form, atty: e.target.value })}
															className={`${reportInputCls} mt-2`}
															style={{
																borderColor: invalid.atty ? "#dc2626" : "var(--color-primary)",
																boxShadow: fieldShadow,
																"--tw-ring-color": invalid.atty ? "rgba(220, 38, 38, 0.25)" : "rgba(0, 151, 167, 0.25)",
															}}
														/>
														<span className='mt-2 block text-base font-bold text-black'>
															Your attorney gets the same report when you click the button below. Leave blank to skip.
														</span>
													</label>
												</div>
												<label className={`flex items-start gap-3 text-[1.125rem] font-bold ${invalid.consent ? "text-red-700" : "text-black"}`}>
													<input type='checkbox' checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className='mt-1 h-5 w-5 accent-[#0097A7]' />
													<span>
														I agree that 833PROBAID® may contact me about this report by phone, text, or email, and I agree to the{" "}
														<a href={TERMS_URL} target='_blank' rel='noopener noreferrer' className='font-bold underline text-primary'>
															Website Terms of Use, Privacy Policy &amp; Disclosures
														</a>
														.
													</span>
												</label>
												<div className='flex justify-center'>
													<CTAButton
														type='submit'
														label={sending ? "Sending…" : "Email me my report & action plan"}
														disabled={sending}
														icon='/arrow-right.png'
														className='h-12 px-5 lg:h-14'
														aria-label='Email me my report and action plan'
													/>
												</div>
												{status.text ? <p className={`text-center text-[1.125rem] font-bold ${status.type === "err" ? "text-red-700" : "text-primary"}`} role='status'>{status.text}</p> : null}
											</form>
										) : (
											<div
												className={`rounded-2xl border-[3px] border-secondary bg-white p-6 text-center sm:p-8 ${cardLift}`}
												style={{ boxShadow: layerCardShadow }}>
												{thanks ? <p className='font-bold text-primary'>{thanks}</p> : null}
												<p className='text-2xl font-bold tracking-[1px] text-secondary uppercase group-hover:text-primary'>
													Need help fixing this?
												</p>
												<h3 className='mt-2 text-2xl font-bold text-primary group-hover:text-secondary'>
													We regularly help executors, trustees, and conservators get vacant properties secured, documented, and properly insured — and we can point you to insurance professionals who handle vacant and probate properties.
												</h3>
												<div className='mt-8 flex flex-col items-center justify-center gap-4'>
													<CTAButton
														label={`Call ${PHONE}`}
														onClick={handleCall}
														icon='/arrow-right.png'
														className='h-12 px-5 lg:h-14'
														aria-label={`Call ${PHONE}`}
													/>
													<button
														type='button'
														onClick={resend}
														disabled={sending}
														className='text-[1.125rem] font-bold text-primary underline disabled:opacity-60'>
														{sending ? "Sending…" : "Done some steps? Send my updated report"}
													</button>
												</div>
												{resendMsg ? <p className='mt-4 font-bold text-primary'>{resendMsg}</p> : null}
											</div>
										)}

										<div
											className={`flex items-start gap-3 rounded-2xl border-[3px] border-secondary px-6 py-5 ${cardLift}`}
											style={{ boxShadow: layerCardShadow }}>
											<ShieldAlert
												className='mt-1 h-6 w-6 shrink-0 text-secondary'
												strokeWidth={2.5}
												aria-hidden='true'
											/>
											<p className='text-[1.375rem] leading-relaxed font-bold text-secondary'>
												This tool is for general information only and is not legal, insurance, or financial advice. Results depend on the answers entered and don’t account for every circumstance of a specific estate, trust, or conservatorship. Confirm requirements with your attorney, insurance professional, and the court.
											</p>
										</div>
									</div>
								</div>
							</div>
			</ServiceLayout>
		</>
	);
};

export default ProbatePropertyInsuranceRiskCheckerClient;
