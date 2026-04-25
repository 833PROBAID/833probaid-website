"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import invoiceAPI from "../lib/api";
import {
	DEFAULT_INVOICE_NUMBER,
	deriveNextInvoiceNumber,
} from "../utils/invoiceNumber";

const STATUS_COLORS = {
	draft: "#6B7280",
	sent: "#3B82F6",
	paid: "#10B981",
	overdue: "#EF4444",
	cancelled: "#374151",
};

function getVisiblePageNumbers(currentPage, totalPages) {
	const count = Math.min(5, totalPages);
	return Array.from({ length: count }, (_, i) => {
		if (totalPages <= 5) return i + 1;
		if (currentPage <= 3) return i + 1;
		if (currentPage >= totalPages - 2) return totalPages - 4 + i;
		return currentPage - 2 + i;
	});
}

const InvoiceManagement = () => {
	const [invoices, setInvoices] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalInvoices, setTotalInvoices] = useState(0);
	const [itemsPerPage] = useState(10);
	const [isLoading, setIsLoading] = useState(true);
	const [isSearching, setIsSearching] = useState(false);
	const [stats, setStats] = useState({
		total: 0,
		totalAmount: 0,
		thisMonth: 0,
		thisMonthAmount: 0,
	});
	const [error, setError] = useState(null);
	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState({
		status: "all",
		startDate: "",
		endDate: "",
		minAmount: "",
		maxAmount: "",
		sortBy: "createdAt",
		sortOrder: "desc",
	});
	const router = useRouter();
	const navigate = useCallback((path, options = {}) => {
		if (typeof window !== "undefined") {
			try {
				if (options?.state) {
					sessionStorage.setItem("invoiceFormNavState", JSON.stringify(options.state));
				} else {
					sessionStorage.removeItem("invoiceFormNavState");
				}
			} catch {}
		}
		if (options?.replace) router.replace(path);
		else router.push(path);
	}, [router]);
	const searchTimeoutRef = useRef(null);
	const filtersRef = useRef(filters);
	useEffect(() => {
		filtersRef.current = filters;
	}, [filters]);

	// Fetch invoices from API
	const fetchInvoices = useCallback(
		async (page = 1, search = "", filterParams = filtersRef.current) => {
			try {
				setError(null);
				const params = {
					page,
					limit: itemsPerPage,
					search: search || undefined,
					status:
						filterParams.status !== "all" ? filterParams.status : undefined,
					startDate: filterParams.startDate || undefined,
					endDate: filterParams.endDate || undefined,
					minAmount: filterParams.minAmount || undefined,
					maxAmount: filterParams.maxAmount || undefined,
					sortBy: filterParams.sortBy || "createdAt",
					sortOrder: filterParams.sortOrder || "desc",
				};
				const response = await invoiceAPI.getAll(params);
				setInvoices(response.invoices || []);
				setCurrentPage(response.currentPage || 1);
				setTotalPages(response.totalPages || 1);
				setTotalInvoices(response.totalInvoices || 0);
			} catch (err) {
				console.error("Error fetching invoices:", err);
				setError(err.message || "Failed to load invoices");
				setInvoices([]);
			} finally {
				setIsLoading(false);
				setIsSearching(false);
			}
		},
		[itemsPerPage],
	);

	// Fetch stats
	const fetchStats = useCallback(async () => {
		try {
			const statsData = await invoiceAPI.getStats();
			setStats(statsData);
		} catch (err) {
			console.error("Error fetching stats:", err);
		}
	}, []);

	// Initial load
	useEffect(() => {
		setIsLoading(true);
		Promise.all([fetchInvoices(1, ""), fetchStats()]);
	}, [fetchInvoices, fetchStats]);

	// Debounced search
	useEffect(() => {
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		if (inputValue !== searchTerm) {
			setIsSearching(true);
			searchTimeoutRef.current = setTimeout(() => {
				setSearchTerm(inputValue);
				setCurrentPage(1);
				fetchInvoices(1, inputValue, filters);
			}, 500);
		}

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [inputValue, searchTerm, filters, fetchInvoices]);

	// Page change handler
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setIsLoading(true);
			setCurrentPage(newPage);
			fetchInvoices(newPage, searchTerm, filters);
		}
	};

	const handleFilterChange = (filterName, value) => {
		setFilters((prev) => ({ ...prev, [filterName]: value }));
	};

	const applyFilters = () => {
		setIsLoading(true);
		setCurrentPage(1);
		fetchInvoices(1, searchTerm, filters);
	};

	const clearFilters = () => {
		const defaultFilters = {
			status: "all",
			startDate: "",
			endDate: "",
			minAmount: "",
			maxAmount: "",
			sortBy: "createdAt",
			sortOrder: "desc",
		};
		setFilters(defaultFilters);
		setInputValue("");
		setSearchTerm("");
		setIsLoading(true);
		setCurrentPage(1);
		fetchInvoices(1, "", defaultFilters);
	};

	const exportToExcel = () => {
		if (invoices.length === 0) {
			Swal.fire("No Data", "No invoices to export", "info");
			return;
		}

		// Prepare data for Excel
		const excelData = invoices.map((inv) => ({
			"Invoice #": inv.invoiceNumber || "",
			Date: inv.date || "",
			Company: inv.companyName || "",
			Email: inv.email || "",
			Phone: inv.phone || "",
			"Total Due": parseFloat(inv.totalDue) || 0,
			Status: inv.status || "draft",
			"Created At": new Date(inv.createdAt).toLocaleDateString(),
		}));

		// Create worksheet
		const worksheet = XLSX.utils.json_to_sheet(excelData);

		// Set column widths
		const columnWidths = [
			{ wch: 15 }, // Invoice #
			{ wch: 12 }, // Date
			{ wch: 25 }, // Company
			{ wch: 25 }, // Email
			{ wch: 15 }, // Phone
			{ wch: 12 }, // Total Due
			{ wch: 12 }, // Status
			{ wch: 15 }, // Created At
		];
		worksheet["!cols"] = columnWidths;

		// Create workbook
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

		// Generate file name with current date
		const fileName = `invoices_${new Date().toISOString().split("T")[0]}.xlsx`;

		// Download file
		XLSX.writeFile(workbook, fileName);

		Swal.fire("Success!", "Invoices exported to Excel", "success");
	};

	const handleSearch = () => {
		setIsSearching(true);
		setCurrentPage(1);
		fetchInvoices(1, inputValue, filters);
		setSearchTerm(inputValue);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const determineNextInvoiceMeta = async () => {
		try {
			const response = await invoiceAPI.getAll({
				page: 1,
				limit: 1,
				sortBy: "invoiceNumber",
				sortOrder: "desc",
			});
			const lastInvoiceNumber = response?.invoices?.[0]?.invoiceNumber || null;
			return {
				lastInvoiceNumber,
				nextInvoiceNumber: deriveNextInvoiceNumber(lastInvoiceNumber),
			};
		} catch (error) {
			console.error("Error determining next invoice number:", error);
			return {
				lastInvoiceNumber: null,
				nextInvoiceNumber: DEFAULT_INVOICE_NUMBER,
			};
		}
	};

	const handleAdd = async () => {
		Swal.fire({
			title: "Preparing new invoice...",
			text: "Fetching the next invoice number",
			allowOutsideClick: false,
			showConfirmButton: false,
			didOpen: () => {
				Swal.showLoading();
			},
		});

		try {
			const { nextInvoiceNumber, lastInvoiceNumber } =
				await determineNextInvoiceMeta();
			Swal.close();
			navigate("/dashboard/invoice-management/invoice-form/new", {
				state: {
					prefilledInvoiceNumber: nextInvoiceNumber,
					lastInvoiceNumber,
					viewMode: false,
				},
			});
		} catch (error) {
			Swal.close();
			console.error("Unable to prepare new invoice:", error);
			Swal.fire(
				"Error",
				error.message || "Unable to prepare new invoice number.",
				"error",
			);
		}
	};

	const handleView = (id) => {
		navigate(`/dashboard/invoice-management/invoice-form/${id}`, { state: { viewMode: true } });
	};

	const handleEdit = (id) => {
		navigate(`/dashboard/invoice-management/invoice-form/${id}`, { state: { viewMode: false } });
	};

	const handleDownloadPdf = (id) => {
		navigate(`/dashboard/invoice-management/invoice-form/${id}`, {
			state: { viewMode: true, autoDownload: true },
		});
	};

	const handleStatusChange = async (id, newStatus) => {
		try {
			await invoiceAPI.updateStatus(id, newStatus);
			// Update local state immediately for better UX
			setInvoices((prevInvoices) =>
				prevInvoices.map((inv) =>
					inv._id === id ? { ...inv, status: newStatus } : inv,
				),
			);
			Swal.fire({
				title: "Success!",
				text: `Invoice status updated to ${newStatus}`,
				icon: "success",
				timer: 2000,
				showConfirmButton: false,
			});
			// Refresh stats
			fetchStats();
		} catch (err) {
			Swal.fire("Error!", err.message || "Failed to update status.", "error");
			// Refresh to get correct state from server
			fetchInvoices(currentPage, searchTerm);
		}
	};

	const handleDelete = async (id) => {
		const result = await Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#0097A7",
			cancelButtonColor: "#FD7702",
			confirmButtonText: "Yes, delete it!",
		});

		if (result.isConfirmed) {
			try {
				await invoiceAPI.delete(id);
				Swal.fire("Deleted!", "Invoice has been deleted.", "success");
				// Refresh the list
				fetchInvoices(currentPage, searchTerm);
				fetchStats();
			} catch (err) {
				Swal.fire(
					"Error!",
					err.message || "Failed to delete invoice.",
					"error",
				);
			}
		}
	};

	const formatCurrency = (amount) => {
		const num = parseFloat(amount) || 0;
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(num);
	};

	const formatDate = (dateStr) => {
		if (!dateStr) return "N/A";
		try {
			return new Date(dateStr).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch {
			return dateStr;
		}
	};

	return (
		<div className='w-full bg-gray-50 min-h-screen'>
			<div className=''>
				{/* Stats Cards */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
					<div className='bg-white rounded-lg shadow-md p-4 border-l-4 border-colorTeal'>
						<div className='text-sm text-gray-500 uppercase'>
							Total Invoices
						</div>
						<div className='text-2xl font-bold text-colorTeal'>
							{stats.total}
						</div>
					</div>
					<div className='bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500'>
						<div className='text-sm text-gray-500 uppercase'>Total Amount</div>
						<div className='text-2xl font-bold text-green-600'>
							{formatCurrency(stats.totalAmount)}
						</div>
					</div>
					<div className='bg-white rounded-lg shadow-md p-4 border-l-4 border-colorOrange'>
						<div className='text-sm text-gray-500 uppercase'>This Month</div>
						<div className='text-2xl font-bold text-colorOrange'>
							{stats.thisMonth}
						</div>
					</div>
					<div className='bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500'>
						<div className='text-sm text-gray-500 uppercase'>
							Monthly Amount
						</div>
						<div className='text-2xl font-bold text-blue-600'>
							{formatCurrency(stats.thisMonthAmount)}
						</div>
					</div>
				</div>

				<div className='bg-white shadow-md border border-gray-200 rounded-lg p-6'>
					<div className='flex flex-col sm:flex-row justify-between items-center gap-4 mb-6'>
						<Typography
							variant='h3'
							className='font-bold text-colorTeal text-center sm:text-left'>
							Invoice Management
						</Typography>
						<div className='flex gap-2'>
							<button
								onClick={exportToExcel}
								disabled={invoices.length === 0}
								className='bg-green-600 text-white font-semibold px-4 py-3 rounded hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2'>
								<i className='fas fa-file-excel'></i>
								Export Excel
							</button>
							<button
								onClick={handleAdd}
								className='bg-[#0097A7] text-white font-semibold px-6 py-3 rounded hover:bg-[#007a87] transition-colors flex items-center gap-2'>
								<i className='fas fa-plus'></i>
								Add New Invoice
							</button>
						</div>
					</div>

					{/* Search Bar */}
					<div className='mb-6'>
						<div className='flex gap-2 items-center'>
							<div className='relative flex-1'>
								<input
									type='text'
									placeholder='Search by invoice #, company, email, phone...'
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									onBlur={handleSearch}
									onKeyDown={handleKeyDown}
									className='w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal transition-colors'
								/>
								<i className='fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
								{isSearching && (
									<i className='fas fa-spinner fa-spin absolute right-4 top-1/2 transform -translate-y-1/2 text-colorTeal'></i>
								)}
							</div>
							<button
								onClick={() => setShowFilters(!showFilters)}
								className={`px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
									showFilters
										? "bg-colorTeal text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}>
								<i className='fas fa-filter'></i>
								Filters
							</button>
						</div>

						{/* Advanced Filters Panel */}
						{showFilters && (
							<div className='mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg animate-fade-in'>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
									{/* Status Filter */}
									<div>
										<label className='block text-sm font-semibold text-gray-700 mb-1'>
											Status
										</label>
										<select
											value={filters.status}
											onChange={(e) =>
												handleFilterChange("status", e.target.value)
											}
											className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal'>
											<option value='all'>All Status</option>
											<option value='draft'>Draft</option>
											<option value='sent'>Sent</option>
											<option value='paid'>Paid</option>
											<option value='overdue'>Overdue</option>
											<option value='cancelled'>Cancelled</option>
										</select>
									</div>

									{/* Date Range */}
									<div>
										<label className='block text-sm font-semibold text-gray-700 mb-1'>
											Start Date
										</label>
										<input
											type='date'
											value={filters.startDate}
											onChange={(e) =>
												handleFilterChange("startDate", e.target.value)
											}
											className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal leading-3'
										/>
									</div>

									<div>
										<label className='block text-sm font-semibold text-gray-700 mb-1'>
											End Date
										</label>
										<input
											type='date'
											value={filters.endDate}
											onChange={(e) =>
												handleFilterChange("endDate", e.target.value)
											}
											className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal leading-3'
										/>
									</div>

									{/* Sort Options */}
									<div>
										<label className='block text-sm font-semibold text-gray-700 mb-1'>
											Sort By
										</label>
										<select
											value={filters.sortBy}
											onChange={(e) =>
												handleFilterChange("sortBy", e.target.value)
											}
											className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal'>
											<option value='createdAt'>Date Created</option>
											<option value='date'>Invoice Date</option>
											<option value='invoiceNumber'>Invoice #</option>
											<option value='companyName'>Company</option>
											<option value='totalDue'>Amount</option>
										</select>
									</div>

									{/* Amount Range */}
									<div>
										<label className='block text-sm font-semibold text-gray-700 mb-1'>
											Min Amount ($)
										</label>
										<input
											type='number'
											placeholder='0'
											value={filters.minAmount}
											onChange={(e) =>
												handleFilterChange("minAmount", e.target.value)
											}
											className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal'
										/>
									</div>

									<div>
										<label className='block text-sm font-semibold text-gray-700 mb-1'>
											Max Amount ($)
										</label>
										<input
											type='number'
											placeholder='99999'
											value={filters.maxAmount}
											onChange={(e) =>
												handleFilterChange("maxAmount", e.target.value)
											}
											className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal'
										/>
									</div>

									{/* Sort Order */}
									<div>
										<label className='block text-sm font-semibold text-gray-700 mb-1'>
											Order
										</label>
										<select
											value={filters.sortOrder}
											onChange={(e) =>
												handleFilterChange("sortOrder", e.target.value)
											}
											className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal'>
											<option value='desc'>Descending</option>
											<option value='asc'>Ascending</option>
										</select>
									</div>
								</div>

								{/* Filter Action Buttons */}
								<div className='flex gap-3 mt-4'>
									<button
										onClick={applyFilters}
										className='bg-colorTeal text-white px-6 py-2 rounded-lg hover:bg-[#007a87] transition-colors font-semibold flex items-center gap-2'>
										<i className='fas fa-check'></i>
										Apply Filters
									</button>
									<button
										onClick={clearFilters}
										className='bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center gap-2'>
										<i className='fas fa-times'></i>
										Clear All
									</button>
								</div>
							</div>
						)}

						<div className='mt-2 flex items-center gap-2'>
							{isSearching && (
								<span className='text-sm text-colorTeal font-medium animate-pulse'>
									<i className='fas fa-sync fa-spin mr-1'></i>
									Searching...
								</span>
							)}
							{!isSearching && !isLoading && (
								<p className='text-sm text-gray-600'>
									{searchTerm
										? `Found ${totalInvoices} invoice${
												totalInvoices !== 1 ? "s" : ""
										  } matching "${searchTerm}"`
										: `Showing ${totalInvoices} invoice${
												totalInvoices !== 1 ? "s" : ""
										  }`}
								</p>
							)}
						</div>
					</div>

					{/* Error State */}
					{error && (
						<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2'>
							<i className='fas fa-exclamation-circle'></i>
							<span>{error}</span>
							<button
								onClick={() => fetchInvoices(currentPage, searchTerm)}
								className='ml-auto text-sm underline hover:no-underline'>
								Retry
							</button>
						</div>
					)}

					{isLoading ? (
						<div className='text-center py-16'>
							<div className='inline-block'>
								<i className='fas fa-circle-notch fa-spin text-6xl text-colorTeal mb-4'></i>
								<Typography
									variant='h5'
									className='text-gray-600 animate-pulse'>
									Loading invoices...
								</Typography>
							</div>
						</div>
					) : invoices.length === 0 ? (
						<div className='text-center py-12 animate-fade-in'>
							<i className='fas fa-file-invoice text-6xl text-gray-300 mb-4'></i>
							<Typography variant='h5' className='text-gray-500'>
								{searchTerm
									? "No invoices match your search"
									: 'No invoices yet. Click "Add New Invoice" to create one.'}
							</Typography>
						</div>
					) : (
						<div className='overflow-x-auto animate-fade-in'>
							<table className='w-full border-collapse'>
								<thead>
									<tr className='bg-colorTeal text-white'>
										<th className='border border-gray-300 px-4 py-3 text-left leading-relaxed'>
											Invoice #
										</th>
										<th className='border border-gray-300 px-4 py-3 text-left leading-relaxed'>
											Date
										</th>
										<th className='border border-gray-300 px-4 py-3 text-left leading-relaxed'>
											Company
										</th>
										<th className='border border-gray-300 px-4 py-3 text-center leading-relaxed'>
											Status
										</th>
										<th className='border border-gray-300 px-4 py-3 text-right leading-relaxed'>
											Total Due
										</th>
										<th className='border border-gray-300 px-4 py-3 text-center leading-relaxed'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{invoices.map((invoice) => (
										<tr key={invoice._id} className='hover:bg-gray-50'>
											<td className='border border-gray-300 px-4 py-3 leading-relaxed font-medium'>
												{invoice.invoiceNumber || "N/A"}
											</td>
											<td className='border border-gray-300 px-4 py-3 leading-relaxed'>
												{formatDate(invoice.date)}
											</td>
											<td className='border border-gray-300 px-4 py-3 leading-relaxed'>
												{invoice.companyName || "N/A"}
											</td>
											<td className='border border-gray-300 px-4 py-3 leading-relaxed text-center'>
												<select
													value={invoice.status || "draft"}
													onChange={(e) =>
														handleStatusChange(invoice._id, e.target.value)
													}
													className='px-3 py-1 rounded-full text-sm font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-colorTeal cursor-pointer'
													style={{
														backgroundColor: STATUS_COLORS[invoice.status || "draft"],
														color: "white",
														borderColor: "transparent",
													}}>
													<option value='draft'>📝 Draft</option>
													<option value='sent'>✉️ Sent</option>
													<option value='paid'>✅ Paid</option>
													<option value='overdue'>⚠️ Overdue</option>
													<option value='cancelled'>❌ Cancelled</option>
												</select>
											</td>
											<td className='border border-gray-300 px-4 py-3 leading-relaxed text-right font-semibold text-green-600'>
												{formatCurrency(invoice.totalDue)}
											</td>
											<td className='border border-gray-300 px-4 py-3 text-center leading-relaxed'>
												<div className='flex flex-col sm:flex-row justify-center gap-2'>
													<button
														onClick={() => handleView(invoice._id)}
														className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors whitespace-nowrap'>
														<i className='fas fa-eye'></i> View
													</button>
													<button
														onClick={() => handleEdit(invoice._id)}
														className='bg-colorTeal text-white px-4 py-2 rounded hover:bg-[#007a87] transition-colors whitespace-nowrap'>
														<i className='fas fa-edit'></i> Edit
													</button>
													<button
														onClick={() => handleDownloadPdf(invoice._id)}
														className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors whitespace-nowrap'>
														<i className='fas fa-download'></i> PDF
													</button>
													<button
														onClick={() => handleDelete(invoice._id)}
														className='bg-colorOrange text-white px-4 py-2 rounded hover:bg-[#e56902] transition-colors whitespace-nowrap'>
														<i className='fas fa-trash'></i> Delete
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{/* Pagination Controls */}
							{totalPages > 1 && (
								<div className='mt-6 flex flex-col sm:flex-row justify-between items-center gap-4'>
									<div className='text-sm text-gray-600'>
										Page {currentPage} of {totalPages} ({totalInvoices} total
										invoices)
									</div>
									<div className='flex gap-2'>
										<button
											onClick={() => handlePageChange(1)}
											disabled={currentPage === 1}
											className='px-3 py-2 bg-colorTeal text-white rounded hover:bg-[#007a87] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'>
											<i className='fas fa-angle-double-left'></i>
										</button>
										<button
											onClick={() => handlePageChange(currentPage - 1)}
											disabled={currentPage === 1}
											className='px-4 py-2 bg-colorTeal text-white rounded hover:bg-[#007a87] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'>
											<i className='fas fa-chevron-left'></i> Prev
										</button>

										{/* Page Numbers */}
										<div className='flex gap-1'>
											{getVisiblePageNumbers(currentPage, totalPages).map((pageNum) => (
												<button
													key={pageNum}
													onClick={() => handlePageChange(pageNum)}
													className={`px-4 py-2 rounded transition-colors ${
														currentPage === pageNum
															? "bg-colorTeal text-white"
															: "bg-gray-200 text-gray-700 hover:bg-gray-300"
													}`}>
													{pageNum}
												</button>
											))}
										</div>

										<button
											onClick={() => handlePageChange(currentPage + 1)}
											disabled={currentPage === totalPages}
											className='px-4 py-2 bg-colorTeal text-white rounded hover:bg-[#007a87] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'>
											Next <i className='fas fa-chevron-right'></i>
										</button>
										<button
											onClick={() => handlePageChange(totalPages)}
											disabled={currentPage === totalPages}
											className='px-3 py-2 bg-colorTeal text-white rounded hover:bg-[#007a87] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'>
											<i className='fas fa-angle-double-right'></i>
										</button>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default InvoiceManagement;
