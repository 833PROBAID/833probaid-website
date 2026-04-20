/* eslint-disable @next/next/no-img-element */

import BooksHero from "@/components/BooksHero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
	getHomeBookById,
	getHomeBookBySlug,
	getAdjacentPublishedHomeBooksByNo,
	incrementHomeBookViews,
} from "@/app/services/homeBookService";
import HomeBookContentClient from "./HomeBookContentClient";

export const revalidate = 300;

async function fetchHomeBook(slug) {
	const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
	return isObjectId ? getHomeBookById(slug) : getHomeBookBySlug(slug);
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const homeBook = await fetchHomeBook(slug);

	if (!homeBook) {
		return { title: "Home Book Not Found | 833PROBAID" };
	}

	const seo = homeBook.seo || {};
	const title = seo.metaTitle || homeBook.title || "Home Book | 833PROBAID";
	const description = seo.metaDescription || homeBook.description || "";
	const canonical =
		seo.canonicalUrl || `https://833probaid.com/homebooks/${homeBook.slug}`;
	const image = seo.ogImage || homeBook.image || "";
	const ogTitle = seo.ogTitle || title;
	const ogDescription = seo.ogDescription || description;
	const twitterTitle = seo.twitterTitle || ogTitle;
	const twitterDescription = seo.twitterDescription || ogDescription;
	const twitterImage = seo.twitterImage || image;

	const metadata = {
		title,
		description,
		robots: seo.robots || "index, follow",
		alternates: { canonical },
		authors: homeBook.author ? [{ name: homeBook.author }] : undefined,
		openGraph: {
			title: ogTitle,
			description: ogDescription,
			type: seo.ogType || "article",
			url: canonical,
			images: image
				? [
						{
							url: image,
							width: 1200,
							height: 630,
							alt: seo.ogImageAlt || ogTitle,
						},
					]
				: [],
			publishedTime: homeBook.publishedDate
				? new Date(homeBook.publishedDate).toISOString()
				: undefined,
			modifiedTime: homeBook.modifiedDate
				? new Date(homeBook.modifiedDate).toISOString()
				: undefined,
			section: homeBook.category || undefined,
			tags: homeBook.tags?.length ? homeBook.tags : undefined,
		},
		twitter: {
			card: seo.twitterCard || "summary_large_image",
			site: seo.twitterSite || undefined,
			creator: seo.twitterCreator || undefined,
			title: twitterTitle,
			description: twitterDescription,
			images: twitterImage ? [twitterImage] : [],
		},
	};

	if (seo.keywords) {
		metadata.keywords = seo.keywords;
	}

	if (seo.googleBot) {
		metadata.other = {
			...(metadata.other || {}),
			googlebot: seo.googleBot,
		};
	}

	return metadata;
}

export default async function HomeBookDetailPage({ params }) {
	const { slug } = await params;
	const homeBook = await fetchHomeBook(slug);

	if (!homeBook) notFound();

	const currentSerial = Number(homeBook.no);
	const { previous: previousHomeBook, next: nextHomeBook } =
		await getAdjacentPublishedHomeBooksByNo(currentSerial);

	incrementHomeBookViews(homeBook._id.toString()).catch(() => {});

	const heroData = homeBook.content?.hero || {
		bannerImage: homeBook.image || "/images/footer-logo.png",
		title: homeBook.title || "Untitled",
		subtitle: homeBook.subtitle || "A comprehensive guide",
	};

	const grapesContent =
		homeBook.content?.grapesContent ||
		(homeBook.content?.html
			? { html: homeBook.content.html, css: homeBook.content.css || "" }
			: null);

	const structuredData = homeBook.seo?.structuredData || null;
	const structuredDataScript = structuredData
		? typeof structuredData === "string"
			? structuredData
			: JSON.stringify(structuredData)
		: null;

	return (
		<section className='font-montserrat'>
			{structuredDataScript && (
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: structuredDataScript }}
				/>
			)}
			<Navbar />
			<section className='mx-auto mt-5 max-w-7xl px-4 md:px-0'>
				<BooksHero
					bannerImage={heroData.bannerImage}
					title={heroData.title}
					subtitle={heroData.subtitle}
				/>

				<HomeBookContentClient grapesContent={grapesContent} />

				<section className='font-roboto container mx-auto mt-2 flex max-w-7xl items-center justify-between px-4 text-xl font-black md:mt-4 md:text-2xl lg:mt-8 lg:text-3xl xl:mt-12 xl:text-4xl'>
					{previousHomeBook?.slug ? (
						<Link
							href={`/homebooks/${previousHomeBook.slug}`}
							className='flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80'
							title={previousHomeBook.title || previousHomeBook.slug}
							aria-label={`Previous home book: ${previousHomeBook.title || previousHomeBook.slug}`}>
							<img
								className='w-8 lg:w-12'
								src='/images/arrow_prev.png'
								alt='Previous home book'
							/>
							<span className='text-secondary hover:text-primary'>Previous</span>
						</Link>
					) : (
						<span
							className='flex cursor-not-allowed items-center gap-2 opacity-40'
							aria-disabled='true'>
							<img
								className='w-8 lg:w-12'
								src='/images/arrow_prev.png'
								alt='No previous home book'
							/>
							<span className='text-secondary'>Previous</span>
						</span>
					)}

					{nextHomeBook?.slug ? (
						<Link
							href={`/homebooks/${nextHomeBook.slug}`}
							className='flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80'
							title={nextHomeBook.title || nextHomeBook.slug}
							aria-label={`Next home book: ${nextHomeBook.title || nextHomeBook.slug}`}>
							<span className='text-secondary hover:text-primary'>Next</span>
							<img
								className='w-8 lg:w-12'
								src='/images/arrow.png'
								alt='Next home book'
							/>
						</Link>
					) : (
						<span
							className='flex cursor-not-allowed items-center gap-2 opacity-40'
							aria-disabled='true'>
							<span className='text-secondary'>Next</span>
							<img
								className='w-8 lg:w-12'
								src='/images/arrow.png'
								alt='No next home book'
							/>
						</span>
					)}
				</section>
			</section>
			<Footer />
		</section>
	);
}
