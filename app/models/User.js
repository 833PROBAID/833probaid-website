import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 120,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		passwordHash: {
			type: String,
			required: true,
			select: false,
		},
		passwordChangedAt: {
			type: Date,
			default: Date.now,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		roles: {
			type: [String],
			default: ["user"],
		},
		bio: {
			type: String,
			trim: true,
			maxlength: 600,
			default: "",
		},
		settings: {
			pushNotifications: {
				type: Boolean,
				default: true,
			},
			emailNotifications: {
				type: Boolean,
				default: true,
			},
		},
		lastLoginAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
