/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageLoading } from "../../../../components/LoadingState";
import { useRouter } from "next/navigation";
import BooksHero from "@/components/BooksHero";
import BlogGrapesEditor from "@/components/GrapesJSEditor/BlogGrapesEditor";
import MediaPickerModal from "@/components/MediaPickerModal";
import homeBooksApi from "@/app/lib/api/homeBooks";

const HOMEBOOK_CANONICAL_BASE_URL = "https://833probaid.com/homebooks";

const slugify = (value = "") =>
value
.toLowerCase()
.trim()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");

const normalizeCanonicalUrl = (value = "") => {
const trimmed = value.trim();
if (!trimmed) return `${HOMEBOOK_CANONICAL_BASE_URL}/`;

if (/^https?:\/\//i.test(trimmed)) return trimmed;
if (trimmed.startsWith("833probaid.com")) return `https://${trimmed}`;
if (trimmed.startsWith("/")) return `https://833probaid.com${trimmed}`;
if (trimmed.startsWith("homebooks/")) return `https://833probaid.com/${trimmed}`;

return `${HOMEBOOK_CANONICAL_BASE_URL}/${trimmed.replace(/^\/+|\/+$/g, "")}`;
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
canonicalUrl: `${HOMEBOOK_CANONICAL_BASE_URL}/`,
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

const initialHomeBookContent = {
seo: { ...defaultSeo },
metadata: {
title: "Getting Started with Estate Planning",
description: "A comprehensive guide to estate planning basics",
keywords: "estate planning, probate, legal guide",
author: "Estate Planning Team",
canonicalUrl: `${HOMEBOOK_CANONICAL_BASE_URL}/getting-started-estate-planning`,
image: "/images/home-book.jpg",
publishedDate: "2025-02-01",
modifiedDate: "2025-02-01",
category: "Estate Planning",
tags: ["Planning", "Legal"],
readingTime: "10 min read",
},
hero: {
bannerImage: "/images/home-book.jpg",
icon: "",
title: "Getting Started with Estate Planning",
subtitle: "A beginner's guide to securing your family's future",
},
};

export default function HomeBookEditPage() {
const router = useRouter();
const [homeBookContent, setHomeBookContent] = useState(initialHomeBookContent);
const [grapesContent, setGrapesContent] = useState({
html: "",
css: "",
state: null,
});
const [activeTab, setActiveTab] = useState("hero");
const [seoStructuredDataError, setSeoStructuredDataError] = useState("");
const [homeBookId, setHomeBookId] = useState(null);
const [isSaving, setIsSaving] = useState(false);
const [saveStatus, setSaveStatus] = useState("");
const [showMediaPicker, setShowMediaPicker] = useState(false);
const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // 'banner' | 'icon' | 'seoOgImage' | 'seoTwitterImage'
const [isLoading, setIsLoading] = useState(false);
const canonicalPreviewUrl = normalizeCanonicalUrl(
homeBookContent.seo?.canonicalUrl || "",
);
const canonicalPreviewSlug = getSlugFromCanonicalUrl(canonicalPreviewUrl);

useEffect(() => {
if (typeof window === "undefined") return;
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
if (id) {
setHomeBookId(id);
loadHomeBook(id);
}
}, []);

const loadHomeBook = async (id) => {
try {
setIsLoading(true);
const response = await homeBooksApi.getById(id);
if (response.success && response.homeBook) {
const homeBook = response.homeBook;

let grapesData = { html: "", css: "", state: null };
let heroData = null;

if (homeBook.content && typeof homeBook.content === "object") {
if (homeBook.content.grapesContent) {
grapesData = homeBook.content.grapesContent;
heroData = homeBook.content.hero;
} else if (homeBook.content.html || homeBook.content.css) {
grapesData = homeBook.content;
}
}

setGrapesContent(grapesData);

const hero = heroData || {
bannerImage: homeBook.image || "",
icon: homeBook.icon || "",
title: homeBook.title || "",
subtitle: homeBook.subtitle || "",
};

const loadedSeo = homeBook.seo || {};
const canonicalFallback = homeBook.slug
? `${HOMEBOOK_CANONICAL_BASE_URL}/${homeBook.slug}`
: `${HOMEBOOK_CANONICAL_BASE_URL}/`;
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

setHomeBookContent({
...initialHomeBookContent,
hero,
seo,
metadata: {
...initialHomeBookContent.metadata,
title: homeBook.title || "",
description: homeBook.description || "",
category: homeBook.category || "Uncategorized",
tags: homeBook.tags || [],
author: homeBook.author || "Anonymous",
readingTime: homeBook.readingTime || "5 min read",
image: homeBook.image || "",
},
});
}
} catch (error) {
console.error("Error loading home book:", error);
alert("Failed to load home book");
} finally {
setIsLoading(false);
}
};

const handleSaveHomeBook = async () => {
setIsSaving(true);
setSaveStatus("");

try {
const title =
homeBookContent.hero?.title ||
homeBookContent.metadata?.title ||
"Untitled Home Book";

const canonicalUrl = normalizeCanonicalUrl(
homeBookContent.seo?.canonicalUrl || "",
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

let parsedStructuredData = null;
const rawSd = homeBookContent.seo?.structuredData || "";
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

const homeBookData = {
title,
subtitle: homeBookContent.hero?.subtitle || "",
description: homeBookContent.metadata?.description || "",
category: homeBookContent.metadata?.category || "Uncategorized",
tags: homeBookContent.metadata?.tags || [],
author: homeBookContent.metadata?.author || "Anonymous",
image:
homeBookContent.hero?.bannerImage ||
homeBookContent.metadata?.image ||
"",
icon: homeBookContent.hero?.icon || "",
readingTime: homeBookContent.metadata?.readingTime || "5 min read",
slug,
seo: {
...homeBookContent.seo,
canonicalUrl,
structuredData: parsedStructuredData,
},
content: {
grapesContent,
hero: homeBookContent.hero,
},
};

let response;
const isNewHomeBook = !homeBookId;
if (homeBookId) {
response = await homeBooksApi.update(homeBookId, homeBookData);
} else {
response = await homeBooksApi.create(homeBookData);
}

if (response.success) {
setSaveStatus("success");
if (isNewHomeBook) {
setTimeout(() => {
router.push("/dashboard/homeBooks");
}, 1000);
} else {
setTimeout(() => setSaveStatus(""), 3000);
}
} else {
setSaveStatus("error");
alert("Failed to save home book");
}
} catch (error) {
console.error("Error saving home book:", error);
setSaveStatus("error");
alert("Failed to save home book: " + error.message);
} finally {
setIsSaving(false);
}
};

const handleUpdateHero = (hero) => {
setHomeBookContent({
...homeBookContent,
hero,
metadata: {
...homeBookContent.metadata,
title: hero.title || homeBookContent.metadata?.title,
image: hero.bannerImage || homeBookContent.metadata?.image,
},
});
};

const handleMediaSelect = (file) => {
if (mediaPickerTarget === "banner") {
handleUpdateHero({
...homeBookContent.hero,
bannerImage: file.url,
});
} else if (mediaPickerTarget === "icon") {
handleUpdateHero({
...homeBookContent.hero,
icon: file.url,
});
} else if (mediaPickerTarget === "seoOgImage") {
setHomeBookContent({
...homeBookContent,
seo: {
...homeBookContent.seo,
ogImage: file.url,
},
});
} else if (mediaPickerTarget === "seoTwitterImage") {
setHomeBookContent({
...homeBookContent,
seo: {
...homeBookContent.seo,
twitterImage: file.url,
},
});
}
setMediaPickerTarget(null);
};

const handleExport = () => {
const dataStr = JSON.stringify(
{ homeBookContent, grapesContent },
null,
2,
);
const blob = new Blob([dataStr], { type: "application/json" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = `homebook-${Date.now()}.json`;
a.click();
URL.revokeObjectURL(url);
};

const handleImport = (e) => {
const file = e.target.files[0];
if (file) {
const reader = new FileReader();
reader.onload = (event) => {
try {
const parsed = JSON.parse(event.target.result);
if (parsed.homeBookContent || parsed.grapesContent) {
if (parsed.homeBookContent) setHomeBookContent(parsed.homeBookContent);
if (parsed.grapesContent) setGrapesContent(parsed.grapesContent);
} else {
setHomeBookContent(parsed);
}
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
<PageLoading
title='Loading editor…'
message='Preparing your home book workspace'
/>
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
href='/dashboard/homeBooks'
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
Home Book Editor
</h1>
<p className='font-montserrat text-xs text-gray-500'>
Create and edit your home book
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
onClick={handleSaveHomeBook}
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
: homeBookId
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
Home Book Hero
</button>
<button
onClick={() => setActiveTab("content")}
className={`px-6 py-3 font-montserrat text-sm font-semibold transition-colors ${
activeTab === "content"
? "border-b-2 border-primary text-primary"
: "text-gray-600 hover:text-gray-900"
}`}>
Home Book Content
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
Home Book Hero Settings
</h2>
<div className='space-y-4'>
<div>
<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
Banner Image
</label>
<div className='flex gap-2'>
<input
type='text'
value={homeBookContent.hero?.bannerImage || ""}
onChange={(e) =>
handleUpdateHero({
...homeBookContent.hero,
bannerImage: e.target.value,
})
}
placeholder='/images/home-book.jpg'
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
{homeBookContent.hero?.bannerImage && (
<div className='mt-2 rounded-lg border border-gray-200 p-2'>
<img
src={homeBookContent.hero.bannerImage}
alt='Banner preview'
className='h-32 w-full rounded object-cover'
/>
</div>
)}
</div>

<div>
<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
Icon URL
</label>
<div className='flex gap-2'>
<input
type='text'
value={homeBookContent.hero?.icon || ""}
onChange={(e) =>
handleUpdateHero({
...homeBookContent.hero,
icon: e.target.value,
})
}
placeholder='/images/icon.png'
className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
<button
type='button'
onClick={() => {
setMediaPickerTarget("icon");
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
<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
Home Book Title
</label>
<input
type='text'
value={homeBookContent.hero?.title || ""}
onChange={(e) =>
handleUpdateHero({
...homeBookContent.hero,
title: e.target.value,
})
}
placeholder='Enter home book title'
className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>

<div>
<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
Subtitle
</label>
<textarea
rows={3}
value={homeBookContent.hero?.subtitle || ""}
onChange={(e) =>
handleUpdateHero({
...homeBookContent.hero,
subtitle: e.target.value,
})
}
placeholder='A short subtitle for your home book'
className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>

<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
<div>
<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
Author
</label>
<input
type='text'
value={homeBookContent.metadata?.author || ""}
onChange={(e) =>
setHomeBookContent({
...homeBookContent,
metadata: {
...homeBookContent.metadata,
author: e.target.value,
},
})
}
placeholder='Author name'
className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>
<div>
<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
Category
</label>
<input
type='text'
value={homeBookContent.metadata?.category || ""}
onChange={(e) =>
setHomeBookContent({
...homeBookContent,
metadata: {
...homeBookContent.metadata,
category: e.target.value,
},
})
}
placeholder='Estate Planning'
className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>
<div>
<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
Reading Time
</label>
<input
type='text'
value={homeBookContent.metadata?.readingTime || ""}
onChange={(e) =>
setHomeBookContent({
...homeBookContent,
metadata: {
...homeBookContent.metadata,
readingTime: e.target.value,
},
})
}
placeholder='10 min read'
className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>
</div>
</div>

<div className='mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6'>
<h3 className='font-anton mb-4 text-lg text-gray-900'>Preview</h3>
<BooksHero
bannerImage={homeBookContent.hero?.bannerImage}
title={homeBookContent.hero?.title}
subtitle={homeBookContent.hero?.subtitle}
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
<p className='font-montserrat mb-6 text-sm text-gray-500'>
Control how this home book appears in search engines and social media.
</p>

<h3 className='font-montserrat mb-3 text-xs font-bold uppercase tracking-widest text-gray-400'>Search Engine</h3>
<div className='mb-8 space-y-4'>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Meta Title <span className='font-normal text-gray-400'>(leave blank to use title)</span></label>
<input
type='text'
value={homeBookContent.seo?.metaTitle || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, metaTitle: e.target.value } })}
placeholder={homeBookContent.hero?.title || "Home book title"}
maxLength={60}
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
<p className='mt-1 text-right font-montserrat text-xs text-gray-400'>{(homeBookContent.seo?.metaTitle || "").length}/60</p>
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Meta Description <span className='font-normal text-gray-400'>(leave blank to use description)</span></label>
<textarea
rows={3}
value={homeBookContent.seo?.metaDescription || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, metaDescription: e.target.value } })}
placeholder={homeBookContent.metadata?.description || "Short description for search snippets"}
maxLength={160}
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
<p className='mt-1 text-right font-montserrat text-xs text-gray-400'>{(homeBookContent.seo?.metaDescription || "").length}/160</p>
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Keywords <span className='font-normal text-gray-400'>(comma-separated)</span></label>
<input
type='text'
value={homeBookContent.seo?.keywords || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, keywords: e.target.value } })}
placeholder='estate planning, probate, legal guide'
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Canonical URL</label>
<input
type='url'
value={homeBookContent.seo?.canonicalUrl || ""}
onChange={(e) =>
setHomeBookContent({
...homeBookContent,
seo: {
...homeBookContent.seo,
canonicalUrl: e.target.value,
},
})
}
placeholder='https://833probaid.com/homebooks/your-homebook-slug'
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
<p className='mt-1 font-montserrat text-xs text-gray-400'>Slug is taken from the last part of this URL.</p>
<div className='mt-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2'>
<p className='font-montserrat text-xs text-gray-500'>
Detected slug: <span className='font-mono text-gray-700'>{canonicalPreviewSlug || "(empty)"}</span>
</p>
<p className='mt-1 break-all font-mono text-xs text-gray-500'>
{canonicalPreviewUrl}
</p>
</div>
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Robots</label>
<select
value={homeBookContent.seo?.robots || "index, follow"}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, robots: e.target.value } })}
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'>
<option value='index, follow'>index, follow (default)</option>
<option value='noindex, follow'>noindex, follow</option>
<option value='index, nofollow'>index, nofollow</option>
<option value='noindex, nofollow'>noindex, nofollow</option>
</select>
</div>
</div>

