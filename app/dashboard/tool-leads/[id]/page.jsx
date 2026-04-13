"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toolLeadsApi from "../../../lib/api/toolLeads";
import { SectionLoading } from "../../../../components/LoadingState";

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

function ReadOnlyField({ label, value }) {
	return (
		<div>
			<p className='text-xs font-semibold tracking-wide text-gray-500 uppercase'>
				{label}
			</p>
			<p className='mt-1 text-sm text-gray-800 wrap-break-word'>{value || "-"}</p>
		</div>
	);
}

export default function ToolLeadViewPage() {
	const { id } = useParams();
	const router = useRouter();

	const [toolLead, setToolLead] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		if (!id) return;

		toolLeadsApi
			.getById(id)
			.then((data) => {
				if (data.success && data.toolLead) {
					setToolLead(data.toolLead);
				} else {
					setError("Tool lead not found.");
				}
			})
			.catch(() => setError("Failed to load tool lead."))
			.finally(() => setLoading(false));
	}, [id]);

	const submittedText = useMemo(() => {
		if (!toolLead) return "-";

		return new Date(toolLead.submittedAt || toolLead.createdAt).toLocaleDateString(
			"en-US",
			{
				weekday: "short",
				month: "long",
				day: "numeric",
				year: "numeric",
			},
		);
	}, [toolLead]);

	const handleDelete = async () => {
		if (!confirm("Delete this lead submission?")) return;

		setDeleting(true);
		try {
			await toolLeadsApi.delete(id);
			router.push("/dashboard/tool-leads");
		} catch {
			alert("Failed to delete lead submission.");
			setDeleting(false);
		}
	};

	if (loading) {
		return <SectionLoading />;
	}

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center py-20 text-gray-500'>
				<p className='mb-4 text-lg font-montserrat'>{error}</p>
				<Link href='/dashboard/tool-leads' className='text-primary underline'>
					Back to Tool Leads
				</Link>
			</div>
		);
	}

	return (
		<div>
			<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
				<div className='flex items-center gap-3'>
					<Link
						href='/dashboard/tool-leads'
						className='flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-montserrat text-gray-600 transition-colors hover:border-primary hover:text-primary'>
						<svg
							className='h-4 w-4'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M15 19l-7-7 7-7'
							/>
						</svg>
						Back
					</Link>
					<div>
						<h1 className='font-anton text-3xl text-gray-900'>
							{toolLead?.fullName || "Tool Lead Detail"}
						</h1>
						<p className='font-montserrat mt-1 text-sm text-gray-500'>
							Submitted on {submittedText}
						</p>
					</div>
				</div>

				<button
					onClick={handleDelete}
					disabled={deleting}
					className='flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50'>
					<svg
						className='h-4 w-4'
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
					{deleting ? "Deleting..." : "Delete Lead"}
				</button>
			</div>

			<div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-3'>
				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<p className='text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase'>
						Source
					</p>
					<p className='mt-2 text-2xl font-semibold text-gray-900'>
						{toolLead?.sourceType === "newsletter" ? "Newsletter" : "Website"}
					</p>
				</div>
				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<p className='text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase'>
						Tool
					</p>
					<p className='mt-2 text-lg font-semibold text-gray-900'>
						{formatToolPage(toolLead?.toolPage)}
					</p>
					<p className='mt-1 text-xs text-gray-500 wrap-break-word'>
						{toolLead?.toolPage || "-"}
					</p>
				</div>
				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<p className='text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase'>
						Page URL
					</p>
					<p className='mt-2 text-sm text-gray-800 break-all'>
						{toolLead?.pageUrl || "-"}
					</p>
				</div>
			</div>

			<div className='mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
				<h2 className='font-montserrat mb-5 text-base font-semibold text-gray-800'>
					Contact Details
				</h2>
				<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
					<ReadOnlyField label='Full Name' value={toolLead?.fullName} />
					<ReadOnlyField label='Email' value={toolLead?.email} />
					<ReadOnlyField label='Phone' value={toolLead?.phone} />
					<ReadOnlyField label='Company' value={toolLead?.company} />
					<ReadOnlyField label='Role' value={toolLead?.role} />
					<ReadOnlyField
						label='Submitted At'
						value={new Date(
							toolLead?.submittedAt || toolLead?.createdAt,
						).toLocaleString("en-US")}
					/>
				</div>
			</div>

			<div className='mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
				<h2 className='font-montserrat mb-5 text-base font-semibold text-gray-800'>
					Attribution Details
				</h2>
				<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
					<ReadOnlyField
						label='UTM Source'
						value={toolLead?.sourceDetails?.source}
					/>
					<ReadOnlyField
						label='UTM Medium'
						value={toolLead?.sourceDetails?.medium}
					/>
					<ReadOnlyField
						label='UTM Campaign'
						value={toolLead?.sourceDetails?.campaign}
					/>
					<ReadOnlyField
						label='UTM Term'
						value={toolLead?.sourceDetails?.term}
					/>
					<ReadOnlyField
						label='UTM Content'
						value={toolLead?.sourceDetails?.content}
					/>
					<ReadOnlyField
						label='Referrer'
						value={toolLead?.sourceDetails?.referrer}
					/>
					<ReadOnlyField
						label='User Agent'
						value={toolLead?.meta?.userAgent}
					/>
					<ReadOnlyField
						label='IP Address'
						value={toolLead?.meta?.ipAddress}
					/>
				</div>
			</div>

			<div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
				<h2 className='font-montserrat mb-3 text-base font-semibold text-gray-800'>
					Case Notes
				</h2>
				<p className='text-sm leading-relaxed text-gray-700 whitespace-pre-wrap'>
					{toolLead?.notes || "-"}
				</p>
			</div>
		</div>
	);
}