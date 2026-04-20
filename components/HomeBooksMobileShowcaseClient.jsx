"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const HomeCard = dynamic(() => import("./HomeCard"));

export default function HomeBooksMobileShowcaseClient({ homeCardData = [] }) {
	const [showAll, setShowAll] = useState(false);

	if (homeCardData.length === 0) {
		return (
			<div className='mx-auto mt-8 grid grid-cols-1 gap-8 sm:hidden'>
				<div className='col-span-2 py-12 text-center text-gray-500'>
					<p>No home books available at the moment.</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className='mx-auto mt-8 grid grid-cols-1 gap-8 sm:hidden'>
				{homeCardData
					.slice(
						1,
						showAll ? homeCardData.length - 1 : Math.min(7, homeCardData.length),
					)
					.map((item, i) => (
						<HomeCard
							key={item.id}
							uid={`${item.id}-mobile-${i + 1}`}
							alignIndex={i + 1}
							icon={item.icon}
							title={item.title}
							subtitle={item.subtitle}
							description={item.description}
							slug={item.slug}
							bannerImage={item.image}
						/>
					))}
			</div>

			<div className='mt-4 text-white sm:mt-10 md:mt-16 sm:hidden'>
				{showAll && homeCardData.length > 5 && (
					<div className='flex w-full justify-center'>
						<div className='w-full block sm:hidden'>
							<HomeCard
								uid={`${homeCardData[homeCardData.length - 1].id}-card-mobile-last-mobile-expanded`}
								alignIndex={1}
								icon={homeCardData[homeCardData.length - 1].icon}
								title={homeCardData[homeCardData.length - 1].title}
								subtitle={homeCardData[homeCardData.length - 1].subtitle}
								description={homeCardData[homeCardData.length - 1].description}
								slug={homeCardData[homeCardData.length - 1].slug}
								bannerImage={homeCardData[homeCardData.length - 1].image}
							/>
						</div>
					</div>
				)}
			</div>

			{homeCardData.length > 5 && (
				<div className='mt-7 flex justify-center sm:hidden'>
					<style>{`
						.show-toggle-btn {
							animation: showToggleFloat 2.5s ease-in-out infinite;
						}
						.show-toggle-btn img {
							transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
						}
						.show-toggle-btn:hover img {
							transform: rotate(-2deg) scale(1.08);
						}
						@keyframes showToggleFloat {
							0%, 100% { transform: translateY(0px); }
							50% { transform: translateY(-8px); }
						}
					`}</style>
					<button
						onClick={() => setShowAll(!showAll)}
						className='cursor-pointer w-51.25 show-toggle-btn'>
						{showAll ? (
							<Image
								src='/svgs/show-less.svg'
								alt='Show Less'
								width={1000}
								height={1000}
							/>
						) : (
							<Image
								src='/svgs/show-more.svg'
								alt='Show All'
								width={1000}
								height={1000}
							/>
						)}
					</button>
				</div>
			)}
		</>
	);
}
