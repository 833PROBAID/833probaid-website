// Client-side form validation helpers shared by the vendor / referral forms
// and the newsletter modal. Kept in its own module (rather than inside
// SharedComponents) so lightweight consumers don't pull in the form UI kit.

// A value counts as empty when it has no non-whitespace characters.
export const isEmpty = (v) => !v?.toString().trim();

// --- US phone helpers ------------------------------------------------------
// Strip everything except digits.
export const getPhoneDigits = (v) => (v || "").toString().replace(/\D/g, "");

// Format raw input into "(XXX) XXX-XXXX" as the user types. The "+1" country
// code is shown separately and hard-coded, so a leading "1" is dropped here.
export const formatUSPhone = (raw) => {
	let digits = getPhoneDigits(raw);
	digits = digits.slice(0, 10);
	const len = digits.length;
	if (len === 0) return "";
	if (len < 4) return `(${digits}`;
	if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
	return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

// Valid 10-digit US/NANP number: area code and exchange code both start 2-9.
// (The "next 3" after +1 — the area code — must begin with 2-9.)
export const isValidUSPhone = (v) =>
	/^[2-9]\d{2}[2-9]\d{6}$/.test(getPhoneDigits(v));

// --- Email -----------------------------------------------------------------
// Email validation. Requires a local part, a domain made of dot-separated
// labels (no leading/trailing/consecutive dots), and a TLD of at least 2
// letters — so "das@das.c" is rejected while "name@company.com" passes.
const EMAIL_REGEX =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export const isValidEmail = (v) => {
	const email = (v ?? "").toString().trim();
	// Guard against overly long addresses and lengthy local parts (RFC limits)
	if (email.length > 254) return false;
	if (email.indexOf("@") > 64) return false;
	return EMAIL_REGEX.test(email);
};
