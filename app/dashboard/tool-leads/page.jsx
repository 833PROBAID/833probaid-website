"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import toolLeadsApi from "../../lib/api/toolLeads";
import { SectionLoading } from "../../../components/LoadingState";

const SOURCE_OPTIONS = [
	{ value: "", label: "All Sources" },
	{ value: "website", label: "Website" },
	{ value: "newsletter", label: "Newsletter" },
];

function formatToolPage(value) {
	const text = String(value || "").trim();
	if (!text) return "-";

	return text
		.split("/")
		.filter(Boolean)
		.pop()
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

export default function ToolLeadsPage() {
	const [toolLeads, setToolLeads] = useState([]);
	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [sourceType, setSourceType] = useState("");
	const [toolPage, setToolPage] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState(null);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(null);

	const fetchToolLeads = useCallback(async () => {
		try {
			setLoading(true);
			const data = await toolLeadsApi.getAll({
				search: searchQuery,
				sourceType,
				toolPage,
				page: currentPage,
				limit: 20,
			});

			if (data.success) {
				setToolLeads(data.toolLeads || []);
				setPagination(data.pagination);
			}
		} catch (error) {
			console.error("Error fetching tool leads:", error);
		} finally {
			setLoading(false);
		}
	}, [searchQuery, sourceType, toolPage, currentPage]);

	useEffect(() => {
		fetchToolLeads();
	}, [fetchToolLeads]);

	const handleDelete = async (id) => {
		if (!confirm("Delete this lead submission?")) return;

		setDeleting(id);
		try {
			await toolLeadsApi.delete(id);
			fetchToolLeads();
		} catch (error) {
			console.error("Error deleting tool lead:", error);
			alert("Failed to delete lead submission.");
		} finally {
			setDeleting(null);
		}
	};

	const handleSearch = (event) => {
		event.preventDefault();
		setSearchQuery(searchInput);
		setCurrentPage(1);
	};

	const totalPages = pagination?.totalPages || 1;

	return (
		<div>
			<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
				<div>
					<h1 className='font-anton text-4xl text-gray-900'>Tool Leads</h1>
					<p className='font-montserrat mt-2 text-gray-600'>
						{pagination
							? `${pagination.total} submission${pagination.total !== 1 ? "s" : ""}`
							: "Loading..."}
					</p>
				</div>
			</div>

			<div className='mb-6 space-y-3'>
				<form onSubmit={handleSearch} className='relative'>
					<input
						type='text'
						placeholder='Search by name, email, phone, company, tool page...'
						value={searchInput}
						onChange={(event) => setSearchInput(event.target.value)}
						className='w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
					/>
					<button type='submit' className='sr-only'>
						Search
					</button>
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

				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
					<select
						value={sourceType}
						onChange={(event) => {
							setSourceType(event.target.value);
							setCurrentPage(1);
						}}
						className='rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'>
						{SOURCE_OPTIONS.map((option) => (
							<option key={option.value || "all"} value={option.value}>
								{option.label}
							</option>
						))}
					</select>

					<input
						type='text'
						value={toolPage}
						onChange={(event) => {
							setToolPage(event.target.value);
							setCurrentPage(1);
						}}
						placeholder='Filter by tool slug (optional)'
						className='rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
					/>
				</div>
			</div>

			{loading ? (
				<SectionLoading />
			) : toolLeads.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-20 text-gray-400'>
					<svg
						className='mb-4 h-16 w-16'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1.5}
							d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-5 9h.01M12 15h.01M15 15h.01'
						/>
					</svg>
					<p className='text-xl font-montserrat'>No tool leads found</p>
				</div>
			) : (
				<div className='overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm'>
					<table className='w-full text-sm'>
						<thead className='bg-primary/10 text-left'>
							<tr>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>
									Submitted
								</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>
									Lead
								</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>
									Tool
								</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>
									Source
								</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>
									Company / Role
								</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-100'>
							{toolLeads.map((lead) => (
								<tr key={lead.id} className='transition-colors hover:bg-gray-50'>
									<td className='whitespace-nowrap px-4 py-3 text-gray-500'>
										{new Date(
											lead.submittedAt || lead.createdAt,
										).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</td>
									<td className='px-4 py-3'>
										<div className='font-semibold text-gray-900'>
											{lead.fullName || "-"}
										</div>
										<div className='text-xs text-gray-500'>
											{lead.email || "-"}
										</div>
										<div className='text-xs text-gray-400'>
											{lead.phone || "-"}
										</div>
									</td>
									<td className='max-w-52 px-4 py-3 text-gray-700'>
										<div className='font-medium'>{formatToolPage(lead.toolPage)}</div>
										<div className='truncate text-xs text-gray-400'>
											{lead.toolPage || "-"}
										</div>
									</td>
									<td className='px-4 py-3'>
										<span
											className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
												lead.sourceType === "newsletter"
													? "bg-secondary/15 text-secondary"
													: "bg-primary/10 text-primary"
											}`}
										>
											{lead.sourceType === "newsletter" ? "Newsletter" : "Website"}
										</span>
									</td>
									<td className='px-4 py-3 text-xs text-gray-600'>
										<div>{lead.company || "-"}</div>
										<div className='text-gray-400'>{lead.role || "-"}</div>
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-2'>
											<Link
												href={`/dashboard/tool-leads/${lead.id}`}
												className='rounded bg-primary px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-primary/80'>
												View
											</Link>
											<button
												onClick={() => handleDelete(lead.id)}
												disabled={deleting === lead.id}
												className='rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50'>
												{deleting === lead.id ? "..." : "Delete"}
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{totalPages > 1 && (
				<div className='mt-6 flex items-center justify-center gap-2'>
					<button
						onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
						disabled={currentPage === 1}
						className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-montserrat transition-colors hover:border-primary hover:text-primary disabled:opacity-40'>
						Previous
					</button>
					{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
						<button
							key={page}
							onClick={() => setCurrentPage(page)}
							className={`rounded-lg px-4 py-2 text-sm font-montserrat transition-colors ${
								currentPage === page
									? "bg-primary text-white"
									: "border border-gray-300 hover:border-primary hover:text-primary"
							}`}>
							{page}
						</button>
					))}
					<button
						onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
						disabled={currentPage === totalPages}
						className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-montserrat transition-colors hover:border-primary hover:text-primary disabled:opacity-40'>
						Next
					</button>
				</div>
			)}
		</div>
	);
}