<h3 className='font-montserrat mb-3 text-xs font-bold uppercase tracking-widest text-gray-400'>Open Graph (Facebook / LinkedIn)</h3>
<div className='mb-8 space-y-4'>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>OG Title <span className='font-normal text-gray-400'>(leave blank to use meta title)</span></label>
<input
type='text'
value={homeBookContent.seo?.ogTitle || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, ogTitle: e.target.value } })}
placeholder={homeBookContent.seo?.metaTitle || homeBookContent.hero?.title || ""}
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>OG Description</label>
<textarea
rows={3}
value={homeBookContent.seo?.ogDescription || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, ogDescription: e.target.value } })}
placeholder={homeBookContent.seo?.metaDescription || homeBookContent.metadata?.description || ""}
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>OG Image URL <span className='font-normal text-gray-400'>(leave blank to use banner)</span></label>
<div className='flex gap-2'>
<input
type='text'
value={homeBookContent.seo?.ogImage || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, ogImage: e.target.value } })}
placeholder={homeBookContent.hero?.bannerImage || "/images/og-default.jpg"}
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
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>OG Image Alt</label>
<input
type='text'
value={homeBookContent.seo?.ogImageAlt || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, ogImageAlt: e.target.value } })}
placeholder='Descriptive alt text for social preview image'
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>OG Type</label>
<select
value={homeBookContent.seo?.ogType || "article"}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, ogType: e.target.value } })}
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'>
<option value='article'>article</option>
<option value='website'>website</option>
</select>
</div>
</div>

