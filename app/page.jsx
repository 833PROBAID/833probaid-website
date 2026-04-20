// SEO metadata for homepage
export const metadata = {
	title: "Probate, Trust & Conservatorship Real Estate | 833PROBAID®",
	description:
		"833PROBAID® runs a proprietary, court-aligned system for probate, trust, and conservatorship real estate. Eliminate confusion, ensure compliance, and move every case forward with structure and precision. Trusted by attorneys, fiduciaries, and executors.",
	keywords: [
		"probate real estate",
		"trust real estate",
		"conservatorship real estate",
		"court supervised real estate",
		"833PROBAID",
		"overbid calculator",
		"insurance risk checker",
		"access risk analyzer",
		"executor readiness quiz",
		"California probate",
		"fiduciary",
		"estate sale",
		"court aligned system",
		"attorney trusted",
		"real estate tools",
	],
	openGraph: {
		title: "Probate, Trust & Conservatorship Real Estate | 833PROBAID®",
		description:
			"833PROBAID® runs a proprietary, court-aligned system for probate, trust, and conservatorship real estate. Eliminate confusion, ensure compliance, and move every case forward with structure and precision. Trusted by attorneys, fiduciaries, and executors.",
		url: "https://833probaid.com/",
		siteName: "833PROBAID®",
		images: [
			{
				url: "/images/hero-text.png",
				width: 1200,
				height: 630,
				alt: "833PROBAID® Probate, Trust & Conservatorship Real Estate",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Probate, Trust & Conservatorship Real Estate | 833PROBAID®",
		description:
			"833PROBAID® runs a proprietary, court-aligned system for probate, trust, and conservatorship real estate. Eliminate confusion, ensure compliance, and move every case forward with structure and precision. Trusted by attorneys, fiduciaries, and executors.",
		images: ["/images/hero-text.png"],
	},
};
import HomePageClient from "./HomePageClient";
import { getPublishedHomeBooksForHomepage } from "@/app/services/homeBookService";

export const revalidate = 300;

function mapHomeBookForCard(homeBook) {
	const id = homeBook?._id?.toString?.() || homeBook?.id || "";
	return {
		id,
		icon: homeBook?.icon || "/icons/card-icon-1.svg",
		title: homeBook?.title || "Untitled",
		subtitle: homeBook?.subtitle || "",
		description: homeBook?.description || "",
		slug: homeBook?.slug || "",
		image: homeBook?.image || "/images/footer-logo.png",
	};
}

export default async function HomePage() {
	let initialHomeCardData = [];

	try {
		const homeBooks = await getPublishedHomeBooksForHomepage();
		initialHomeCardData = (homeBooks || []).map(mapHomeBookForCard);
	} catch (error) {
		console.error("Failed to load homepage home books:", error);
	}

	return <HomePageClient initialHomeCardData={initialHomeCardData} />;
}
