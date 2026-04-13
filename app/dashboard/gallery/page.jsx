"use client";

import { useState, useEffect, useRef } from "react";
import mediaApi from "@/app/lib/api/media";
import storageApi from "@/app/lib/api/storage";
import { PageLoading, SectionLoading } from "@/components/LoadingState";

export default function MediaGalleryPage() {
	const [media, setMedia] = useState([]);
	const [filteredMedia, setFilteredMedia] = useState([]);
	const [folders, setFolders] = useState([]);
	const [tags, setTags] = useState([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [storageStats, setStorageStats] = useState(null);

	// Filters
	const [selectedFolder, setSelectedFolder] = useState("");
	const [selectedFileType, setSelectedFileType] = useState("");
	const [selectedTags, setSelectedTags] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [newFolder, setNewFolder] = useState("");
	const [viewMode, setViewMode] = useState("grid"); // grid or list

	// Modals
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingMedia, setEditingMedia] = useState(null);

	// Upload form
	const [uploadFile, setUploadFile] = useState(null);
	const [uploadFolder, setUploadFolder] = useState("/");
	const [uploadTitle, setUploadTitle] = useState("");
	const [uploadDescription, setUploadDescription] = useState("");
	const [uploadTags, setUploadTags] = useState("");

	const fileInputRef = useRef(null);

	useEffect(() => {
		fetchMedia();
		fetchFolders();
		fetchTags();
		fetchStorageStats();
	}, []);

	useEffect(() => {
		applyFilters();
	}, [media, selectedFolder, selectedFileType, selectedTags, searchQuery]);

	const fetchMedia = async () => {
		try {
			setLoading(true);
			const response = await mediaApi.getAll();
			if (response.success) {
				setMedia(response.media || []);
			}
		} catch (error) {
			console.error("Error fetching media:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchFolders = async () => {
		try {
			const response = await mediaApi.getFolders();
			if (response.success) {
				setFolders(response.folders || []);
			}
		} catch (error) {
			console.error("Error fetching folders:", error);
		}
	};

	const fetchTags = async () => {
		try {
			const response = await mediaApi.getTags();
			if (response.success) {
				setTags(response.tags || []);
			}
		} catch (error) {
			console.error("Error fetching tags:", error);
		}
	};

	const fetchStorageStats = async () => {
		try {
			const response = await storageApi.getStats();
			if (response.success) {
				setStorageStats(response.stats);
			}
		} catch (error) {
			console.error("Error fetching storage stats:", error);
		}
	};

	const applyFilters = () => {
		let filtered = [...media];

		if (selectedFolder) {
			filtered = filtered.filter((item) => item.folder === selectedFolder);
		}

		if (selectedFileType) {
			filtered = filtered.filter((item) => item.fileType === selectedFileType);
		}

		if (selectedTags.length > 0) {
			filtered = filtered.filter((item) =>
				selectedTags.some((tag) => item.tags?.includes(tag)),
			);
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(item) =>
					item.title?.toLowerCase().includes(query) ||
					item.originalName?.toLowerCase().includes(query) ||
					item.description?.toLowerCase().includes(query),
			);
		}

		setFilteredMedia(filtered);
	};

	const handleUpload = async (e) => {
		e.preventDefault();
		if (!uploadFile) return;

		// Check storage limit
		const limitCheck = await storageApi.checkLimit(uploadFile.size);
		if (!limitCheck.canUpload) {
			alert(
				`Storage limit exceeded! You need ${formatFileSize(uploadFile.size)} but only ${formatFileSize(limitCheck.available)} is available.`,
			);
			return;
		}

		setUploading(true);
		try {
			const folder = uploadFolder === "__new__" ? newFolder : uploadFolder;
			const response = await mediaApi.upload(uploadFile, {
				folder,
				title: uploadTitle,
				description: uploadDescription,
				tags: uploadTags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
			});

			if (response.success) {
				setShowUploadModal(false);
				resetUploadForm();
				await fetchMedia();
				await fetchFolders();
				await fetchTags();
				await fetchStorageStats();
			}
		} catch (error) {
			console.error("Upload error:", error);
			alert("Failed to upload file");
		} finally {
			setUploading(false);
		}
	};

	const handleEdit = async (e) => {
		e.preventDefault();
		if (!editingMedia) return;

		try {
			const response = await mediaApi.update(editingMedia.id, {
				title: editingMedia.title,
				description: editingMedia.description,
				folder: editingMedia.folder,
				tags: editingMedia.tags,
			});

			if (response.success) {
				setShowEditModal(false);
				setEditingMedia(null);
				await fetchMedia();
			}
		} catch (error) {
			console.error("Update error:", error);
			alert("Failed to update media");
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this file?")) return;

		try {
			const response = await mediaApi.delete(id);
			if (response.success) {
				await fetchMedia();
				await fetchStorageStats();
			}
		} catch (error) {
			console.error("Delete error:", error);
			alert("Failed to delete file");
		}
	};

	const resetUploadForm = () => {
		setUploadFile(null);
		setUploadFolder("/");
		setUploadTitle("");
		setUploadDescription("");
		setUploadTags("");
		setNewFolder("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const getFileIcon = (fileType) => {
		const icons = {
			image: (
				<svg
					className='h-12 w-12 text-primary'
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
			),
			pdf: (
				<svg
					className='h-12 w-12 text-red-500'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
					/>
				</svg>
			),
			document: (
				<svg
					className='h-12 w-12 text-blue-500'
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
			),
			video: (
				<svg
					className='h-12 w-12 text-purple-500'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
					/>
				</svg>
			),
			audio: (
				<svg
					className='h-12 w-12 text-green-500'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
					/>
				</svg>
			),
			other: (
				<svg
					className='h-12 w-12 text-gray-400'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'
					/>
				</svg>
			),
		};
		return icons[fileType] || icons.other;
	};

	const formatFileSize = (bytes) => {
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
		return (bytes / (1024 * 1024)).toFixed(2) + " MB";
	};

	const clearFilters = () => {
		setSelectedFolder("");
		setSelectedFileType("");
		setSelectedTags([]);
		setSearchQuery("");
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<PageLoading title='Loading media…' message='Preparing your gallery' />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Professional Header */}
			<div className='sticky top-0 z-40 border-b border-gray-200 bg-white shadow-md'>
				<div className='px-4 py-6 sm:px-6 lg:px-8'>
					{/* Title and Actions */}
					<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
						<div>
							<h1 className='font-anton text-3xl text-gray-900 sm:text-4xl'>
								Media Gallery
							</h1>
							<div className='font-montserrat mt-2 flex items-center gap-4 text-sm'>
								<span className='text-gray-600'>
									<span className='font-semibold text-gray-900'>
										{filteredMedia.length}
									</span>{" "}
									of {media.length} files
								</span>
								{storageStats && (
									<span className='text-gray-600'>
										<span
											className={`font-semibold ${storageStats.total.percentUsed > 90 ? "text-red-600" : storageStats.total.percentUsed > 75 ? "text-yellow-600" : "text-green-600"}`}>
											{storageStats.total.percentUsed.toFixed(1)}%
										</span>{" "}
										storage used
									</span>
								)}
							</div>
						</div>
						<button
							onClick={() => setShowUploadModal(true)}
							className='flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-montserrat font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40'>
							<svg
								className='h-5 w-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 4v16m8-8H4'
								/>
							</svg>
							Upload File
						</button>
					</div>

					{/* Storage Stats Dashboard */}
					{storageStats && (
						<div className='mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-7'>
							{/* Storage Overview Card - Compact */}
							<div className='rounded-lg border border-gray-200 bg-linear-to-br from-primary/5 to-primary/10 p-3 shadow-sm'>
								<div className='mb-2 flex items-center gap-1.5'>
									<div className='rounded bg-primary/20 p-1.5'>
										<svg
											className='h-4 w-4 text-primary'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4'
											/>
										</svg>
									</div>
									<div className='flex-1 min-w-0'>
										<p className='font-montserrat text-xs text-gray-600'>
											Storage
										</p>
										<p className='font-montserrat text-sm font-bold text-gray-900 truncate'>
											{formatFileSize(storageStats.total.used)}
										</p>
									</div>
								</div>
								<div className='mb-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200'>
									<div
										className={`h-full rounded-full transition-all ${
											storageStats.total.percentUsed > 90
												? "bg-red-500"
												: storageStats.total.percentUsed > 75
													? "bg-yellow-500"
													: "bg-green-500"
										}`}
										style={{
											width: `${Math.min(storageStats.total.percentUsed, 100)}%`,
										}}></div>
								</div>
								<p className='font-montserrat text-xs text-gray-500 truncate'>
									{formatFileSize(storageStats.total.available)} free
								</p>
							</div>

							{/* File Type Stats */}
							{Object.entries(storageStats.byType || {}).map(([type, data]) => {
								const icons = {
									image: (
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
										/>
									),
									pdf: (
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
										/>
									),
									document: (
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
										/>
									),
									video: (
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
										/>
									),
								};
								return (
									<div
										key={type}
										className='rounded-lg border border-gray-200 bg-white p-3 shadow-sm'>
										<div className='mb-1.5 flex items-center gap-1.5'>
											<div className='rounded bg-primary/10 p-1.5'>
												<svg
													className='h-4 w-4 text-primary'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'>
													{icons[type] || icons.document}
												</svg>
											</div>
											<div className='flex-1 min-w-0'>
												<p className='font-montserrat text-xs capitalize text-gray-600 truncate'>
													{type}
												</p>
												<p className='font-montserrat text-sm font-bold text-gray-900'>
													{data.count}
												</p>
											</div>
										</div>
										<p className='font-montserrat text-xs text-gray-500 truncate'>
											{formatFileSize(data.size)}
										</p>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>

			<div className='px-4 py-6 sm:px-6 lg:px-8'>
				{/* Filters */}
				<div className='mb-6 rounded-xl bg-white p-4 shadow-sm'>
					<div className='mb-4 flex items-center justify-between'>
						<h3 className='font-montserrat text-sm font-semibold text-gray-700'>
							Filters
						</h3>
						<div className='flex items-center gap-2'>
							{(selectedFolder ||
								selectedFileType ||
								selectedTags.length > 0 ||
								searchQuery) && (
								<button
									onClick={clearFilters}
									className='font-montserrat text-sm text-primary hover:underline'>
									Clear all
								</button>
							)}
							<div className='flex gap-1 rounded-lg border border-gray-200 p-1'>
								<button
									onClick={() => setViewMode("grid")}
									className={`rounded px-2 py-1 ${viewMode === "grid" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}>
									<svg
										className='h-5 w-5'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
										/>
									</svg>
								</button>
								<button
									onClick={() => setViewMode("list")}
									className={`rounded px-2 py-1 ${viewMode === "list" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}>
									<svg
										className='h-5 w-5'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M4 6h16M4 12h16M4 18h16'
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>

					<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
						{/* Search */}
						<div className='relative'>
							<input
								type='text'
								placeholder='Search files...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 font-montserrat text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
							/>
							<svg
								className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400'
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
						</div>

						{/* Folder Filter */}
						<select
							value={selectedFolder}
							onChange={(e) => setSelectedFolder(e.target.value)}
							className='rounded-lg border border-gray-300 px-4 py-2.5 font-montserrat text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'>
							<option value=''>📁 All Folders</option>
							{folders.map((folder) => (
								<option key={folder} value={folder}>
									{folder === "/" ? "📂 Root" : `📁 ${folder}`}
								</option>
							))}
						</select>

						{/* File Type Filter */}
						<select
							value={selectedFileType}
							onChange={(e) => setSelectedFileType(e.target.value)}
							className='rounded-lg border border-gray-300 px-4 py-2.5 font-montserrat text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'>
							<option value=''>🗂️ All Types</option>
							<option value='image'>🖼️ Images</option>
							<option value='pdf'>📄 PDFs</option>
							<option value='document'>📝 Documents</option>
							<option value='video'>🎥 Videos</option>
							<option value='audio'>🎵 Audio</option>
							<option value='other'>📎 Other</option>
						</select>

						{/* Tag Filter */}
						<select
							value={selectedTags[0] || ""}
							onChange={(e) =>
								setSelectedTags(e.target.value ? [e.target.value] : [])
							}
							className='rounded-lg border border-gray-300 px-4 py-2.5 font-montserrat text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'>
							<option value=''>🏷️ All Tags</option>
							{tags.map((tag) => (
								<option key={tag} value={tag}>
									{tag}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Media Grid/List */}
				{loading ? (
					<div className='min-h-96'>
						<SectionLoading title='Loading media…' size='sm' />
					</div>
				) : filteredMedia.length === 0 ? (
					<div className='rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center'>
						<div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100'>
							<svg
								className='h-10 w-10 text-gray-400'
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
						</div>
						<h3 className='font-anton mb-2 text-xl text-gray-900'>
							{searchQuery || selectedFolder || selectedFileType
								? "No files found"
								: "No files uploaded yet"}
						</h3>
						<p className='font-montserrat mb-6 text-sm text-gray-600'>
							{searchQuery || selectedFolder || selectedFileType
								? "Try adjusting your filters"
								: "Upload your first file to get started"}
						</p>
						{!searchQuery && !selectedFolder && !selectedFileType && (
							<button
								onClick={() => setShowUploadModal(true)}
								className='inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-montserrat font-semibold text-white hover:bg-primary/90'>
								<svg
									className='h-5 w-5'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 4v16m8-8H4'
									/>
								</svg>
								Upload First File
							</button>
						)}
					</div>
				) : viewMode === "grid" ? (
					<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{filteredMedia.map((item) => (
							<div
								key={item.id}
								className='group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg'>
								{/* Preview */}
								<div className='relative aspect-square overflow-hidden bg-linear-to-br from-gray-50 to-gray-100'>
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
									<div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100'></div>
								</div>

								{/* Info */}
								<div className='p-4'>
									<h3
										className='font-anton mb-1 truncate text-base text-gray-900'
										title={item.title || item.originalName}>
										{item.title || item.originalName}
									</h3>
									<div className='mb-3 flex items-center gap-2 text-xs text-gray-500'>
										<span className='font-montserrat font-medium'>
											{formatFileSize(item.size)}
										</span>
										<span>•</span>
										<span className='font-montserrat truncate'>
											{item.folder === "/" ? "Root" : item.folder}
										</span>
									</div>

									{/* Tags */}
									{item.tags && item.tags.length > 0 && (
										<div className='mb-3 flex flex-wrap gap-1'>
											{item.tags.slice(0, 2).map((tag, idx) => (
												<span
													key={idx}
													className='rounded-full bg-primary/10 px-2.5 py-1 font-montserrat text-xs font-medium text-primary'>
													{tag}
												</span>
											))}
											{item.tags.length > 2 && (
												<span className='rounded-full bg-gray-100 px-2.5 py-1 font-montserrat text-xs font-medium text-gray-600'>
													+{item.tags.length - 2}
												</span>
											)}
										</div>
									)}

									{/* Actions */}
									<div className='flex gap-2'>
										<a
											href={item.url}
											target='_blank'
											rel='noopener noreferrer'
											className='flex-1 rounded-lg border border-gray-200 px-3 py-2 text-center font-montserrat text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary'>
											View
										</a>
										<button
											onClick={() => {
												setEditingMedia(item);
												setShowEditModal(true);
											}}
											className='flex-1 rounded-lg bg-primary px-3 py-2 text-center font-montserrat text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-md'>
											Edit
										</button>
										<button
											onClick={() => handleDelete(item.id)}
											className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-600 transition-colors hover:bg-red-100'>
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
				) : (
					<div className='space-y-3'>
						{filteredMedia.map((item) => (
							<div
								key={item.id}
								className='flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md'>
								<div className='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100'>
									{item.fileType === "image" ? (
										<img
											src={item.url}
											alt={item.title}
											className='h-full w-full object-cover'
										/>
									) : (
										<div className='scale-75'>{getFileIcon(item.fileType)}</div>
									)}
								</div>
								<div className='min-w-0 flex-1'>
									<h3 className='font-anton truncate text-base text-gray-900'>
										{item.title || item.originalName}
									</h3>
									<div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500'>
										<span className='font-montserrat'>
											{formatFileSize(item.size)}
										</span>
										<span>•</span>
										<span className='font-montserrat'>
											{item.folder === "/" ? "Root" : item.folder}
										</span>
										{item.tags && item.tags.length > 0 && (
											<>
												<span>•</span>
												<div className='flex gap-1'>
													{item.tags.slice(0, 3).map((tag, idx) => (
														<span
															key={idx}
															className='rounded-full bg-primary/10 px-2 py-0.5 font-montserrat text-xs font-medium text-primary'>
															{tag}
														</span>
													))}
												</div>
											</>
										)}
									</div>
								</div>
								<div className='flex shrink-0 gap-2'>
									<a
										href={item.url}
										target='_blank'
										rel='noopener noreferrer'
										className='rounded-lg border border-gray-200 px-4 py-2 font-montserrat text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary'>
										View
									</a>
									<button
										onClick={() => {
											setEditingMedia(item);
											setShowEditModal(true);
										}}
										className='rounded-lg bg-primary px-4 py-2 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-primary/90'>
										Edit
									</button>
									<button
										onClick={() => handleDelete(item.id)}
										className='rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50'>
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
						))}
					</div>
				)}

				{/* Upload Modal */}
				{showUploadModal && (
					<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4'>
						<div className='max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl'>
							<div className='sticky top-0 z-10 border-b border-gray-200 bg-linear-to-r from-primary to-primary/90 px-4 py-4 sm:px-6 sm:py-5'>
								<div className='flex items-start justify-between gap-3'>
									<div className='flex-1'>
										<h2 className='font-anton text-xl text-white sm:text-2xl'>
											Upload File
										</h2>
										<p className='font-montserrat mt-1 text-xs text-white/80 sm:text-sm'>
											Add files to your media library
										</p>
									</div>
									<button
										onClick={() => {
											setShowUploadModal(false);
											resetUploadForm();
										}}
										className='shrink-0 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:p-2'>
										<svg
											className='h-5 w-5 sm:h-6 sm:w-6'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M6 18L18 6M6 6l12 12'
											/>
										</svg>
									</button>
								</div>
							</div>
							<form
								onSubmit={handleUpload}
								className='p-4 space-y-4 sm:p-6 sm:space-y-5'>
								{storageStats && storageStats.total.percentUsed > 85 && (
									<div
										className={`rounded-lg p-3 ${storageStats.total.percentUsed > 95 ? "bg-red-50 border border-red-200" : "bg-yellow-50 border border-yellow-200"}`}>
										<p
											className={`font-montserrat text-xs sm:text-sm font-semibold ${storageStats.total.percentUsed > 95 ? "text-red-700" : "text-yellow-700"}`}>
											⚠️ Storage{" "}
											{storageStats.total.percentUsed > 95
												? "almost full"
												: "running low"}{" "}
											({storageStats.total.percentUsed.toFixed(1)}%)
										</p>
										<p
											className={`font-montserrat mt-1 text-xs ${storageStats.total.percentUsed > 95 ? "text-red-600" : "text-yellow-600"}`}>
											{formatFileSize(storageStats.total.available)} remaining
										</p>
									</div>
								)}
								<div>
									<label className='mb-2 block font-montserrat text-xs font-semibold text-gray-700 sm:text-sm'>
										Select File <span className='text-red-500'>*</span>
									</label>
									<div className='relative'>
										<input
											ref={fileInputRef}
											type='file'
											onChange={(e) => {
												const file = e.target.files[0];
												setUploadFile(file);
												if (file && !uploadTitle) {
													setUploadTitle(file.name);
												}
											}}
											required
											className='w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 px-3 py-6 text-center text-xs transition-colors hover:border-primary focus:border-primary focus:outline-none file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:font-montserrat file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20 sm:px-4 sm:py-8 sm:text-sm file:sm:px-4 file:sm:py-2 file:sm:text-sm'
										/>
									</div>
									{uploadFile && (
										<div className='mt-2 rounded-lg bg-primary/5 p-2.5 sm:p-3'>
											<p className='font-montserrat text-xs text-gray-700 sm:text-sm'>
												<span className='font-semibold'>Selected:</span>{" "}
												{uploadFile.name}
											</p>
											<p className='font-montserrat mt-1 text-xs text-gray-600'>
												Size: {formatFileSize(uploadFile.size)}
											</p>
										</div>
									)}
								</div>

								<div className='grid gap-4 sm:gap-5'>
									<div>
										<label className='mb-2 block font-montserrat text-xs font-semibold text-gray-700 sm:text-sm'>
											Folder
										</label>
										<select
											value={uploadFolder}
											onChange={(e) => setUploadFolder(e.target.value)}
											className='mb-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-4 sm:py-2.5 sm:text-sm'>
											<option value='/'>📂 Root Folder</option>
											{folders.map((folder) => (
												<option key={folder} value={folder}>
													📁 {folder}
												</option>
											))}
											<option value='__new__'>➕ Create New Folder</option>
										</select>
										{uploadFolder === "__new__" && (
											<input
												type='text'
												placeholder='Enter new folder name'
												value={newFolder}
												onChange={(e) => setNewFolder(e.target.value)}
												className='w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-4 sm:py-2.5 sm:text-sm'
											/>
										)}
									</div>

									<div>
										<label className='mb-2 block font-montserrat text-xs font-semibold text-gray-700 sm:text-sm'>
											Title
										</label>
										<input
											type='text'
											value={uploadTitle}
											onChange={(e) => setUploadTitle(e.target.value)}
											placeholder='Optional display title'
											className='w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-4 sm:py-2.5 sm:text-sm'
										/>
									</div>

									<div>
										<label className='mb-2 block font-montserrat text-xs font-semibold text-gray-700 sm:text-sm'>
											Description
										</label>
										<textarea
											value={uploadDescription}
											onChange={(e) => setUploadDescription(e.target.value)}
											rows={3}
											placeholder='Add a description...'
											className='w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-4 sm:py-2.5 sm:text-sm'
										/>
									</div>

									<div>
										<label className='mb-2 block font-montserrat text-xs font-semibold text-gray-700 sm:text-sm'>
											Tags
										</label>
										<input
											type='text'
											value={uploadTags}
											onChange={(e) => setUploadTags(e.target.value)}
											placeholder='design, photo, document (comma separated)'
											className='w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-4 sm:py-2.5 sm:text-sm'
										/>
										<p className='mt-1.5 font-montserrat text-xs text-gray-500'>
											Separate tags with commas
										</p>
									</div>
								</div>

								<div className='flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:gap-3 sm:pt-5'>
									<button
										type='button'
										onClick={() => {
											setShowUploadModal(false);
											resetUploadForm();
										}}
										className='w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 font-montserrat text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 sm:flex-1 sm:py-3'>
										Cancel
									</button>
									<button
										type='submit'
										disabled={uploading}
										className='w-full rounded-lg bg-primary px-4 py-2.5 font-montserrat text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:flex-1 sm:py-3'>
										{uploading ? (
											<span className='flex items-center justify-center gap-2'>
												<svg
													className='h-4 w-4 animate-spin sm:h-5 sm:w-5'
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
												Uploading...
											</span>
										) : (
											"Upload File"
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Edit Modal */}
				{showEditModal && editingMedia && (
					<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4'>
						<div className='max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl'>
							<div className='sticky top-0 z-10 border-b border-gray-200 bg-linear-to-r from-primary to-primary/90 px-4 py-4 sm:px-6 sm:py-5'>
								<div className='flex items-start justify-between gap-3'>
									<div className='flex-1'>
										<h2 className='font-anton text-xl text-white sm:text-2xl'>
											Edit File
										</h2>
										<p className='font-montserrat mt-1 text-xs text-white/80 sm:text-sm'>
											Update file information
										</p>
									</div>
									<button
										onClick={() => {
											setShowEditModal(false);
											setEditingMedia(null);
										}}
										className='shrink-0 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:p-2'>
										<svg
											className='h-5 w-5 sm:h-6 sm:w-6'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M6 18L18 6M6 6l12 12'
											/>
										</svg>
									</button>
								</div>
							</div>
							<form
								onSubmit={handleEdit}
								className='p-4 space-y-4 sm:p-6 sm:space-y-5'>
								{editingMedia.fileType === "image" && (
									<div className='overflow-hidden rounded-lg'>
										<img
											src={editingMedia.url}
											alt={editingMedia.title}
											className='h-48 w-full object-cover'
										/>
									</div>
								)}

								<div className='grid gap-4 sm:gap-5'>
									<div>
										<label className='mb-2 block font-montserrat text-xs font-semibold text-gray-700 sm:text-sm'>
											Title
										</label>
										<input
											type='text'
											value={editingMedia.title || ""}
											onChange={(e) =>
												setEditingMedia({
													...editingMedia,
													title: e.target.value,
												})
											}
											placeholder='Display title'
											className='w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-4 sm:py-2.5 sm:text-sm'
										/>
									</div>

									<div>
										<label className='mb-2 block font-montserrat text-xs font-semibold text-gray-700 sm:text-sm'>
											Description
										</label>
										<textarea
											value={editingMedia.description || ""}
											onChange={(e) =>
												setEditingMedia({
													...editingMedia,
													description: e.target.value,
												})
											}
											rows={3}
											placeholder='Add a description...'
											className='w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-4 sm:py-2.5 sm:text-sm'
										/>
									</div>

									<div>
										<label className='mb-2 block font-montserrat text-xs font-semibold text-gray-700 sm:text-sm'>
											Folder
										</label>
										<select
											value={editingMedia.folder || "/"}
											onChange={(e) =>
												setEditingMedia({
													...editingMedia,
													folder: e.target.value,
												})
											}
											className='w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-4 sm:py-2.5 sm:text-sm'>
											<option value='/'>📂 Root Folder</option>
											{folders.map((folder) => (
												<option key={folder} value={folder}>
													📁 {folder}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className='mb-2 block font-montserrat text-xs font-semibold text-gray-700 sm:text-sm'>
											Tags
										</label>
										<input
											type='text'
											value={(editingMedia.tags || []).join(", ")}
											onChange={(e) =>
												setEditingMedia({
													...editingMedia,
													tags: e.target.value
														.split(",")
														.map((t) => t.trim())
														.filter(Boolean),
												})
											}
											placeholder='design, photo, document'
											className='w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-montserrat focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-4 sm:py-2.5 sm:text-sm'
										/>
										<p className='mt-1.5 font-montserrat text-xs text-gray-500'>
											Separate tags with commas
										</p>
									</div>
								</div>

								<div className='flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:gap-3 sm:pt-5'>
									<button
										type='button'
										onClick={() => {
											setShowEditModal(false);
											setEditingMedia(null);
										}}
										className='w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 font-montserrat text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 sm:flex-1 sm:py-3'>
										Cancel
									</button>
									<button
										type='submit'
										className='w-full rounded-lg bg-primary px-4 py-2.5 font-montserrat text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 sm:flex-1 sm:py-3'>
										Save Changes
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
