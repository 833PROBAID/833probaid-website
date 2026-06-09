/* eslint-disable react/no-danger */

import { cache } from "react";
import BooksHero from "@/components/BooksHero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getHomeBookBySlugCached,
  getHomeBookById,
  getAdjacentPublishedHomeBooksByNo,
  incrementHomeBookViews,
  getPublishedHomeBookSlugs,
} from "@/app/services/homeBookService";
import HomeBookContentClient from "./HomeBookContentClient";
import { scopeCSS } from "@/app/utils/scopeCSS";

/**
 * Deduplicate the DB/cache lookup across generateMetadata and the page
 * component so both share a single result per request (React request cache).
 */
const fetchHomeBook = cache(async (slug) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
  return isObjectId ? getHomeBookById(slug) : getHomeBookBySlugCached(slug);
});

export async function generateStaticParams() {
  const slugs = await getPublishedHomeBookSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const homeBook = await fetchHomeBook(slug);

  if (!homeBook || homeBook.status !== "published") {
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

  if (!homeBook || homeBook.status !== "published") notFound();

  const currentSerial = Number(homeBook.no);
  const { previous: previousHomeBook, next: nextHomeBook } = Number.isFinite(
    currentSerial
  )
    ? await getAdjacentPublishedHomeBooksByNo(currentSerial)
    : { previous: null, next: null };

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

  let structuredDataScript = null;
  if (homeBook.seo?.structuredData) {
    try {
      const raw = homeBook.seo.structuredData;
      structuredDataScript =
        typeof raw === "string"
          ? JSON.stringify(JSON.parse(raw))
          : JSON.stringify(raw);
    } catch {
      // malformed structured data — skip JSON-LD injection
    }
  }

  return (
    <section className="font-montserrat">
      {structuredDataScript && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataScript }}
        />
      )}
      <Navbar />
      <section className="mx-auto mt-5 max-w-7xl px-4 md:px-0">
        <BooksHero
          bannerImage={heroData.bannerImage}
          title={heroData.title}
          subtitle={heroData.subtitle}
        />

        {grapesContent?.html ? (
          <div className="mt-8">
            <style
              dangerouslySetInnerHTML={{
                __html: scopeCSS(grapesContent.css || "", ".homebook-content"),
              }}
            />
            <div
              className="homebook-content"
              style={{
                contain: "layout style",
                isolation: "isolate",
                position: "relative",
                zIndex: 1,
              }}
              dangerouslySetInnerHTML={{ __html: grapesContent.html }}
            />
            <HomeBookContentClient />
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">
            <p>No content available for this home book.</p>
          </div>
        )}

        <section className="font-roboto container mx-auto mt-2 flex max-w-7xl items-center justify-between px-4 text-xl font-black md:mt-4 md:text-2xl lg:mt-8 lg:text-3xl xl:mt-12 xl:text-4xl">
          {previousHomeBook?.slug ? (
            <Link
              href={`/homebooks/${previousHomeBook.slug}`}
              className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
              title={previousHomeBook.title || previousHomeBook.slug}
              aria-label={`Previous home book: ${previousHomeBook.title || previousHomeBook.slug}`}
            >
              <Image
                className="w-8 lg:w-12"
                src="/images/arrow_prev.png"
                alt="Previous home book"
                width={48}
                height={48}
              />
              <span className="text-secondary hover:text-primary">
                Previous
              </span>
            </Link>
          ) : (
            <span
              className="flex cursor-not-allowed items-center gap-2 opacity-40"
              aria-disabled="true"
            >
              <Image
                className="w-8 lg:w-12"
                src="/images/arrow_prev.png"
                alt="No previous home book"
                width={48}
                height={48}
              />
              <span className="text-secondary">Previous</span>
            </span>
          )}

          {nextHomeBook?.slug ? (
            <Link
              href={`/homebooks/${nextHomeBook.slug}`}
              className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
              title={nextHomeBook.title || nextHomeBook.slug}
              aria-label={`Next home book: ${nextHomeBook.title || nextHomeBook.slug}`}
            >
              <span className="text-secondary hover:text-primary">Next</span>
              <Image
                className="w-8 lg:w-12"
                src="/images/arrow.png"
                alt="Next home book"
                width={48}
                height={48}
              />
            </Link>
          ) : (
            <span
              className="flex cursor-not-allowed items-center gap-2 opacity-40"
              aria-disabled="true"
            >
              <span className="text-secondary">Next</span>
              <Image
                className="w-8 lg:w-12"
                src="/images/arrow.png"
                alt="No next home book"
                width={48}
                height={48}
              />
            </span>
          )}
        </section>
      </section>
      <Footer />
    </section>
  );
}
