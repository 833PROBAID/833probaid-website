"use client";

import { useState, useEffect } from "react";
import mediaApi from "@/app/lib/api/media";

export default function MediaPickerModal({ isOpen, onClose, onSelect, allowedTypes = [] }) {
	const [media, setMedia] = useState([]);
	const [filteredMedia, setFilteredMedia] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedType, setSelectedType] = useState("");
	const [sortBy, setSortBy] = useState("recent"); // recent, name, size, type
	const [viewMode, setViewMode] = useState("grid");

	useEffect(() => {
		if (isOpen) {
			fetchMedia();
		}
	}, [isOpen]);

	useEffect(() => {
		applyFilters();
	}, [media, searchQuery, selectedType, sortBy]);

	const fetchMedia = async () => {
		try {
			setLoading(true);
			const response = await mediaApi.getAll();
			if (response.success) {
				let mediaList = response.media || [];
				
				// Filter by allowed types if specified
				if (allowedTypes.length > 0) {
					mediaList = mediaList.filter(item => allowedTypes.includes(item.fileType));
				}
				
				setMedia(mediaList);
			}
		} catch (error) {
			console.error("Error fetching media:", error);
		} finally {
			setLoading(false);
		}
	};

	const applyFilters = () => {
		let filtered = [...media];

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(item) =>
					item.title?.toLowerCase().includes(query) ||
					item.originalName?.toLowerCase().includes(query) ||
					item.description?.toLowerCase().includes(query)
			);
		}

		// Type filter
		if (selectedType) {
			filtered = filtered.filter((item) => item.fileType === selectedType);
		}

		// Sorting
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return (a.title || a.originalName).localeCompare(b.title || b.originalName);
				case "size":
					return b.size - a.size;
				case "type":
					return a.fileType.localeCompare(b.fileType);
				case "recent":
				default:
					return new Date(b.createdAt) - new Date(a.createdAt);
			}
		});

		setFilteredMedia(filtered);
	};

	const handleSelect = (item) => {
		onSelect({
			id: item.id,
			url: item.url,
			title: item.title || item.originalName,
			fileType: item.fileType,
			size: item.size,
			originalName: item.originalName
		});
		handleClose();
	};

	const handleClose = () => {
		setSearchQuery("");
		setSelectedType("");
		setSortBy("recent");
		onClose();
	};

	const formatFileSize = (bytes) => {
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
		return (bytes / (1024 * 1024)).toFixed(2) + " MB";
	};

	const getFileIcon = (fileType) => {
		const icons = {
			image: (
				<svg className='h-8 w-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
				</svg>
			),
			pdf: (
				<svg className='h-8 w-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
				</svg>
			),
			document: (
				<svg className='h-8 w-8 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
				</svg>
			),
			video: (
				<svg className='h-8 w-8 text-purple-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
				</svg>
			),
			audio: (
				<svg className='h-8 w-8 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' />
				</svg>
			),
			other: (
				<svg className='h-8 w-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' />
				</svg>
			),
		};
		return icons[fileType] || icons.other;
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4'>
			<div className='flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl'>
				{/* Header */}
				<div className='border-b border-gray-200 bg-gradient-to-r from-primary to-primary/90 px-4 py-4 sm:px-6 sm:py-5'>
					<div className='flex items-center justify-between gap-3'>
						<div>
							<h2 className='font-anton text-xl text-white sm:text-2xl'>Select Media</h2>
							<p className='font-montserrat mt-1 text-xs text-white/80 sm:text-sm'>
								Choose a file from your library
							</p>
						</div>
						<button
							onClick={handleClose}
							className='rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:p-2'>
							<svg className='h-5 w-5 sm:h-6 sm:w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
							</svg>
						</button>
					</div>

					{/* Filters */}
					<div className='mt-4 grid gap-2 sm:grid-cols-4'>
						{/* Search */}
						<div className='relative sm:col-span-2'>
							<input
								type='text'
								placeholder='Search files...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 pl-9 font-montserrat text-sm text-white placeholder-white/60 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30'
							/>
							<svg className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
							</svg>
						</div>

						{/* Type Filter */}
						<select
							value={selectedType}
							onChange={(e) => setSelectedType(e.target.value)}
							className='rounded-lg border border-white/20 bg-white/10 px-3 py-2 font-montserrat text-sm text-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30'>
							<option value=''>All Types</option>
							<option value='image'>Images</option>
							<option value='pdf'>PDFs</option>
							<option value='document'>Documents</option>
							<option value='video'>Videos</option>
							<option value='audio'>Audio</option>
							<option value='other'>Other</option>
						</select>

						{/* Sort */}
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className='rounded-lg border border-white/20 bg-white/10 px-3 py-2 font-montserrat text-sm text-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30'>
							<option value='recent'>Most Recent</option>
							<option value='name'>Name (A-Z)</option>
							<option value='size'>Size (Largest)</option>
							<option value='type'>Type</option>
						</select>
					</div>

					{/* View Mode Toggle */}
					<div className='mt-3 flex items-center justify-between'>
						<p className='font-montserrat text-sm text-white/80'>
							{filteredMedia.length} {filteredMedia.length === 1 ? 'file' : 'files'} found
						</p>
						<div className='flex gap-1 rounded-lg border border-white/20 bg-white/10 p-1'>
							<button
								onClick={() => setViewMode("grid")}
								className={`rounded px-2 py-1 transition-colors ${viewMode === "grid" ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
								<svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
								</svg>
							</button>
							<button
								onClick={() => setViewMode("list")}
								className={`rounded px-2 py-1 transition-colors ${viewMode === "list" ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
								<svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className='flex-1 overflow-y-auto p-4 sm:p-6'>
					{loading ? (
						<div className='flex h-full items-center justify-center'>
							<div className='h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
						</div>
					) : filteredMedia.length === 0 ? (
						<div className='flex h-full items-center justify-center'>
							<div className='text-center'>
								<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
									<svg className='h-8 w-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
									</svg>
								</div>
								<h3 className='font-anton mb-2 text-lg text-gray-900'>No files found</h3>
								<p className='font-montserrat text-sm text-gray-600'>Try adjusting your filters</p>
							</div>
						</div>
					) : viewMode === "grid" ? (
						<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
							{filteredMedia.map((item) => (
								<button
									key={item.id}
									onClick={() => handleSelect(item)}
									className='group overflow-hidden rounded-lg border-2 border-gray-200 bg-white text-left transition-all hover:border-primary hover:shadow-lg'>
									{/* Preview */}
									<div className='relative aspect-square overflow-hidden bg-gray-50'>
										{item.fileType === "image" ? (
											<img
												src={item.url}
												alt={item.title}
												className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
											/>
										) : (
											<div className='flex h-full items-center justify-center'>
												{getFileIcon(item.fileType)}
											</div>
										)}
										<div className='absolute inset-0 flex items-center justify-center bg-primary/0 transition-all group-hover:bg-primary/10'>
											<div className='scale-0 rounded-full bg-primary p-2 transition-transform group-hover:scale-100'>
												<svg className='h-5 w-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
													<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
												</svg>
											</div>
										</div>
									</div>

									{/* Info */}
									<div className='p-3'>
										<h4 className='font-montserrat mb-1 truncate text-sm font-semibold text-gray-900' title={item.title || item.originalName}>
											{item.title || item.originalName}
										</h4>
										<div className='flex items-center gap-2 text-xs text-gray-500'>
											<span className='font-montserrat uppercase'>{item.fileType}</span>
											<span>•</span>
											<span className='font-montserrat'>{formatFileSize(item.size)}</span>
										</div>
									</div>
								</button>
							))}
						</div>
					) : (
						<div className='space-y-2'>
							{filteredMedia.map((item) => (
								<button
									key={item.id}
									onClick={() => handleSelect(item)}
									className='flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-primary hover:bg-primary/5'>
									<div className='flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-gray-100'>
										{item.fileType === "image" ? (
											<img src={item.url} alt={item.title} className='h-full w-full object-cover' />
										) : (
											<div className='scale-75'>{getFileIcon(item.fileType)}</div>
										)}
									</div>
									<div className='min-w-0 flex-1'>
										<h4 className='font-montserrat truncate text-sm font-semibold text-gray-900'>
											{item.title || item.originalName}
										</h4>
										<div className='flex items-center gap-2 text-xs text-gray-500'>
											<span className='font-montserrat uppercase'>{item.fileType}</span>
											<span>•</span>
											<span className='font-montserrat'>{formatFileSize(item.size)}</span>
										</div>
									</div>
									<svg className='h-5 w-5 flex-shrink-0 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
									</svg>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className='border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6'>
					<div className='flex justify-end'>
						<button
							onClick={handleClose}
							className='rounded-lg border-2 border-gray-300 px-4 py-2 font-montserrat text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100'>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
