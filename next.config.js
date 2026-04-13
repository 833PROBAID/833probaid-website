const nextConfig = {
	plugins: {
		autoprefixer: {},
	},
	serverExternalPackages: [
		"mongoose",
		"bcryptjs",
		"jsonwebtoken",
		"nodemailer",
		"sanitize-html",
		"postcss",
	],
};

export default nextConfig;
