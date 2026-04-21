/* eslint-disable @next/next/no-img-element */

"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import BlogCard from "../../components/BlogCard";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import blogsApi from "../lib/api/blogs";
import { SectionLoading } from "../../components/LoadingState";
import AnimatedText from "../../components/AnimatedText";
import Image from "next/image";

const BlogsPageClient = ({ initialBlogs = [], initialPagination = {} }) => {
  const hasSSRInitialData =
    Array.isArray(initialBlogs) && initialBlogs.length > 0;
  const initialPage = initialPagination?.page || 1;
  const didSkipInitialFetch = useRef(false);
  const responseCacheRef = useRef(new Map());

  const [blogs, setBlogs] = useState(
    Array.isArray(initialBlogs) ? initialBlogs : [],
  );
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPagination?.hasMore || false);
  const [hasPrev, setHasPrev] = useState(initialPage > 1);
  const [totalPages, setTotalPages] = useState(
    initialPagination?.totalPages || 1,
  );
  const [error, setError] = useState(null);
  const [videoPopup, setVideoPopup] = useState({
    isOpen: false,
    videoLink: "",
  });

  const getCacheKey = (searchQuery, pageNum) =>
    `${searchQuery.trim().toLowerCase()}::${pageNum}`;

  const applyBlogsPayload = (payload, pageNum) => {
    setBlogs(payload.blogs);
    setHasMore(payload.pagination.hasMore);
    setHasPrev(pageNum > 1);
    setTotalPages(payload.pagination.totalPages);
  };

  useEffect(() => {
    if (!hasSSRInitialData) {
      return;
    }

    const cacheKey = getCacheKey("", initialPage);
    responseCacheRef.current.set(cacheKey, {
      blogs: Array.isArray(initialBlogs) ? initialBlogs : [],
      pagination: {
        hasMore: initialPagination?.hasMore || false,
        totalPages: initialPagination?.totalPages || 1,
      },
    });
  }, [hasSSRInitialData, initialBlogs, initialPage, initialPagination]);

  // Lock / unlock body scroll when modal is open
  useEffect(() => {
    if (videoPopup.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [videoPopup.isOpen]);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    );
    if (ytMatch)
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch)
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    return null;
  };

  // Fetch blogs
  const fetchBlogs = async (searchQuery = "", pageNum = 1) => {
    const cacheKey = getCacheKey(searchQuery, pageNum);
    const cached = responseCacheRef.current.get(cacheKey);

    if (cached) {
      setError(null);
      applyBlogsPayload(cached, pageNum);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await blogsApi.getAll({
        search: searchQuery,
        page: pageNum,
        limit: 5,
      });

      if (result.success) {
        const newBlogs = result.blogs || [];
        const payload = {
          blogs: newBlogs,
          pagination: {
            hasMore: result.pagination?.hasMore || false,
            totalPages: result.pagination?.totalPages || 1,
          },
        };

        responseCacheRef.current.set(cacheKey, payload);
        applyBlogsPayload(payload, pageNum);
      } else {
        setError(result.error || "Failed to fetch blogs");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load & page change
  useEffect(() => {
    if (
      hasSSRInitialData &&
      !didSkipInitialFetch.current &&
      search === "" &&
      page === initialPage
    ) {
      didSkipInitialFetch.current = true;
      return;
    }

    didSkipInitialFetch.current = true;
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchBlogs(search, page);
  }, [hasSSRInitialData, initialPage, search, page]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setBlogs([]);
    setPage(initialPage);
    setSearch(searchInput);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleNextPage = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrev && !loading) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <section className="font-montserrat">
      <style>{`
				@keyframes floatAnimation {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-8px); }
				}
				.search-btn-float {
					animation: floatAnimation 2.5s ease-in-out infinite;
					will-change: transform;
				}
				.search-btn-float:hover {
					animation-play-state: paused;
					transform: translateY(-4px);
				}
			`}</style>
      <Navbar />
      <section className="mx-auto mt-9 max-w-7xl px-4 md:px-0">
        <h1 className="font-anton text-center text-2xl md:text-3xl lg:text-4xl xl:text-6xl flex flex-wrap justify-center items-center gap-1 sm:gap-3">
          <AnimatedText text="Latest" as="div" animate={true} />
          <AnimatedText
            text="Blogs"
            className="text-secondary"
            as="div"
            animate={true}
          />
          <AnimatedText text="& Resources" as="div" animate={true} />
        </h1>
        <p className="mt-3 font-montserrat text-center font-medium text-[16px] md:text-xl lg:text-2xl">
          Explore our collection of expert Blogs and guides to help you navigate
          the probate
          <br className="hidden md:block" />
          process with confidence.
        </p>
        <form
          onSubmit={handleSearch}
          className="mx-auto my-4 flex max-w-5xl items-center rounded-full bg-white ps-4 pe-1 py-1 shadow-[10px_12px_30px_rgba(0,0,0,0.28)] sm:my-12 sm:ps-6 sm:pe-2 sm:pt-2 sm:pb-1 search-btn-float"
        >
          <svg
            viewBox="0 0 70 70"
            className="w-6 shrink-0 sm:w-10 md:w-11 lg:w-12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M46.0702 46.1157L61.25 61.25M52.5 30.625C52.5 42.7061 42.7061 52.5 30.625 52.5C18.5438 52.5 8.75 42.7061 8.75 30.625C8.75 18.5438 18.5438 8.75 30.625 8.75C42.7061 8.75 52.5 18.5438 52.5 30.625Z"
              stroke="#0097A7"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            className="ms-1 w-full rounded-full px-2 py-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none sm:ms-4 sm:px-4 sm:py-2 sm:text-base md:text-lg lg:text-xl"
            placeholder="Search Articles...."
          />
          <button type="submit" className="ml-1 cursor-pointer sm:ml-4">
            <Image
              src="/search.svg"
              alt="Search"
              className="w-auto h-auto transition-transform duration-300 hover:scale-110"
              width={100}
              height={100}
            />
          </button>
        </form>

        {error && (
          <div className="mx-auto mb-6 max-w-2xl rounded-lg bg-red-50 p-4 text-center text-red-600">
            {error}
          </div>
        )}

        {loading && blogs.length === 0 && (
          <div className="min-h-100">
            <SectionLoading
              title="Loading blogs…"
              message="Fetching the latest posts"
              size="lg"
            />
          </div>
        )}

        {/* Full page loading overlay when paginating */}
        {loading && blogs.length > 0 && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(255,255,255,0.85)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SectionLoading title="Loading…" size="lg" />
          </div>
        )}

        {blogs.length === 0 && !loading && (
          <div className="mx-auto my-12 max-w-2xl text-center">
            <p className="text-lg text-gray-500">
              {search ? `No blogs found for "${search}"` : "No blogs available"}
            </p>
          </div>
        )}

        <div className="mx-auto mt-8 grid grid-cols-2 gap-4 sm:gap-10 md:gap-16 lg:gap-20 xl:gap-24">
          {blogs.map((blog, index) => {
            const blogKey = blog._id || blog.id || blog.slug || "blog";
            const commonCardProps = {
              bannerImage:
                blog.content?.hero?.bannerImage || "/images/hero.png",
              title: blog.title || "Untitled",
              authorName:
                blog.content?.hero?.authorName || blog.author || "Anonymous",
              authorAvatar:
                blog.content?.hero?.authorAvatar || "/images/hero.png",
            };
            return (
              <Fragment key={blog._id || blog.id}>
                {/* Left card — always opens the blog page */}
                <BlogCard
                  uid={`${blogKey}-card-read`}
                  alignIndex={index * 2 + 1}
                  {...commonCardProps}
                  slug={blog.slug || ""}
                  type="read"
                />
                {/* Right card — always opens the video modal */}
                <BlogCard
                  uid={`${blogKey}-card-video`}
                  alignIndex={index * 2 + 2}
                  {...commonCardProps}
                  slug=""
                  type="watch"
                  onVideoClick={() =>
                    setVideoPopup({
                      isOpen: true,
                      videoLink: blog.videoLink || "",
                    })
                  }
                />
              </Fragment>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {blogs.length > 0 && (
          <section
            className="font-roboto container mx-auto mt-8 flex max-w-7xl items-center justify-between text-xl font-black md:mt-12 md:text-2xl lg:text-3xl xl:text-4xl"
            style={{
              overflow: "visible",
            }}
          >
            <button
              onClick={handlePrevPage}
              disabled={!hasPrev || loading}
              className={`flex items-center gap-2 transition-all duration-300 ${
                !hasPrev || loading
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer hover:opacity-80 hover:scale-105"
              }`}
            >
              <img
                className="w-8 lg:w-12"
                src="/images/arrow_prev.png"
                alt="Previous"
              />
              <span
                className={`${!hasPrev || loading ? "text-gray-400" : "text-secondary hover:text-primary"}`}
              >
                Previous
              </span>
            </button>
            <div className="flex items-center gap-1 sm:gap-2">
              {(() => {
                const delta = 1;
                const pages = [];
                const left = Math.max(2, page - delta);
                const right = Math.min(totalPages - 1, page + delta);

                pages.push(1);
                if (left > 2) pages.push("...");
                for (let i = left; i <= right; i++) pages.push(i);
                if (right < totalPages - 1) pages.push("...");
                if (totalPages > 1) pages.push(totalPages);

                return pages.map((item, idx) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center text-gray-400 text-sm sm:text-base font-black select-none"
                    >
                      &hellip;
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => {
                        if (!loading) setPage(item);
                      }}
                      disabled={loading}
                      className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full text-sm sm:text-base lg:text-lg font-black transition-all duration-300 ${
                        item === page
                          ? "bg-secondary text-white scale-110 shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-secondary/20 hover:text-secondary hover:scale-125 hover:-translate-y-1 hover:shadow-md cursor-pointer"
                      } ${loading ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      {item}
                    </button>
                  ),
                );
              })()}
            </div>
            <button
              onClick={handleNextPage}
              disabled={!hasMore || loading}
              className={`flex items-center gap-2 transition-all duration-300 ${
                !hasMore || loading
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer hover:opacity-80 hover:scale-105"
              }`}
            >
              <span
                className={`${!hasMore || loading ? "text-gray-400" : "text-secondary hover:text-primary"}`}
              >
                Next
              </span>
              <img className="w-8 lg:w-12" src="/images/arrow.png" alt="Next" />
            </button>
          </section>
        )}

        {/* Removed bottom loading spinner for pagination, now handled by full-page overlay above */}
      </section>
      <Footer />

      {/* Video Popup — rendered via portal to escape stacking context */}
      {videoPopup.isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setVideoPopup({ isOpen: false, videoLink: "" })}
          >
            <div
              style={{
                background: "black",
                borderRadius: "1rem",
                padding: "3rem 1rem 1rem 1rem",
                width: "90vw",
                height: "90vh",
                textAlign: "center",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setVideoPopup({ isOpen: false, videoLink: "" })}
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "50%",
                  background: "#FE7702",
                  border: "none",
                  color: "#fff",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
              {!videoPopup.videoLink ? (
                /* No video */
                <div style={{ marginTop: "2rem" }}>
                  <p
                    style={{
                      color: "#fff",
                      fontSize: "1.25rem",
                      fontWeight: 600,
                    }}
                  >
                    No Video Found
                  </p>
                  <p
                    style={{
                      color: "#aaa",
                      marginTop: "0.5rem",
                      fontSize: "0.95rem",
                    }}
                  >
                    No video has been linked to this post yet.
                  </p>
                </div>
              ) : (
                /* Video player — fills the card */
                <div
                  style={{
                    width: "100%",
                    height: "calc(100% - 1rem)",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                  }}
                >
                  {getEmbedUrl(videoPopup.videoLink) ? (
                    <iframe
                      src={getEmbedUrl(videoPopup.videoLink)}
                      style={{ width: "100%", height: "100%", border: "none" }}
                      allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={videoPopup.videoLink}
                      style={{ width: "100%", height: "100%" }}
                      controls
                      autoPlay
                    />
                  )}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
};

export default BlogsPageClient;
