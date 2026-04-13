"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import referralsApi from "../../../lib/api/referrals";
import Form from "../../../../components/Forms/Referral";
import { SectionLoading } from "../../../../components/LoadingState";

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp"];

function ImageLightbox({ src, name, onClose }) {
	const handleKey = useCallback(
		(e) => { if (e.key === "Escape") onClose(); },
		[onClose],
	);
	useEffect(() => {
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [handleKey]);

	return (
		<div
			className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4"
			onClick={onClose}>
			<div
				className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
				onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				<div className="flex w-full items-center justify-between rounded-t-xl bg-gray-900 px-4 py-2">
					<span className="truncate text-sm font-medium text-white">{name}</span>
					<div className="flex items-center gap-2 ml-4 shrink-0">
						<a
							href={src}
							download={name}
							className="rounded bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
							onClick={(e) => e.stopPropagation()}>
							Download
						</a>
						<button
							onClick={onClose}
							className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
							<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>
				{/* Image */}
				<div className="relative w-full overflow-hidden rounded-b-xl bg-gray-800" style={{ maxHeight: "80vh" }}>
					<img
						src={src}
						alt={name}
						className="mx-auto block max-h-[80vh] max-w-full object-contain"
					/>
				</div>
			</div>
		</div>
	);
}

export default function ReferralViewPage() {
	const { id } = useParams();
	const router = useRouter();
	const [referral, setReferral] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [deleting, setDeleting] = useState(false);
	const [lightbox, setLightbox] = useState(null); // { src, name }

	useEffect(() => {
		if (!id) return;
		referralsApi
			.getById(id)
			.then((data) => {
				if (data.success && data.referral) {
					setReferral(data.referral);
				} else {
					setError("Referral not found.");
				}
			})
			.catch(() => setError("Failed to load referral."))
			.finally(() => setLoading(false));
	}, [id]);

	const handleDelete = async () => {
		if (!confirm("Delete this referral? This will also remove uploaded files.")) return;
		setDeleting(true);
		try {
			await referralsApi.delete(id);
			router.push("/dashboard/referrals");
		} catch {
			alert("Failed to delete referral.");
			setDeleting(false);
		}
	};

	if (loading) return <SectionLoading />;

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center py-20 text-gray-500'>
				<p className='mb-4 text-lg font-montserrat'>{error}</p>
				<Link href='/dashboard/referrals' className='text-primary underline'>
					Back to Referrals
				</Link>
			</div>
		);
	}

	const uploadedFiles = referral?.uploadedFiles || [];

	return (
		<div>
			{/* Lightbox */}
			{lightbox && (
				<ImageLightbox
					src={lightbox.src}
					name={lightbox.name}
					onClose={() => setLightbox(null)}
				/>
			)}
			{/* Top Bar */}
			<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
				<div className='flex items-center gap-3'>
					<Link
						href='/dashboard/referrals'
						className='flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-montserrat text-gray-600 hover:border-primary hover:text-primary transition-colors'>
						<svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
								d='M15 19l-7-7 7-7' />
						</svg>
						Back
					</Link>
					<div>
						<h1 className='font-anton text-3xl text-gray-900'>
							{referral.referringPartyName || "Referral Detail"}
						</h1>
						<p className='font-montserrat mt-1 text-sm text-gray-500'>
							Submitted on{" "}
							{new Date(referral.submittedAt || referral.createdAt).toLocaleDateString("en-US", {
								weekday: "short", month: "long", day: "numeric", year: "numeric",
							})}
						</p>
					</div>
				</div>
				<button
					onClick={handleDelete}
					disabled={deleting}
					className='flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50'>
					<svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
							d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
					</svg>
					{deleting ? "Deleting…" : "Delete Referral"}
				</button>
			</div>

			{/* Uploaded Files */}
			{uploadedFiles.length > 0 && (
				<div className='mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
					<h2 className='font-montserrat mb-4 text-base font-semibold text-gray-800'>
						Uploaded Documents ({uploadedFiles.length})
					</h2>
					<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
						{uploadedFiles.map((file, i) => {
							const filePath = typeof file === "string" ? file : file.path;
							const originalName = (typeof file === "object" && file.originalName) ? file.originalName : filePath.split("/").pop();
							const ext = originalName.split(".").pop().toLowerCase();
							const isImage = IMAGE_EXTS.includes(ext);
							const isPdf = ext === "pdf";
							const sizeLabel = (typeof file === "object" && file.size) ? " · " + (file.size / 1024).toFixed(1) + " KB" : "";
							const mimeLabel = (typeof file === "object" && file.mimeType) ? file.mimeType : "";

							if (isImage) {
								return (
									<button
										key={i}
										type="button"
										onClick={() => setLightbox({ src: filePath, name: originalName })}
										className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 hover:border-primary hover:shadow-md transition-all text-left">
										<div className="relative h-40 w-full overflow-hidden bg-gray-200">
											<img
												src={filePath}
												alt={originalName}
												className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
											/>
											<div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
												<svg className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
												</svg>
											</div>
										</div>
										<div className="px-3 py-2">
											<p className="truncate text-sm font-medium text-gray-800">{originalName}</p>
											{(mimeLabel || sizeLabel) && (
												<p className="text-xs text-gray-400">{mimeLabel}{sizeLabel}</p>
											)}
										</div>
									</button>
								);
							}

							return (
								<a
									key={i}
									href={filePath}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-primary hover:bg-primary/5 hover:border-primary transition-colors">
									<span className="text-2xl">{isPdf ? "📄" : "📎"}</span>
									<div className="flex flex-col min-w-0">
										<span className="truncate font-medium">{originalName}</span>
										{(mimeLabel || sizeLabel) && (
											<span className="text-xs text-gray-400">{mimeLabel}{sizeLabel}</span>
										)}
									</div>
									<svg className="ml-auto h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
									</svg>
								</a>
							);
						})}
					</div>
				</div>
			)}

			{/* Referral Form in ReadOnly Mode */}
			<div className='rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
				<div className='border-b border-gray-200 bg-primary/5 px-6 py-4'>
					<h2 className='font-montserrat font-semibold text-gray-800'>Form Data</h2>
				</div>
				<div className='p-4 sm:p-6'>
					<Form readOnly={true} initialData={referral} />
				</div>
			</div>
		</div>
	);
}
