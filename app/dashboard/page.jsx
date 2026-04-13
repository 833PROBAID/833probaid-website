"use client";

import { useAuth } from "../../contexts/AuthContext";

export default function DashboardPage() {
	const { user } = useAuth();

	const stats = [
		{
			name: "Total Sales",
			value: "$45,231",
			change: "+12.5%",
			icon: (
				<svg
					className='h-8 w-8'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
					/>
				</svg>
			),
			color: "bg-primary",
		},
		{
			name: "Active Users",
			value: "2,345",
			change: "+8.2%",
			icon: (
				<svg
					className='h-8 w-8'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
					/>
				</svg>
			),
			color: "bg-primaryDark",
		},
		{
			name: "Pending Tasks",
			value: "24",
			change: "-3.1%",
			icon: (
				<svg
					className='h-8 w-8'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
					/>
				</svg>
			),
			color: "bg-secondary",
		},
		{
			name: "Revenue",
			value: "$123,456",
			change: "+23.5%",
			icon: (
				<svg
					className='h-8 w-8'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
					/>
				</svg>
			),
			color: "bg-primary",
		},
	];

	const recentActivity = [
		{
			id: 1,
			action: "New user registered",
			time: "2 minutes ago",
			type: "success",
		},
		{
			id: 2,
			action: "Payment received",
			time: "15 minutes ago",
			type: "success",
		},
		{
			id: 3,
			action: "Server error reported",
			time: "1 hour ago",
			type: "error",
		},
		{
			id: 4,
			action: "New feature deployed",
			time: "3 hours ago",
			type: "info",
		},
		{
			id: 5,
			action: "Database backup completed",
			time: "5 hours ago",
			type: "success",
		},
	];

	return (
		<div>
			<div className='mb-8'>
				<h1 className='font-anton text-4xl text-gray-800'>
					Welcome back, {user?.name || "User"}!
				</h1>
				<p className='font-montserrat mt-2 text-gray-600'>
					Here's what's happening with your dashboard today.
				</p>
			</div>

			<div className='mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
				{stats.map((stat, index) => (
					<div
						key={index}
						className='overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:scale-105'>
						<div className={`${stat.color} p-4`}>
							<div className='text-white'>{stat.icon}</div>
						</div>
						<div className='p-4'>
							<p className='font-montserrat text-sm font-medium text-gray-600'>
								{stat.name}
							</p>
							<div className='mt-2 flex items-baseline justify-between'>
								<p className='font-anton text-2xl text-gray-800'>
									{stat.value}
								</p>
								<span
									className={`text-sm font-semibold ${
										stat.change.startsWith("+")
											? "text-green-600"
											: "text-red-600"
									}`}>
									{stat.change}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				<div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
					<h2 className='font-anton mb-4 text-2xl text-gray-900'>
						Recent Activity
					</h2>
					<div className='space-y-4'>
						{recentActivity.map((activity) => (
							<div
								key={activity.id}
								className='flex items-start space-x-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50'>
								<div
									className={`mt-1 h-2 w-2 rounded-full ${
										activity.type === "success"
											? "bg-green-500"
											: activity.type === "error"
												? "bg-red-500"
												: "bg-blue-500"
									}`}></div>
								<div className='flex-1'>
									<p className='font-montserrat text-sm font-medium text-gray-800'>
										{activity.action}
									</p>
									<p className='font-montserrat text-xs text-gray-500'>
										{activity.time}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
					<h2 className='font-anton mb-4 text-2xl text-gray-900'>
						Quick Actions
					</h2>
					<div className='grid grid-cols-2 gap-4'>
						<button className='rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-primary hover:shadow-md'>
							<svg
								className='mb-2 h-6 w-6 text-primary'
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
							<p className='font-montserrat text-sm font-semibold text-gray-900'>
								New Project
							</p>
						</button>
						<button className='rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-primary hover:shadow-md'>
							<svg
								className='mb-2 h-6 w-6 text-primary'
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
							<p className='font-montserrat text-sm font-semibold text-gray-900'>
								Generate Report
							</p>
						</button>
						<button className='rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-primary hover:shadow-md'>
							<svg
								className='mb-2 h-6 w-6 text-primary'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
								/>
							</svg>
							<p className='font-montserrat text-sm font-semibold text-gray-900'>
								Invite Team
							</p>
						</button>
						<button className='rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-primary hover:shadow-md'>
							<svg
								className='mb-2 h-6 w-6 text-primary'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
								/>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
								/>
							</svg>
							<p className='font-montserrat text-sm font-semibold text-gray-900'>
								Settings
							</p>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
