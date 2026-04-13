import bcrypt from "bcryptjs";
import connectToDatabase from "../utils/db.js";
import User from "../models/User.js";

const SALT_ROUNDS = 12;

export async function findUserByEmail(email) {
	await connectToDatabase();
	return User.findOne({ email }).select("+passwordHash");
}

export async function findSafeUserByEmail(email) {
	await connectToDatabase();
	return User.findOne({ email });
}

export async function findUserById(userId) {
	await connectToDatabase();
	return User.findById(userId);
}

export async function findUserWithPasswordById(userId) {
	await connectToDatabase();
	return User.findById(userId).select("+passwordHash");
}

export async function createUser({ name, email, password }) {
	await connectToDatabase();
	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

	const user = await User.create({
		name,
		email,
		passwordHash,
		passwordChangedAt: new Date(),
	});

	return user;
}

export async function upsertPendingUser({ name, email, password }) {
	await connectToDatabase();
	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
	const existingUser = await User.findOne({ email }).select("+passwordHash");

	if (!existingUser) {
		return User.create({
			name,
			email,
			passwordHash,
			isEmailVerified: false,
			passwordChangedAt: new Date(),
		});
	}

	existingUser.name = name;
	existingUser.passwordHash = passwordHash;
	existingUser.isEmailVerified = false;
	existingUser.passwordChangedAt = new Date();

	await existingUser.save();

	return existingUser;
}

export async function verifyPassword(user, password) {
	return bcrypt.compare(password, user.passwordHash);
}

export async function markEmailVerified(userId) {
	await connectToDatabase();
	return User.findByIdAndUpdate(
		userId,
		{ isEmailVerified: true },
		{ new: true },
	);
}

export async function recordLogin(userId) {
	await connectToDatabase();
	return User.findByIdAndUpdate(userId, { lastLoginAt: new Date() });
}

export async function updateUserPassword(userId, password) {
	await connectToDatabase();
	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
	return User.findByIdAndUpdate(
		userId,
		{ passwordHash, passwordChangedAt: new Date() },
		{ new: true },
	);
}

