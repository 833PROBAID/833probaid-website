"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import newsletterSubscriptionsApi from "../../../lib/api/newsletterSubscriptions";
import { SectionLoading } from "../../../../components/LoadingState";

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

export default function NewsletterSubscriptionViewPage() {
	const { id } = useParams();
	const router = useRouter();

	const [subscription, setSubscription] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		if (!id) return;

		newsletterSubscriptionsApi
			.getById(id)
			.then((data) => {
				if (data.success && data.subscription) {
					setSubscription(data.subscription);
				} else {
					setError("Newsletter subscription not found.");
				}
			})
			.catch(() => setError("Failed to load newsletter subscription."))
			.finally(() => setLoading(false));
	}, [id]);

	const submittedText = useMemo(() => {
		if (!subscription) return "-";

		return new Date(
			subscription.submittedAt || subscription.createdAt,
		).toLocaleDateString("en-US", {
			weekday: "short",
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	}, [subscription]);

	const handleDelete = async () => {
		if (!confirm("Delete this newsletter subscription?")) return;

		setDeleting(true);
		try {
			await newsletterSubscriptionsApi.delete(id);
			router.push("/dashboard/newsletter-subscriptions");
		} catch {
			alert("Failed to delete newsletter subscription.");
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
				<Link href='/dashboard/newsletter-subscriptions' className='text-primary underline'>
					Back to Newsletter Subscriptions
				</Link>
			</div>
		);
	}

	return (
		<div>
			<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
				<div className='flex items-center gap-3'>
					<Link
						href='/dashboard/newsletter-subscriptions'
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
							{subscription?.fullName || "Newsletter Subscription"}
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
					{deleting ? "Deleting..." : "Delete Subscription"}
				</button>
			</div>

			<div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-3'>
				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<p className='text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase'>
						Source
					</p>
					<p className='mt-2 text-2xl font-semibold text-gray-900'>
						{subscription?.sourceType === "newsletter" ? "Newsletter" : "Website"}
					</p>
				</div>
				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<p className='text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase'>
						Capture Point
					</p>
					<p className='mt-2 text-lg font-semibold text-gray-900'>
						{subscription?.capturePoint || "-"}
					</p>
				</div>
				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<p className='text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase'>
						Page URL
					</p>
					<p className='mt-2 text-sm text-gray-800 break-all'>
						{subscription?.pageUrl || "-"}
					</p>
				</div>
			</div>

			<div className='mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
				<h2 className='font-montserrat mb-5 text-base font-semibold text-gray-800'>
					Subscriber Details
				</h2>
				<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
					<ReadOnlyField label='Full Name' value={subscription?.fullName} />
					<ReadOnlyField label='Email' value={subscription?.email} />
					<ReadOnlyField label='Phone' value={subscription?.phone} />
					<ReadOnlyField
						label='Submitted At'
						value={new Date(
							subscription?.submittedAt || subscription?.createdAt,
						).toLocaleString("en-US")}
					/>
				</div>
			</div>

			<div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
				<h2 className='font-montserrat mb-5 text-base font-semibold text-gray-800'>
					Attribution Details
				</h2>
				<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
					<ReadOnlyField
						label='UTM Source'
						value={subscription?.sourceDetails?.source}
					/>
					<ReadOnlyField
						label='UTM Medium'
						value={subscription?.sourceDetails?.medium}
					/>
					<ReadOnlyField
						label='UTM Campaign'
						value={subscription?.sourceDetails?.campaign}
					/>
					<ReadOnlyField
						label='UTM Term'
						value={subscription?.sourceDetails?.term}
					/>
					<ReadOnlyField
						label='UTM Content'
						value={subscription?.sourceDetails?.content}
					/>
					<ReadOnlyField
						label='Referrer'
						value={subscription?.sourceDetails?.referrer}
					/>
					<ReadOnlyField label='User Agent' value={subscription?.meta?.userAgent} />
					<ReadOnlyField label='IP Address' value={subscription?.meta?.ipAddress} />
				</div>
			</div>
		</div>
	);
}
