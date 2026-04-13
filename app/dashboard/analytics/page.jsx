"use client";

export default function AnalyticsPage() {
	return (
		<div>
			<div className='mb-8'>
				<h1 className='font-anton text-4xl text-gray-800'>Analytics</h1>
				<p className='font-montserrat mt-2 text-gray-600'>
					Track your performance and insights
				</p>
			</div>
			<div className='grid gap-6 lg:grid-cols-2'>
				<div className='rounded-xl bg-white p-6 shadow-lg'>
					<h2 className='font-anton mb-4 text-2xl text-gray-800'>
						Traffic Overview
					</h2>
					<div className='flex h-64 items-center justify-center rounded-lg bg-tealSoft'>
						<p className='font-montserrat text-gray-600'>
							Chart visualization would go here
						</p>
					</div>
				</div>

				<div className='rounded-xl bg-white p-6 shadow-lg'>
					<h2 className='font-anton mb-4 text-2xl text-gray-800'>
						Revenue Growth
					</h2>
					<div className='flex h-64 items-center justify-center rounded-lg bg-gray-50'>
						<p className='font-montserrat text-gray-600'>
							Chart visualization would go here
						</p>
					</div>
				</div>

				<div className='rounded-xl bg-white p-6 shadow-lg lg:col-span-2'>
					<h2 className='font-anton mb-4 text-2xl text-gray-800'>
						User Engagement
					</h2>
					<div className='flex h-64 items-center justify-center rounded-lg bg-gray-50'>
						<p className='font-montserrat text-gray-600'>
							Chart visualization would go here
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
