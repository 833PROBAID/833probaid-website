import BlogsPageClient from "./BlogsPageClient";
import { getPublishedBlogsFirstPage } from "@/app/services/blogService";

export const revalidate = 300;

export default async function BlogsPage() {
  let initialBlogs = [];
  let initialPagination = {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
    hasMore: false,
  };

  try {
    const result = await getPublishedBlogsFirstPage();
    initialBlogs = result?.blogs || [];
    initialPagination = result?.pagination || initialPagination;
  } catch (error) {
    console.error("Failed to load initial blogs:", error);
  }

  return (
    <BlogsPageClient
      initialBlogs={initialBlogs}
      initialPagination={initialPagination}
    />
  );
}
