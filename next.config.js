import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
	// Keep the static `public/` assets out of the serverless function bundle.
	// The *Service.js files reference `path.join(process.cwd(), "public", …)`
	// for best-effort cleanup of legacy local uploads; the dynamic path makes
	// Next's file tracer pull the entire `public/` tree (blog-images, PDFs) into
	// every function, blowing past the 250 MB limit. Uploads now live on Vercel
	// Blob, so functions never need these files at runtime.
	outputFileTracingExcludes: {
		"*": ["public/**"],
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
