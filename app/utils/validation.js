import validator from "validator";
import sanitizeHtml from "sanitize-html";

const sanitizeString = (value) => {
	if (typeof value !== "string") {
		return "";
	}
	const trimmed = validator.trim(value);
	const escaped = sanitizeHtml(trimmed, { allowedTags: [], allowedAttributes: {} });
	return escaped;
};

export function validateEmail(email) {
	const value = sanitizeString(email).toLowerCase();
	if (!validator.isEmail(value)) {
		throw new Error("Invalid email address");
	}
	return value;
}

export function validatePassword(password) {
	if (typeof password !== "string") {
		throw new Error("Password is required");
	}
	const value = validator.trim(password);
	if (value.length < 8) {
		throw new Error("Password must be at least 8 characters long");
	}
	if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)) {
		throw new Error("Password must include upper, lower case letters and digits");
	}
	return value;
}

export function validateName(name) {
	const value = sanitizeString(name);
	if (value.length < 2) {
		throw new Error("Name must be at least 2 characters");
	}
	if (value.length > 120) {
		throw new Error("Name is too long");
	}
	return value;
}

export function validateOtp(code) {
	const normalized = validator.trim(String(code || ""));
	if (!validator.isLength(normalized, { min: 6, max: 6 }) || !validator.isNumeric(normalized)) {
		throw new Error("Invalid OTP code");
	}
	return normalized;
}

export function validateBio(bio) {
	if (bio === undefined || bio === null) {
		return "";
	}
	const value = sanitizeString(bio);
	if (value.length > 600) {
		throw new Error("Bio is too long");
	}
	return value;
}

export function validateBooleanFlag(value, fieldName) {
	if (typeof value === "boolean") {
		return value;
	}

	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		if (normalized === "true") {
			return true;
		}
		if (normalized === "false") {
			return false;
		}
	}

	throw new Error(`${fieldName} must be a boolean`);
}
