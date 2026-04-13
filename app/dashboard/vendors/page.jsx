"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import vendorsApi from "../../lib/api/vendors";
import { SectionLoading } from "../../../components/LoadingState";

export default function VendorsPage() {
	const [vendors, setVendors] = useState([]);
	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState(null);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(null);

	const fetchVendors = useCallback(async () => {
		try {
			setLoading(true);
			const data = await vendorsApi.getAll({
				search: searchQuery,
				page: currentPage,
				limit: 20,
			});
			if (data.success) {
				setVendors(data.vendors || []);
				setPagination(data.pagination);
			}
		} catch (err) {
			console.error("Error fetching vendors:", err);
		} finally {
			setLoading(false);
		}
	}, [searchQuery, currentPage]);

	useEffect(() => {
		fetchVendors();
	}, [fetchVendors]);

	const handleDelete = async (id) => {
		if (!confirm("Delete this vendor? This will also remove uploaded files.")) return;
		setDeleting(id);
		try {
			await vendorsApi.delete(id);
			fetchVendors();
		} catch (err) {
			console.error("Error deleting vendor:", err);
			alert("Failed to delete vendor.");
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

	const servicesSummary = (servicesOffered = {}) => {
		const labels = {
			locksmith: "Locksmith",
			haulingJunkRemoval: "Hauling / Junk Removal",
			deepCleaning: "Deep Cleaning",
			biohazardCleanup: "Biohazard Cleanup",
			propertyInspector: "Property Inspector",
			securityBoardUp: "Security / Board-Up",
			estateLiquidator: "Estate Liquidator",
			generalContractorHandyman: "General Contractor",
			roofingStructuralInspection: "Roofing / Structural",
			translationInterpretationServices: "Translation",
			others: "Other",
		};
		const active = Object.entries(servicesOffered)
			.filter(([, v]) => v)
			.map(([k]) => labels[k] || k);
		return active.length ? active.join(", ") : "—";
	};

	return (
		<div>
			{/* Header */}
			<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
				<div>
					<h1 className='font-anton text-4xl text-gray-900'>Vendors</h1>
					<p className='font-montserrat mt-2 text-gray-600'>
						{pagination
							? `${pagination.total} submission${pagination.total !== 1 ? "s" : ""}`
							: "Loading…"}
					</p>
				</div>
			</div>

			{/* Search */}
			<div className='mb-6'>
				<form onSubmit={handleSearch} className='relative'>
					<input
						type='text'
						placeholder='Search by business name, contact, email or location…'
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
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
			</div>

			{/* Table */}
			{loading ? (
				<SectionLoading />
			) : vendors.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-20 text-gray-400'>
					<svg className='mb-4 h-16 w-16' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1.5}
							d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
						/>
					</svg>
					<p className='text-xl font-montserrat'>No vendors found</p>
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
									Business Name
								</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>
									Contact
								</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>
									Services Offered
								</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>
									Files
								</th>
								<th className='px-4 py-3 font-montserrat font-semibold text-primary'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-100'>
							{vendors.map((v) => (
								<tr key={v.id} className='hover:bg-gray-50 transition-colors'>
									<td className='px-4 py-3 text-gray-500 whitespace-nowrap'>
										{new Date(v.submittedAt || v.createdAt).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</td>
									<td className='px-4 py-3'>
										<div className='font-semibold text-gray-900'>
											{v.businessName || "—"}
										</div>
										<div className='text-gray-400 text-xs'>{v.headquarters || ""}</div>
									</td>
									<td className='px-4 py-3'>
										<div className='font-medium text-gray-800'>{v.yourName || "—"}</div>
										<div className='text-gray-400 text-xs'>{v.email}</div>
										<div className='text-gray-400 text-xs'>{v.cellPhone}</div>
									</td>
									<td className='px-4 py-3 text-gray-600 text-xs max-w-[200px]'>
										{servicesSummary(v.servicesOffered)}
									</td>
									<td className='px-4 py-3 text-gray-500'>
										{v.uploadedFiles?.length || 0}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-2'>
											<Link
												href={`/dashboard/vendors/${v.id}`}
												className='rounded bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary/80 transition-colors'>
												View
											</Link>
											<button
												onClick={() => handleDelete(v.id)}
												disabled={deleting === v.id}
												className='rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50'>
												{deleting === v.id ? "…" : "Delete"}
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
