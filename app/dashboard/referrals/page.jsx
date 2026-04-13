"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import referralsApi from "../../lib/api/referrals";
import { SectionLoading } from "../../../components/LoadingState";

export default function ReferralsPage() {
	const [referrals, setReferrals] = useState([]);
	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState(null);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(null);

	const fetchReferrals = useCallback(async () => {
		try {
			setLoading(true);
			const data = await referralsApi.getAll({
				search: searchQuery,
				page: currentPage,
				limit: 20,
			});
			if (data.success) {
				setReferrals(data.referrals || []);
				setPagination(data.pagination);
			}
		} catch (err) {
			console.error("Error fetching referrals:", err);
		} finally {
			setLoading(false);
		}
	}, [searchQuery, currentPage]);

	useEffect(() => {
		fetchReferrals();
	}, [fetchReferrals]);

	const handleDelete = async (id) => {
		if (!confirm("Delete this referral? This will also remove uploaded files.")) return;
		setDeleting(id);
		try {
			await referralsApi.delete(id);
			fetchReferrals();
		} catch (err) {
			console.error("Error deleting referral:", err);
			alert("Failed to delete referral.");
		} finally {
			setDeleting(null);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setSearchQuery(searchInput);
		setCurrentPage(1);
	};

	const totalPages = pagination?.totalPages || 1;

	const caseTypeSummary = (caseType = {}) => {
		const active = Object.entries(caseType)
			.filter(([, v]) => v)
			.map(([k]) =>
				k
					.replace(/([A-Z])/g, " $1")
					.replace(/^./, (s) => s.toUpperCase()),
			);
		return active.length ? active.join(", ") : "—";
	};

	return (
		<div>
			{/* Header */}
			<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
				<div>
					<h1 className='font-anton text-4xl text-gray-900'>Referrals</h1>
					<p className='font-montserrat mt-2 text-gray-600'>
						{pagination ? `${pagination.total} submission${pagination.total !== 1 ? "s" : ""}` : "Loading…"}
					</p>
				</div>
			</div>

			{/* Search */}
			<div className='mb-6'>
				<form onSubmit={handleSearch} className='relative'>
					<input
						type='text'
						placeholder='Search by name, email, client, address, case number…'
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className='w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
					/>
					<button type='submit' className='sr-only'>Search</button>
					<svg
						className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400'
						fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
							d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
					</svg>
				</form>
			</div>

			{/* Table */}
			{loading ? (
				<SectionLoading />
			) : referrals.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-20 text-gray-400'>
					<svg className='mb-4 h-16 w-16' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5}
							d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' />
					</svg>
					<p className='text-xl font-montserrat'>No referrals found</p>
				</div>
			) : (
				<div className='overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm'>
					<table className='w-full text-sm'>
						<thead className='bg-primary/10 text-left'>
							<tr>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>Submitted</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>Referring Party</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>Client</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>Property</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>Case Type</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>Files</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>Actions</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-100'>
							{referrals.map((r) => (
								<tr key={r.id} className='hover:bg-gray-50 transition-colors'>
									<td className='px-4 py-3 text-gray-500 whitespace-nowrap'>
										{new Date(r.submittedAt || r.createdAt).toLocaleDateString("en-US", {
											month: "short", day: "numeric", year: "numeric",
										})}
									</td>
									<td className='px-4 py-3'>
										<div className='font-semibold text-gray-900'>{r.referringPartyName || "—"}</div>
										<div className='text-gray-400 text-xs'>{r.role}{r.roleOther ? ` — ${r.roleOther}` : ""}</div>
										<div className='text-gray-400 text-xs'>{r.referringEmail}</div>
									</td>
									<td className='px-4 py-3'>
										<div className='font-medium text-gray-800'>{r.clientName || "—"}</div>
										<div className='text-gray-400 text-xs'>{r.clientRole}{r.clientRoleOther ? ` — ${r.clientRoleOther}` : ""}</div>
									</td>
									<td className='px-4 py-3 max-w-[200px] truncate text-gray-700'>
										{r.propertyAddress || "—"}
									</td>
									<td className='px-4 py-3 text-gray-600 text-xs max-w-[160px]'>
										{caseTypeSummary(r.caseType)}
									</td>
									<td className='px-4 py-3 text-gray-500'>
										{r.uploadedFiles?.length || 0}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-2'>
											<Link
												href={`/dashboard/referrals/${r.id}`}
												className='rounded bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary/80 transition-colors'>
												View
											</Link>
											<button
												onClick={() => handleDelete(r.id)}
												disabled={deleting === r.id}
												className='rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50'>
												{deleting === r.id ? "…" : "Delete"}
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className='mt-6 flex items-center justify-center gap-2'>
					<button
						onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
						disabled={currentPage === 1}
						className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-montserrat disabled:opacity-40 hover:border-primary hover:text-primary transition-colors'>
						Previous
					</button>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
						onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
						disabled={currentPage === totalPages}
						className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-montserrat disabled:opacity-40 hover:border-primary hover:text-primary transition-colors'>
						Next
					</button>
				</div>
			)}
		</div>
	);
}
