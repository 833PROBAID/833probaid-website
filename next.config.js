const nextConfig = {
	plugins: {
		autoprefixer: {},
	},
	serverExternalPackages: [
		"mongoose",
		"bcryptjs",
		"jsonwebtoken",
		"nodemailer",
		"resend",
		"sanitize-html",
		"postcss",
	],
};

export default nextConfig;
