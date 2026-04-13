"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageLoading } from "../../../../components/LoadingState";
import { useRouter } from "next/navigation";
import BlogHero from "@/components/BlogHero";
import MediaPickerModal from "@/components/MediaPickerModal";
import BlogGrapesEditor from "@/components/GrapesJSEditor/BlogGrapesEditor";
import blogsApi from "@/app/lib/api/blogs";

const BLOG_CANONICAL_BASE_URL = "https://833probaid.com/blogs";

const slugify = (value = "") =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const normalizeCanonicalUrl = (value = "") => {
	const trimmed = value.trim();
	if (!trimmed) return `${BLOG_CANONICAL_BASE_URL}/`;

	if (/^https?:\/\//i.test(trimmed)) return trimmed;
	if (trimmed.startsWith("833probaid.com")) return `https://${trimmed}`;
	if (trimmed.startsWith("/")) return `https://833probaid.com${trimmed}`;
	if (trimmed.startsWith("blogs/")) return `https://833probaid.com/${trimmed}`;

	return `${BLOG_CANONICAL_BASE_URL}/${trimmed.replace(/^\/+|\/+$/g, "")}`;
};

const getSlugFromCanonicalUrl = (canonicalUrl = "") => {
	try {
		const normalized = normalizeCanonicalUrl(canonicalUrl);
		const parts = new URL(normalized).pathname.split("/").filter(Boolean);
		return slugify(parts[parts.length - 1] || "");
	} catch {
		return slugify(canonicalUrl.split("/").pop() || "");
	}
};

const defaultSeo = {
	metaTitle: "",
	metaDescription: "",
	keywords: "",
	canonicalUrl: `${BLOG_CANONICAL_BASE_URL}/`,
	ogTitle: "",
	ogDescription: "",
	ogImage: "",
	ogImageAlt: "",
	ogType: "article",
	twitterCard: "summary_large_image",
	twitterSite: "",
	twitterTitle: "",
	twitterDescription: "",
	twitterImage: "",
	twitterCreator: "",
	robots: "index, follow",
	googleBot: "",
	structuredData: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "",
  "description": "",
  "author": { "@type": "Person", "name": "" }
}`,
};

const initialBlogContent = {
	videoLink: "",
	seo: { ...defaultSeo },
	metadata: {
		title:
			"Emotional First Aid for Executors: A Compassionate Guide to Probate",
		description:
			"Learn how to provide emotional support to executors during probate.",
		keywords: "executor emotional support, probate grief",
		author: "Estate Planning Experts",
		canonicalUrl: `${BLOG_CANONICAL_BASE_URL}/emotional-first-aid-executors`,
		image: "/images/og-emotional-support.jpg",
		publishedDate: "2025-01-27",
		modifiedDate: "2025-01-27",
		category: "Estate Planning",
		tags: ["Executors", "Grief Support"],
		readingTime: "8 min read",

		ogType: "article",
		twitterCard: "summary_large_image",
		twitterSite: "@yourhandle",
	},
	hero: {
		bannerImage: "/images/blog.png",
		title: "Emotional First Aid: Supporting Executors Beyond The Legal Process",
		authorName: "Tigran Mkrtchian",
		authorAvatar: "/images/hero.png",
	},
	flatContent: [],
	steps: [
		{
			number: 1,
			title: "Recognizing the Emotional Burden on Executors",
			titleStyles: {
				color: "#fe7702",
				background: "",
				size: "huge",
				align: "left",
				bold: false,
				italic: false,
				underline: false,
				strike: false,
				font: "anton",
			},
			seo: {
				anchor: "emotional-burden",
				metaDescription: "Understand the emotional challenges executors face.",
			},
			content: [
				{
					type: "paragraph",
					text: "Executors are responsible for settling the deceased's affairs.",
					highlight: "The Executor's Role:",
					textStyles: {
						color: "#000000",
						background: "",
						size: "normal",
						align: "left",
						bold: false,
						italic: false,
						underline: false,
						strike: false,
						font: "",
					},
					highlightStyles: {
						color: "#0097a7",
						background: "",
						size: "normal",
						align: "left",
						bold: true,
						italic: false,
						underline: false,
						strike: false,
						font: "",
					},
				},
			],
		},
	],
	disclaimer: {
		text: "This blog post is for informational purposes only.",
		highlight: "Disclaimer:",
		textStyles: {
			color: "#000000",
			background: "",
			size: "normal",
			align: "left",
			bold: false,
			italic: false,
			underline: false,
			strike: false,
			font: "montserrat",
		},
		highlightStyles: {
			color: "#fe7702",
			background: "",
			size: "normal",
			align: "left",
			bold: true,
			italic: false,
			underline: false,
			strike: false,
			font: "montserrat",
		},
	},
	structuredData: {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: "Emotional First Aid for Executors",
		description:
			"Learn how to provide emotional support to executors during probate.",
		author: { "@type": "Person", name: "Estate Planning Experts" },
		publisher: {
			"@type": "Organization",
			name: "Your Organization Name",
			logo: { "@type": "ImageObject", url: "https://yourwebsite.com/logo.png" },
		},
		datePublished: "2025-01-27",
		dateModified: "2025-01-27",
		image: "https://yourwebsite.com/images/og-emotional-support.jpg",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": "https://yourwebsite.com/blog/emotional-first-aid-executors",
		},
	},
};

export default function BlogEditPage() {
	const router = useRouter();
	const [blogContent, setBlogContent] = useState(initialBlogContent);
	const [grapesContent, setGrapesContent] = useState({
		html: "",
		css: "",
		state: null,
	});
	const [activeTab, setActiveTab] = useState("hero");
	const [seoStructuredDataError, setSeoStructuredDataError] = useState("");
	const [blogId, setBlogId] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [saveStatus, setSaveStatus] = useState("");
	const [showMediaPicker, setShowMediaPicker] = useState(false);
	const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // 'banner' | 'author' | 'seoOgImage' | 'seoTwitterImage'
	const [isLoading, setIsLoading] = useState(false);
	const canonicalPreviewUrl = normalizeCanonicalUrl(
		blogContent.seo?.canonicalUrl || "",
	);
	const canonicalPreviewSlug = getSlugFromCanonicalUrl(canonicalPreviewUrl);

	useEffect(() => {
		// Check if editing existing blog
		if (typeof window === "undefined") return;
		const params = new URLSearchParams(window.location.search);
		const id = params.get("id");
		if (id) {
			setBlogId(id);
			loadBlog(id);
		}
	}, []);

	const loadBlog = async (id) => {
		try {
			setIsLoading(true);
			const response = await blogsApi.getById(id);
			if (response.success && response.blog) {
				const blog = response.blog;
				
				console.log("Loading blog:", {
					title: blog.title,
					author: blog.author,
					contentType: typeof blog.content,
					hasHeroInContent: !!blog.content?.hero,
				});
				
				// Extract content structure
				let grapesData = { html: "", css: "", state: null };
				let heroData = null;
				
				// Check if content is the new format (object with grapesContent and hero)
				if (blog.content && typeof blog.content === 'object') {
					if (blog.content.grapesContent) {
						// New format: structured content
						grapesData = blog.content.grapesContent;
						heroData = blog.content.hero;
						console.log("Loaded structured content with hero:", heroData);
					} else if (blog.content.html || blog.content.css) {
						// Legacy format: direct GrapesJS content
						grapesData = blog.content;
						console.log("Loaded legacy GrapesJS content");
					}
				}
				
				// Set GrapesJS content
				setGrapesContent(grapesData);
				
				// Build hero from stored hero data or fallback to blog fields
				const hero = heroData || {
					bannerImage: blog.image || "",
					title: blog.title || "",
					authorName: blog.author || "",
					authorAvatar: "/images/hero.png",
				};
				
				console.log("Final hero data:", hero);
				
				// Load SEO fields
				const loadedSeo = blog.seo || {};
				const canonicalFallback = blog.slug
					? `${BLOG_CANONICAL_BASE_URL}/${blog.slug}`
					: `${BLOG_CANONICAL_BASE_URL}/`;
				const seo = {
					...defaultSeo,
					...loadedSeo,
					canonicalUrl: normalizeCanonicalUrl(
						loadedSeo.canonicalUrl || canonicalFallback,
					),
					structuredData:
						loadedSeo.structuredData
							? typeof loadedSeo.structuredData === "string"
								? loadedSeo.structuredData
								: JSON.stringify(loadedSeo.structuredData, null, 2)
							: defaultSeo.structuredData,
				};

				// Set blog content state
				setBlogContent({
					...initialBlogContent,
					hero,
					seo,
					videoLink: blog.videoLink || "",
					metadata: {
						...initialBlogContent.metadata,
						title: blog.title || "",
						description: blog.description || "",
						category: blog.category || "Uncategorized",
						tags: blog.tags || [],
						author: blog.author || "Anonymous",
						readingTime: blog.readingTime || "5 min read",
					},
				});
			}
		} catch (error) {
			console.error("Error loading blog:", error);
			alert("Failed to load blog");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSaveBlog = async () => {
		setIsSaving(true);
		setSaveStatus("");

		try {
			// Prepare blog data from content
			const title =
				blogContent.hero?.title ||
				blogContent.metadata?.title ||
				"Untitled Blog";

			const canonicalUrl = normalizeCanonicalUrl(
				blogContent.seo?.canonicalUrl || "",
			);
			const slug = getSlugFromCanonicalUrl(canonicalUrl);

			if (!slug) {
				setActiveTab("seo");
				setSaveStatus("error");
				alert(
					"Please add a slug at the end of Canonical URL in SEO Settings.",
				);
				return;
			}

			// Parse structured data JSON for saving
			let parsedStructuredData = null;
			const rawSd = blogContent.seo?.structuredData || "";
			if (rawSd.trim()) {
				try {
					parsedStructuredData = JSON.parse(rawSd);
				} catch (error) {
					setSeoStructuredDataError(error.message);
					setActiveTab("seo");
					setSaveStatus("error");
					alert("Structured Data must be valid JSON.");
					return;
				}
			}

			const blogData = {
				title,
				description: blogContent.metadata?.description || "",
				category: blogContent.metadata?.category || "Uncategorized",
				tags: blogContent.metadata?.tags || [],
				author: blogContent.hero?.authorName || blogContent.metadata?.author || "Anonymous",
				image:
					blogContent.hero?.bannerImage || blogContent.metadata?.image || "",
				readingTime: blogContent.metadata?.readingTime || "5 min read",
				videoLink: blogContent.videoLink || "",
				slug,
				seo: {
					...blogContent.seo,
					canonicalUrl,
					structuredData: parsedStructuredData,
				},
				content: {
					grapesContent,
					hero: blogContent.hero, // Save full hero object including authorAvatar
				},
			};

			console.log("Saving blog with data:", {
				title: blogData.title,
				author: blogData.author,
				heroInContent: blogData.content.hero,
			});

			let response;
			const isNewBlog = !blogId;

			if (blogId) {
				// Update existing blog
				response = await blogsApi.update(blogId, blogData);
			} else {
				// Create new blog
				response = await blogsApi.create(blogData);
			}

			if (response.success) {
				setSaveStatus("success");

				if (isNewBlog) {
					// Redirect to blogs list after creating new blog
					setTimeout(() => {
						router.push("/dashboard/blogs");
					}, 1000);
				} else {
					// Just show success message for updates
					setTimeout(() => setSaveStatus(""), 3000);
				}
			} else {
				setSaveStatus("error");
				alert("Failed to save blog");
			}
		} catch (error) {
			console.error("Error saving blog:", error);
			setSaveStatus("error");
			alert("Failed to save blog: " + error.message);
		} finally {
			setIsSaving(false);
		}
	};

	const handleUpdateHero = (hero) => {
		console.log("Updating hero:", hero);
		setBlogContent({
			...blogContent,
			hero,
			metadata: {
				...blogContent.metadata,
				// Sync author name to metadata
				author: hero.authorName || blogContent.metadata?.author,
				// Sync title to metadata
				title: hero.title || blogContent.metadata?.title,
			},
		});
	};

	const handleMediaSelect = (file) => {
		if (mediaPickerTarget === "banner") {
			handleUpdateHero({
				...blogContent.hero,
				bannerImage: file.url,
			});
		} else if (mediaPickerTarget === "author") {
			handleUpdateHero({
				...blogContent.hero,
				authorAvatar: file.url,
			});
		} else if (mediaPickerTarget === "seoOgImage") {
			setBlogContent({
				...blogContent,
				seo: {
					...blogContent.seo,
					ogImage: file.url,
				},
			});
		} else if (mediaPickerTarget === "seoTwitterImage") {
			setBlogContent({
				...blogContent,
				seo: {
					...blogContent.seo,
					twitterImage: file.url,
				},
			});
		}
		setMediaPickerTarget(null);
	};

	const handleExport = () => {
		const dataStr = JSON.stringify(blogContent, null, 2);
		const blob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `blog-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleImport = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					setBlogContent(JSON.parse(event.target.result));
					alert("Imported!");
				} catch {
					alert("Invalid file");
				}
			};
			reader.readAsText(file);
		}
	};

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<PageLoading title='Loading editor…' message='Preparing your blog workspace' />
			</div>
		);
	}

	return (
		<>
			<div className='min-h-screen bg-gray-50'>
				<div className='sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm'>
					<div className='mx-auto max-w-7xl px-4 py-4'>
						<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
							<div className='flex items-center gap-3'>
								<Link
									href='/dashboard/blogs'
									className='rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50'>
									<svg
										className='h-5 w-5'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M15 19l-7-7 7-7'
										/>
									</svg>
								</Link>
								<div>
									<h1 className='font-anton text-xl text-gray-900'>
										Blog Editor
									</h1>
									<p className='font-montserrat text-xs text-gray-500'>
										Create and edit your blog post
									</p>
								</div>
							</div>
							<div className='flex flex-wrap gap-2'>
								<label className='cursor-pointer rounded-lg border border-gray-200 px-4 py-2 font-montserrat text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary'>
									Import
									<input
										type='file'
										accept='.json'
										onChange={handleImport}
										className='hidden'
									/>
								</label>
								<button
									onClick={handleExport}
									className='rounded-lg border border-gray-200 px-4 py-2 font-montserrat text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary'>
									Export
								</button>
								<button
									onClick={handleSaveBlog}
									disabled={isSaving}
									className='flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'>
									{isSaving ? (
										<>
											<svg
												className='h-4 w-4 animate-spin'
												fill='none'
												viewBox='0 0 24 24'>
												<circle
													className='opacity-25'
													cx='12'
													cy='12'
													r='10'
													stroke='currentColor'
													strokeWidth='4'></circle>
												<path
													className='opacity-75'
													fill='currentColor'
													d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
											</svg>
											Saving...
										</>
									) : (
										<>
											{saveStatus === "success" ? (
												<svg
													className='h-4 w-4'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M5 13l4 4L19 7'
													/>
												</svg>
											) : (
												<svg
													className='h-4 w-4'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4'
													/>
												</svg>
											)}
											{saveStatus === "success"
												? "Saved!"
												: blogId
													? "Update"
													: "Publish"}
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className='border-b border-gray-200 bg-white'>
					<div className='mx-auto px-4'>
						<div className='flex gap-1'>
							<button
								onClick={() => setActiveTab("hero")}
								className={`px-6 py-3 font-montserrat text-sm font-semibold transition-colors ${
									activeTab === "hero"
										? "border-b-2 border-primary text-primary"
										: "text-gray-600 hover:text-gray-900"
								}`}>
								Blog Hero
							</button>
							<button
								onClick={() => setActiveTab("content")}
								className={`px-6 py-3 font-montserrat text-sm font-semibold transition-colors ${
									activeTab === "content"
										? "border-b-2 border-primary text-primary"
										: "text-gray-600 hover:text-gray-900"
								}`}>
								Blog Content
								</button>
								<button
									onClick={() => setActiveTab("seo")}
									className={`px-6 py-3 font-montserrat text-sm font-semibold transition-colors ${
										activeTab === "seo"
											? "border-b-2 border-primary text-primary"
											: "text-gray-600 hover:text-gray-900"
									}`}>
									SEO Settings
								</button>
							</div>
						</div>
					</div>

				<section className='font-montserrat mx-auto px-4 py-8'>
					{activeTab === "hero" && (
						<div className='space-y-6'>
							<div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
								<h2 className='font-anton mb-4 text-2xl text-gray-900'>
									Blog Hero Settings
								</h2>
								<div className='space-y-4'>
									<div>
										<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
											Banner Image
										</label>
										<div className='flex gap-2'>
											<input
												type='text'
												value={blogContent.hero?.bannerImage || ""}
												onChange={(e) =>
													handleUpdateHero({
														...blogContent.hero,
														bannerImage: e.target.value,
													})
												}
												placeholder='/images/blog.png'
												className='flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
											/>
											<button
												type='button'
												onClick={() => {
													setMediaPickerTarget("banner");
													setShowMediaPicker(true);
												}}
												className='rounded-lg bg-primary px-4 py-2 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-primary/90'>
												<svg
													className='h-5 w-5'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
													/>
												</svg>
											</button>
										</div>
										{blogContent.hero?.bannerImage && (
											<div className='mt-2 rounded-lg border border-gray-200 p-2'>
												<img
													src={blogContent.hero.bannerImage}
													alt='Banner preview'
													className='h-32 w-full rounded object-cover'
												/>
											</div>
										)}
									</div>
									<div>
										<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
											Blog Title
										</label>
										<input
											type='text'
											value={blogContent.hero?.title || ""}
											onChange={(e) =>
												handleUpdateHero({
													...blogContent.hero,
													title: e.target.value,
												})
											}
											placeholder='Enter blog title'
											className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
										/>
									</div>
									<div>
										<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
											Author Name
										</label>
										<input
											type='text'
											value={blogContent.hero?.authorName || ""}
											onChange={(e) =>
												handleUpdateHero({
													...blogContent.hero,
													authorName: e.target.value,
												})
											}
											placeholder='Enter author name'
											className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
										/>
									</div>
									<div>
										<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
											Author Avatar URL
										</label>
										<div className='flex gap-2'>
											<input
												type='text'
												value={blogContent.hero?.authorAvatar || ""}
												onChange={(e) =>
													handleUpdateHero({
														...blogContent.hero,
														authorAvatar: e.target.value,
													})
												}
												placeholder='/images/hero.png'
												className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
											/>
											<button
												type='button'
												onClick={() => {
													setMediaPickerTarget("author");
													setShowMediaPicker(true);
												}}
												className='rounded-lg border border-gray-300 bg-white p-2 transition hover:bg-gray-50'
												title='Select from gallery'>
												<svg
													className='h-6 w-6 text-gray-600'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
													/>
												</svg>
											</button>
										</div>
										{blogContent.hero?.authorAvatar && (
											<div className='mt-2 rounded-lg border border-gray-200 bg-gray-50 p-2'>
												<img
													src={blogContent.hero.authorAvatar}
													alt='Author avatar preview'
													className='h-32 w-32 rounded-full object-cover mx-auto'
												/>
											</div>
										)}
									</div>

									<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<div>
							<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
								Video Link
							</label>
							<input
								value={blogContent.videoLink || ""}
								onChange={(e) =>
									setBlogContent({
										...blogContent,
										videoLink: e.target.value,
									})
								}
								placeholder='https://youtube.com/watch?v=...'
								className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
							/>
						</div>
										<div>
											<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
												Category
											</label>
											<input
												type='text'
												value={blogContent.metadata?.category || ""}
												onChange={(e) =>
													setBlogContent({
														...blogContent,
														metadata: {
															...blogContent.metadata,
															category: e.target.value,
														},
													})
												}
												placeholder='Estate Planning'
												className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
											/>
										</div>
									</div>
								</div>

								{/* Preview */}
								<div className='mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6'>
									<h3 className='font-anton mb-4 text-lg text-gray-900'>
										Preview
									</h3>
									<BlogHero
										bannerImage={blogContent.hero?.bannerImage}
										title={blogContent.hero?.title}
										authorName={blogContent.hero?.authorName}
										authorAvatar={blogContent.hero?.authorAvatar}
									/>
								</div>
							</div>
						</div>
					)}

					{activeTab === "content" && (
						<BlogGrapesEditor
							initialContent={grapesContent}
							onSave={(content) => setGrapesContent(content)}
						/>
					)}

					{activeTab === "seo" && (
								<div className='space-y-6'>
									<div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
										<h2 className='font-anton mb-1 text-2xl text-gray-900'>SEO Settings</h2>
										<p className='font-montserrat mb-6 text-sm text-gray-500'>Control how this blog appears in search engines and social media.</p>

										{/* ─── Search Engine ─── */}
										<h3 className='font-montserrat mb-3 text-xs font-bold uppercase tracking-widest text-gray-400'>Search Engine</h3>
										<div className='space-y-4 mb-8'>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Meta Title <span className='font-normal text-gray-400'>(leave blank to use blog title)</span></label>
												<input
													type='text'
													value={blogContent.seo?.metaTitle || ""}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, metaTitle: e.target.value } })}
													placeholder={blogContent.hero?.title || "Blog title"}
													maxLength={60}
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
												/>
												<p className='mt-1 text-right font-montserrat text-xs text-gray-400'>{(blogContent.seo?.metaTitle || "").length}/60</p>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Meta Description <span className='font-normal text-gray-400'>(leave blank to use blog description)</span></label>
												<textarea
													rows={3}
													value={blogContent.seo?.metaDescription || ""}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, metaDescription: e.target.value } })}
													placeholder={blogContent.metadata?.description || "Short description for search snippets"}
													maxLength={160}
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
												/>
												<p className='mt-1 text-right font-montserrat text-xs text-gray-400'>{(blogContent.seo?.metaDescription || "").length}/160</p>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Keywords <span className='font-normal text-gray-400'>(comma-separated)</span></label>
												<input
													type='text'
													value={blogContent.seo?.keywords || ""}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, keywords: e.target.value } })}
													placeholder='probate, executor, estate planning'
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
												/>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Canonical URL</label>
												<input
													type='url'
													value={blogContent.seo?.canonicalUrl || ""}
													onChange={(e) =>
														setBlogContent({
															...blogContent,
															seo: {
																...blogContent.seo,
																canonicalUrl: e.target.value,
															},
														})
													}
													placeholder='https://833probaid.com/blogs/your-blog-slug'
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
												/>
														<p className='mt-1 font-montserrat text-xs text-gray-400'>Slug is taken from the last part of this URL.</p>
														<div className='mt-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2'>
															<p className='font-montserrat text-xs text-gray-500'>
																Detected slug:{" "}
																<span className='font-mono text-gray-700'>
																	{canonicalPreviewSlug || "(empty)"}
																</span>
															</p>
															<p className='mt-1 break-all font-mono text-xs text-gray-500'>
																{canonicalPreviewUrl}
															</p>
														</div>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Robots</label>
												<select
													value={blogContent.seo?.robots || "index, follow"}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, robots: e.target.value } })}
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'>
													<option value='index, follow'>index, follow (default)</option>
													<option value='noindex, follow'>noindex, follow</option>
													<option value='index, nofollow'>index, nofollow</option>
													<option value='noindex, nofollow'>noindex, nofollow</option>
												</select>
											</div>
										</div>

										{/* ─── Open Graph ─── */}
										<h3 className='font-montserrat mb-3 text-xs font-bold uppercase tracking-widest text-gray-400'>Open Graph (Facebook / LinkedIn)</h3>
										<div className='space-y-4 mb-8'>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>OG Title <span className='font-normal text-gray-400'>(leave blank to use meta title)</span></label>
												<input
													type='text'
													value={blogContent.seo?.ogTitle || ""}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, ogTitle: e.target.value } })}
													placeholder={blogContent.seo?.metaTitle || blogContent.hero?.title || ""}
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
												/>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>OG Description</label>
												<textarea
													rows={3}
													value={blogContent.seo?.ogDescription || ""}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, ogDescription: e.target.value } })}
													placeholder={blogContent.seo?.metaDescription || blogContent.metadata?.description || ""}
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
												/>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>OG Image URL <span className='font-normal text-gray-400'>(leave blank to use banner)</span></label>
												<div className='flex gap-2'>
													<input
														type='text'
														value={blogContent.seo?.ogImage || ""}
														onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, ogImage: e.target.value } })}
														placeholder={blogContent.hero?.bannerImage || "/images/og-default.jpg"}
														className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
													/>
													<button
														type='button'
														onClick={() => {
															setMediaPickerTarget("seoOgImage");
															setShowMediaPicker(true);
														}}
														className='rounded-lg border border-gray-300 bg-white p-2 transition hover:bg-gray-50'
														title='Select from gallery'>
														<svg
															className='h-6 w-6 text-gray-600'
															fill='none'
															stroke='currentColor'
															viewBox='0 0 24 24'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
															/>
														</svg>
													</button>
												</div>
												{blogContent.seo?.ogImage && (
													<div className='mt-2 rounded-lg border border-gray-200 bg-gray-50 p-2'>
														<img
															src={blogContent.seo.ogImage}
															alt='Open Graph preview'
															className='h-32 w-full rounded object-cover'
														/>
													</div>
												)}
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>OG Image Alt</label>
												<input
													type='text'
													value={blogContent.seo?.ogImageAlt || ""}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, ogImageAlt: e.target.value } })}
													placeholder='Descriptive alt text for social preview image'
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
												/>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>OG Type</label>
												<select
													value={blogContent.seo?.ogType || "article"}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, ogType: e.target.value } })}
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'>
													<option value='article'>article</option>
													<option value='website'>website</option>
												</select>
											</div>
										</div>

										{/* ─── Twitter / X Card ─── */}
										<h3 className='font-montserrat mb-3 text-xs font-bold uppercase tracking-widest text-gray-400'>Twitter / X Card</h3>
										<div className='space-y-4 mb-8'>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Twitter Card Type</label>
												<select
													value={blogContent.seo?.twitterCard || "summary_large_image"}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, twitterCard: e.target.value } })}
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'>
													<option value='summary_large_image'>summary_large_image</option>
													<option value='summary'>summary</option>
												</select>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Twitter Site Handle <span className='font-normal text-gray-400'>(e.g. @833probaid)</span></label>
												<input
													type='text'
													value={blogContent.seo?.twitterSite || ""}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, twitterSite: e.target.value } })}
													placeholder='@833probaid'
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
												/>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Twitter Creator Handle</label>
												<input
													type='text'
													value={blogContent.seo?.twitterCreator || ""}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, twitterCreator: e.target.value } })}
													placeholder='@authorhandle'
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
												/>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Twitter Title (optional override)</label>
												<input
													type='text'
													value={blogContent.seo?.twitterTitle || ""}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, twitterTitle: e.target.value } })}
													placeholder={blogContent.seo?.ogTitle || blogContent.seo?.metaTitle || blogContent.hero?.title || ""}
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
												/>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Twitter Description (optional override)</label>
												<textarea
													rows={3}
													value={blogContent.seo?.twitterDescription || ""}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, twitterDescription: e.target.value } })}
													placeholder={blogContent.seo?.ogDescription || blogContent.seo?.metaDescription || blogContent.metadata?.description || ""}
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
												/>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Twitter Image URL (optional override)</label>
												<div className='flex gap-2'>
													<input
														type='text'
														value={blogContent.seo?.twitterImage || ""}
														onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, twitterImage: e.target.value } })}
														placeholder={blogContent.seo?.ogImage || blogContent.hero?.bannerImage || ""}
														className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
													/>
													<button
														type='button'
														onClick={() => {
															setMediaPickerTarget("seoTwitterImage");
															setShowMediaPicker(true);
														}}
														className='rounded-lg border border-gray-300 bg-white p-2 transition hover:bg-gray-50'
														title='Select from gallery'>
														<svg
															className='h-6 w-6 text-gray-600'
															fill='none'
															stroke='currentColor'
															viewBox='0 0 24 24'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
															/>
														</svg>
													</button>
												</div>
											</div>
											<div>
												<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Googlebot Directive (optional)</label>
												<input
													type='text'
													value={blogContent.seo?.googleBot || ""}
													onChange={(e) => setBlogContent({ ...blogContent, seo: { ...blogContent.seo, googleBot: e.target.value } })}
													placeholder='max-image-preview:large, max-snippet:-1, max-video-preview:-1'
													className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
												/>
											</div>
										</div>

										{/* ─── Structured Data (JSON-LD) ─── */}
										<h3 className='font-montserrat mb-3 text-xs font-bold uppercase tracking-widest text-gray-400'>Structured Data (JSON-LD / Schema.org)</h3>
										<div className='space-y-2'>
											<p className='font-montserrat text-xs text-gray-500'>Paste valid JSON-LD. Leave blank to skip. Common types: Article, FAQPage, HowTo, BreadcrumbList.</p>
											<textarea
												rows={12}
												spellCheck={false}
												value={blogContent.seo?.structuredData || ""}
												onChange={(e) => {
													const val = e.target.value;
													setBlogContent({ ...blogContent, seo: { ...blogContent.seo, structuredData: val } });
													if (val.trim() === "") { setSeoStructuredDataError(""); return; }
													try { JSON.parse(val); setSeoStructuredDataError(""); }
													catch (err) { setSeoStructuredDataError(err.message); }
												}}
												className={`w-full rounded-lg border px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
													seoStructuredDataError ? "border-red-400 bg-red-50" : "border-gray-300"
												}`}
											/>
											{seoStructuredDataError && (
												<p className='font-montserrat text-xs text-red-500'>JSON error: {seoStructuredDataError}</p>
											)}
											<div className='flex gap-2'>
												<button
													type='button'
													onClick={() => {
														const title = blogContent.hero?.title || blogContent.metadata?.title || "";
														const desc = blogContent.seo?.metaDescription || blogContent.metadata?.description || "";
														const author = blogContent.hero?.authorName || blogContent.metadata?.author || "";
														const canonical = blogContent.seo?.canonicalUrl || "";
														const image = blogContent.seo?.ogImage || blogContent.hero?.bannerImage || "";
														const template = {
															"@context": "https://schema.org",
															"@type": "Article",
															headline: title,
															description: desc,
															author: { "@type": "Person", name: author },
															publisher: {
																"@type": "Organization",
																name: "833PROBAID",
																logo: { "@type": "ImageObject", url: "https://833probaid.com/images/logo.png" },
															},
															image: image,
															mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
														};
														setBlogContent({ ...blogContent, seo: { ...blogContent.seo, structuredData: JSON.stringify(template, null, 2) } });
														setSeoStructuredDataError("");
													}}
													className='rounded-lg border border-gray-300 px-3 py-1.5 font-montserrat text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors'>
													Auto-fill Article template
												</button>
												<button
													type='button'
													onClick={() => { setBlogContent({ ...blogContent, seo: { ...blogContent.seo, structuredData: "" } }); setSeoStructuredDataError(""); }}
													className='rounded-lg border border-gray-300 px-3 py-1.5 font-montserrat text-xs font-semibold text-gray-500 hover:border-red-400 hover:text-red-500 transition-colors'>
													Clear
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
							</section>
						</div>

			<MediaPickerModal
				isOpen={showMediaPicker}
				onClose={() => {
					setShowMediaPicker(false);
					setMediaPickerTarget(null);
				}}
				onSelect={handleMediaSelect}
				allowedTypes={
					mediaPickerTarget === "banner" ||
					mediaPickerTarget === "author" ||
					mediaPickerTarget === "seoOgImage" ||
					mediaPickerTarget === "seoTwitterImage"
						? ["image"]
						: []
				}
			/>
		</>
	);
}