<h3 className='font-montserrat mb-3 text-xs font-bold uppercase tracking-widest text-gray-400'>Twitter / X Card</h3>
<div className='mb-8 space-y-4'>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Twitter Card Type</label>
<select
value={homeBookContent.seo?.twitterCard || "summary_large_image"}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, twitterCard: e.target.value } })}
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'>
<option value='summary_large_image'>summary_large_image</option>
<option value='summary'>summary</option>
</select>
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Twitter Site Handle <span className='font-normal text-gray-400'>(e.g. @833probaid)</span></label>
<input
type='text'
value={homeBookContent.seo?.twitterSite || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, twitterSite: e.target.value } })}
placeholder='@833probaid'
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Twitter Creator Handle</label>
<input
type='text'
value={homeBookContent.seo?.twitterCreator || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, twitterCreator: e.target.value } })}
placeholder='@authorhandle'
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Twitter Title (optional override)</label>
<input
type='text'
value={homeBookContent.seo?.twitterTitle || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, twitterTitle: e.target.value } })}
placeholder={homeBookContent.seo?.ogTitle || homeBookContent.seo?.metaTitle || homeBookContent.hero?.title || ""}
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Twitter Description (optional override)</label>
<textarea
rows={3}
value={homeBookContent.seo?.twitterDescription || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, twitterDescription: e.target.value } })}
placeholder={homeBookContent.seo?.ogDescription || homeBookContent.seo?.metaDescription || homeBookContent.metadata?.description || ""}
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>
<div>
<label className='font-montserrat mb-1 block text-sm font-semibold text-gray-700'>Twitter Image URL (optional override)</label>
<div className='flex gap-2'>
<input
type='text'
value={homeBookContent.seo?.twitterImage || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, twitterImage: e.target.value } })}
placeholder={homeBookContent.seo?.ogImage || homeBookContent.hero?.bannerImage || ""}
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
value={homeBookContent.seo?.googleBot || ""}
onChange={(e) => setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, googleBot: e.target.value } })}
placeholder='max-image-preview:large, max-snippet:-1, max-video-preview:-1'
className='w-full rounded-lg border border-gray-300 px-4 py-2 font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
/>
</div>
</div>

