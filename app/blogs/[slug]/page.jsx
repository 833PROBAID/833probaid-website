/* eslint-disable @next/next/no-img-element */

import BlogHero from "@/components/BlogHero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
	getBlogBySlug,
	getBlogById,
	getAdjacentPublishedBlogs,
	incrementBlogViews,
} from "@/app/services/blogService";
import { notFound } from "next/navigation";
import Image from "next/image";
import { scopeCSS } from "@/app/utils/scopeCSS";

export const revalidate = 300;

async function fetchBlog(slug) {
	const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
	return isObjectId ? getBlogById(slug) : getBlogBySlug(slug);
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const blog = await fetchBlog(slug);

	if (!blog) {
		return { title: "Blog Not Found | 833PROBAID" };
	}

	const seo = blog.seo || {};
	const title = seo.metaTitle || blog.title || "Blog | 833PROBAID";
	const description = seo.metaDescription || blog.description || "";
	const image = seo.ogImage || blog.image || "";
	const canonical =
		seo.canonicalUrl || `https://833probaid.com/blogs/${blog.slug}`;
	const ogTitle = seo.ogTitle || title;
	const ogDesc = seo.ogDescription || description;
	const twitterTitle = seo.twitterTitle || ogTitle;
	const twitterDescription = seo.twitterDescription || ogDesc;
	const twitterImage = seo.twitterImage || image;

	const metadata = {
		title,
		description,
		robots: seo.robots || "index, follow",
		alternates: { canonical },
		authors: blog.author ? [{ name: blog.author }] : undefined,
		openGraph: {
			title: ogTitle,
			description: ogDesc,
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
			publishedTime: blog.publishedDate
				? new Date(blog.publishedDate).toISOString()
				: undefined,
			modifiedTime: blog.modifiedDate
				? new Date(blog.modifiedDate).toISOString()
				: undefined,
			section: blog.category || undefined,
			tags: blog.tags?.length ? blog.tags : undefined,
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

export default async function BlogPage({ params }) {
	const { slug } = await params;
	const blog = await fetchBlog(slug);

	if (!blog) notFound();

	const { previous: previousBlog, next: nextBlog } =
		await getAdjacentPublishedBlogs({
			publishedDate: blog.publishedDate,
			blogId: blog._id,
		});

	incrementBlogViews(blog._id.toString()).catch(() => {});

	const heroData = blog.content?.hero || {
		bannerImage: blog.image || "/images/blog.png",
		title: blog.title || "Untitled",
		authorName: blog.author || "Anonymous",
		authorAvatar: "/images/hero.png",
	};

	const grapesContent =
		blog.content?.grapesContent || (blog.content?.html ? blog.content : null);

	const structuredData = blog.seo?.structuredData || null;
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
				<BlogHero
					bannerImage={heroData.bannerImage}
					title={heroData.title}
					authorName={heroData.authorName}
					authorAvatar={heroData.authorAvatar}
				/>

				{grapesContent?.html ? (
					<div className='mt-8'>
						<style
							dangerouslySetInnerHTML={{
								__html: scopeCSS(grapesContent.css || "", ".blog-content"),
							}}
						/>
						{/* FIX: Added contentVisibility="auto" — tells Safari to skip
						    rendering content that is off-screen. This is the single
						    biggest performance win for long articles on Safari.
						    Also added WebkitTransform to force GPU compositing layer
						    so article content doesn't trigger full page repaints. */}
						<div
							className='blog-content'
							style={{
								contain: "layout style",
								isolation: "isolate",
								position: "relative",
								zIndex: 1,
								contentVisibility: "auto",
								WebkitTransform: "translateZ(0)",
								transform: "translateZ(0)",
							}}
							dangerouslySetInnerHTML={{ __html: grapesContent.html }}
						/>
					</div>
				) : (
					<div className='mt-8 text-center text-gray-500'>
						<p>No content available for this blog post.</p>
					</div>
				)}

				<section className='font-roboto container mx-auto mt-2 flex max-w-7xl items-center justify-between px-4 text-xl font-black md:mt-4 md:text-2xl lg:mt-8 lg:text-3xl xl:mt-12 xl:text-4xl'>
					{previousBlog?.slug ? (
						<Link
							href={`/blogs/${previousBlog.slug}`}
							className='flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80'
							title={previousBlog.title || previousBlog.slug}
							aria-label={`Previous blog: ${previousBlog.title || previousBlog.slug}`}>
							<Image
								className='w-8 lg:w-12'
								src='/images/arrow_prev.png'
								alt='Previous blog'
								width={100}
								height={100}
							/>
							<span className='text-secondary hover:text-primary'>Previous</span>
						</Link>
					) : (
						<span
							className='flex cursor-not-allowed items-center gap-2 opacity-40'
							aria-disabled='true'>
							<Image
								className='w-8 lg:w-12'
								src='/images/arrow_prev.png'
								alt='No previous blog'
								width={100}
								height={100}
							/>
							<span className='text-secondary'>Previous</span>
						</span>
					)}

					{nextBlog?.slug ? (
						<Link
							href={`/blogs/${nextBlog.slug}`}
							className='flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80'
							title={nextBlog.title || nextBlog.slug}
							aria-label={`Next blog: ${nextBlog.title || nextBlog.slug}`}>
							<span className='text-secondary hover:text-primary'>Next</span>
							<img
								className='w-8 lg:w-12'
								src='/images/arrow.png'
								alt='Next blog'
								width={100}
								height={100}
							/>
						</Link>
					) : (
						<span
							className='flex cursor-not-allowed items-center gap-2 opacity-40'
							aria-disabled='true'>
							<span className='text-secondary'>Next</span>
							<Image
								className='w-8 lg:w-12'
								src='/images/arrow.png'
								alt='No next blog'
								width={100}
								height={100}
							/>
						</span>
					)}
				</section>
			</section>
			<Footer />
		</section>
	);
}
