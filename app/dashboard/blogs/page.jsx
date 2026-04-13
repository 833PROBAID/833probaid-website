"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import blogsApi from "../../lib/api/blogs";
import { SectionLoading } from "../../../components/LoadingState";

export default function BlogsPage() {
	const [blogs, setBlogs] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState(null);
	const [loading, setLoading] = useState(true);
	const blogsPerPage = 6;

	useEffect(() => {
		fetchBlogs();
	}, [searchQuery, currentPage]);

	const fetchBlogs = async () => {
		try {
			setLoading(true);
			const data = await blogsApi.getAll({ 
				search: searchQuery, 
				page: currentPage, 
				limit: blogsPerPage 
			});
			if (data.success) {
				setBlogs(data.blogs || []);
				setPagination(data.pagination);
			}
		} catch (error) {
			console.error("Error fetching blogs:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this blog?")) return;

		try {
			await blogsApi.delete(id);
			fetchBlogs(); // Refetch to update the list
		} catch (error) {
			console.error("Error deleting blog:", error);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setSearchQuery(searchInput);
		setCurrentPage(1);
	};

	const currentBlogs = blogs;
	const totalPages = pagination?.totalPages || 1;

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div>
			<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
				<div>
					<h1 className='font-anton text-4xl text-gray-900'>Blogs</h1>
					<p className='font-montserrat mt-2 text-gray-600'>
						Manage your blog posts
					</p>
				</div>
				<Link
					href='/dashboard/blogs/edit'
					className='rounded-lg bg-primary px-6 py-3 font-montserrat font-semibold text-white transition-colors hover:bg-primary/90'>
					Create New Blog
				</Link>
			</div>

			<div className='mb-6'>
				<form onSubmit={handleSearch} className='relative'>
					<input
						type='text'
						placeholder='Search blogs by title, category, or tags...'
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className='w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
					/>
					<button type='submit' className='sr-only'>Search</button>
					<svg
						className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
						/>
					</svg>
				</form>
			</div>

			<div className='mb-4 font-montserrat text-sm text-gray-600'>
				Showing {pagination ? Math.min(currentBlogs.length, pagination.total) : currentBlogs.length} of {pagination?.total || 0} blogs
			</div>

			{loading ? (
				<div className='min-h-64'>
					<SectionLoading title='Loading blogs…' message='Fetching your content' />
				</div>
			) : currentBlogs.length === 0 ? (
				<div className='rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm'>
					<svg
						className='mx-auto mb-4 h-16 w-16 text-gray-400'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
						/>
					</svg>
					<p className='font-montserrat text-lg text-gray-600'>
						{searchQuery
							? "No blogs found matching your search"
							: "No blogs yet"}
					</p>
					{!searchQuery && (
						<Link
							href='/dashboard/blogs/edit'
							className='mt-4 inline-block rounded-lg bg-primary px-6 py-2 font-montserrat font-semibold text-white transition-colors hover:bg-primary/90'>
							Create Your First Blog
						</Link>
					)}
				</div>
			) : (
				<>
					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
						{currentBlogs.map((blog) => (
							<div
								key={blog.id}
								className='group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md'>
								{blog.image && (
									<div className='aspect-video overflow-hidden bg-gray-100'>
										<img
											src={blog.image}
											alt={blog.title}
											className='h-full w-full object-cover transition-transform group-hover:scale-105'
										/>
									</div>
								)}

								<div className='p-5'>
									<div className='mb-3 flex items-center justify-between gap-2 text-xs'>
										<div className='flex items-center gap-2'>
											{blog.type && (
												<span className={`rounded-full px-2 py-1 font-montserrat font-semibold ${
													blog.type === 'watch' 
														? 'bg-red-100 text-red-700'
														: 'bg-blue-100 text-blue-700'
												}`}>
													{blog.type === 'watch' ? 'Watch' : 'Read'}
												</span>
											)}
											{blog.category && (
												<span className='rounded-full bg-primary/10 px-3 py-1 font-montserrat font-semibold text-primary'>
													{blog.category}
												</span>
											)}
										</div>
										{blog.publishedDate && (
											<span className='font-montserrat text-gray-500'>
												{new Date(blog.publishedDate).toLocaleDateString()}
											</span>
										)}
									</div>

									<h3 className='font-anton mb-2 line-clamp-2 text-xl text-gray-900'>
										{blog.title || "Untitled Blog"}
									</h3>

									<p className='font-montserrat mb-4 line-clamp-2 text-sm text-gray-600'>
										{blog.description || "No description"}
									</p>

									{blog.tags && blog.tags.length > 0 && (
										<div className='mb-4 flex flex-wrap gap-2'>
											{blog.tags.slice(0, 3).map((tag, idx) => (
												<span
													key={idx}
													className='rounded-md bg-gray-100 px-2 py-1 font-montserrat text-xs text-gray-600'>
													{tag}
												</span>
											))}
										</div>
									)}

									<div className='flex items-center gap-2'>
										<Link
											href={`/blogs/${blog.slug || blog.id}`}
											className='flex-1 rounded-lg border border-gray-200 px-4 py-2 text-center font-montserrat text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary'>
											View
										</Link>
										<Link
											href={`/dashboard/blogs/edit?id=${blog.id}`}
											className='flex-1 rounded-lg bg-primary px-4 py-2 text-center font-montserrat text-sm font-semibold text-white transition-colors hover:bg-primary/90'>
											Edit
										</Link>
										<button
											onClick={() => handleDelete(blog.id)}
											className='rounded-lg border border-red-200 px-3 py-2 text-red-600 transition-colors hover:bg-red-50'>
											<svg
												className='h-5 w-5'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{totalPages > 1 && (
						<div className='mt-8 flex items-center justify-center gap-2'>
							<button
								onClick={() => paginate(currentPage - 1)}
								disabled={currentPage === 1}
								className='rounded-lg border border-gray-200 px-4 py-2 font-montserrat font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'>
								Previous
							</button>

							{Array.from({ length: totalPages }, (_, i) => i + 1).map(
								(number) => {
									if (
										number === 1 ||
										number === totalPages ||
										(number >= currentPage - 1 && number <= currentPage + 1)
									) {
										return (
											<button
												key={number}
												onClick={() => paginate(number)}
												className={`rounded-lg px-4 py-2 font-montserrat font-semibold transition-colors ${
													currentPage === number
														? "bg-primary text-white"
														: "border border-gray-200 text-gray-700 hover:bg-gray-50"
												}`}>
												{number}
											</button>
										);
									} else if (
										number === currentPage - 2 ||
										number === currentPage + 2
									) {
										return (
											<span key={number} className='px-2 text-gray-400'>
												...
											</span>
										);
									}
									return null;
								},
							)}

							<button
								onClick={() => paginate(currentPage + 1)}
								disabled={currentPage === totalPages}
								className='rounded-lg border border-gray-200 px-4 py-2 font-montserrat font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'>
								Next
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