<h3 className='font-montserrat mb-3 text-xs font-bold uppercase tracking-widest text-gray-400'>Structured Data (JSON-LD / Schema.org)</h3>
<div className='space-y-2'>
<p className='font-montserrat text-xs text-gray-500'>
Paste valid JSON-LD. Leave blank to skip. Common types: Article, FAQPage, HowTo, BreadcrumbList.
</p>
<textarea
rows={12}
spellCheck={false}
value={homeBookContent.seo?.structuredData || ""}
onChange={(e) => {
const val = e.target.value;
setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, structuredData: val } });
if (val.trim() === "") {
setSeoStructuredDataError("");
return;
}
try {
JSON.parse(val);
setSeoStructuredDataError("");
} catch (err) {
setSeoStructuredDataError(err.message);
}
}}
className={`w-full rounded-lg border px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
seoStructuredDataError
? "border-red-400 bg-red-50"
: "border-gray-300"
}`}
/>
{seoStructuredDataError && (
<p className='font-montserrat text-xs text-red-500'>
JSON error: {seoStructuredDataError}
</p>
)}
<div className='flex gap-2'>
<button
type='button'
onClick={() => {
const title = homeBookContent.hero?.title || homeBookContent.metadata?.title || "";
const desc = homeBookContent.seo?.metaDescription || homeBookContent.metadata?.description || "";
const author = homeBookContent.metadata?.author || "";
const canonical = homeBookContent.seo?.canonicalUrl || "";
const image = homeBookContent.seo?.ogImage || homeBookContent.hero?.bannerImage || "";
const template = {
"@context": "https://schema.org",
"@type": "Article",
headline: title,
description: desc,
author: { "@type": "Person", name: author },
publisher: {
"@type": "Organization",
name: "833PROBAID",
logo: {
"@type": "ImageObject",
url: "https://833probaid.com/images/logo.png",
},
},
image,
mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
};
setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, structuredData: JSON.stringify(template, null, 2) } });
setSeoStructuredDataError("");
}}
className='rounded-lg border border-gray-300 px-3 py-1.5 font-montserrat text-xs font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary'>
Auto-fill Article template
</button>
<button
type='button'
onClick={() => {
setHomeBookContent({ ...homeBookContent, seo: { ...homeBookContent.seo, structuredData: "" } });
setSeoStructuredDataError("");
}}
className='rounded-lg border border-gray-300 px-3 py-1.5 font-montserrat text-xs font-semibold text-gray-500 transition-colors hover:border-red-400 hover:text-red-500'>
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
mediaPickerTarget === "icon" ||
mediaPickerTarget === "seoOgImage" ||
mediaPickerTarget === "seoTwitterImage"
? ["image"]
: []
}
/>
</>
);
}
