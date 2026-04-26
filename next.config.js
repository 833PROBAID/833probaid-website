import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
	serverExternalPackages: [
		"mongoose",
		"bcryptjs",
		"jsonwebtoken",
		"nodemailer",
		"resend",
		"sanitize-html",
		"postcss",
	],
	turbopack: {
		resolveAlias: {
			html2canvas: "html2canvas-pro",
		},
	},
	webpack: (config) => {
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			html2canvas: path.resolve(__dirname, "node_modules/html2canvas-pro"),
		};
		return config;
	},
};

export default nextConfig;
