"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardSidebar({
	sidebarMode,
	isMobileMenuOpen,
	setIsMobileMenuOpen,
}) {
	const pathname = usePathname();
	const router = useRouter();
	const { user, logout } = useAuth();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const isHidden = sidebarMode === "hidden";
	const isIconOnly = sidebarMode === "icon" && !isMobileMenuOpen;

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await logout();
			router.push("/login");
		} finally {
			setIsLoggingOut(false);
		}
	};

	const menuItems = [
		{
			name: "Dashboard",
			href: "/dashboard",
			icon: (
				<svg
					className='h-6 w-6'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
					/>
				</svg>
			),
		},
		{
			name: "Blogs",
			href: "/dashboard/blogs",
			icon: (
				<svg
					className='h-6 w-6'
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
		},
		{
			name: "Home Books",
			href: "/dashboard/homeBooks",
			icon: (
				<svg
					className='h-6 w-6'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
					/>
				</svg>
			),
		},
		{
			name: "Gallery",
			href: "/dashboard/gallery",
			icon: (
				<svg
					className='h-6 w-6'
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
		},
		{
			name: "Analytics",
			href: "/dashboard/analytics",
			icon: (
				<svg
					className='h-6 w-6'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
					/>
				</svg>
			),
		},
		{
			name: "Settings",
			href: "/dashboard/settings",
			icon: (
				<svg
					className='h-6 w-6'
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
			),
		},
		{
			name: "AI Settings",
			href: "/dashboard/ai-settings",
			icon: (
				<svg
					className='h-6 w-6'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.332 2.798H4.13c-1.36 0-2.332-1.797-1.332-2.798L4.2 15.3'
					/>
				</svg>
			),
		},
		{
			name: "Referrals",
			href: "/dashboard/referrals",
			icon: (
				<svg
					className='h-6 w-6'
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
		},
		{
			name: "Tool Leads",
			href: "/dashboard/tool-leads",
			icon: (
				<svg
					className='h-6 w-6'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M8 10h8M8 14h5M6 6h12a2 2 0 012 2v10a2 2 0 01-2 2H9l-5 3V8a2 2 0 012-2z'
					/>
				</svg>
			),
		},
		{
			name: "Newsletter Subs",
			href: "/dashboard/newsletter-subscriptions",
			icon: (
				<svg
					className='h-6 w-6'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M3 8l8.89 5.26a2.2 2.2 0 002.22 0L23 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
					/>
				</svg>
			),
		},
		{
			name: "Vendors",
			href: "/dashboard/vendors",
			icon: (
				<svg
					className='h-6 w-6'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
					/>
				</svg>
			),
		},
		{
			name: "Profile",
			href: "/dashboard/profile",
			icon: (
				<svg
					className='h-6 w-6'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
					/>
				</svg>
			),
		},
	];

	return (
		<>
			<aside
				className={`fixed left-0 top-0 z-40 h-screen w-72 transform border-r border-secondary/40 bg-primary text-white shadow-2xl transition-all duration-300 ${
					isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
				} lg:translate-x-0 ${
					isHidden
						? "lg:-translate-x-full lg:opacity-0 lg:pointer-events-none"
						: "lg:opacity-100 lg:pointer-events-auto"
				} ${isIconOnly ? "lg:w-24" : "lg:w-72"}`}>
				<div className='flex h-full flex-col'>
					<div
						className={`border-b border-secondary/30 ${isIconOnly ? "px-3 py-3" : "px-5 py-4"}`}>
						<div
							className={`flex items-center ${isIconOnly ? "justify-center" : "gap-3"}`}>
							<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-white'>
								{user?.name?.charAt(0).toUpperCase() || "U"}
							</div>
							{!isIconOnly && (
								<div>
									<p className='text-sm font-semibold text-white'>
										{user?.name || "User"}
									</p>
									<p className='max-w-45 truncate text-xs text-white/70'>
										{user?.email || "No email"}
									</p>
								</div>
							)}
						</div>
					</div>

					<nav className='flex-1 space-y-1.5 overflow-y-auto p-3'>
						{menuItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.name}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									title={isIconOnly ? item.name : ""}
									className={`group flex items-center rounded-xl border py-2.5 transition-all ${
										isIconOnly ? "justify-center px-2" : "gap-3 px-3"
									} ${
										isActive
											? "border-secondary/60 bg-secondary/25 text-white shadow-md"
											: "border-transparent text-white/80 hover:border-secondary/40 hover:bg-secondary/15 hover:text-white"
									}`}>
									<span className='shrink-0'>{item.icon}</span>
									{!isIconOnly && (
										<span className='font-medium'>{item.name}</span>
									)}
								</Link>
							);
						})}
					</nav>

					<div className='border-t border-secondary/30 p-3'>
						<button
							onClick={handleLogout}
							disabled={isLoggingOut}
							title={isIconOnly ? "Logout" : ""}
							className={`flex w-full items-center rounded-xl border border-secondary/60 bg-secondary/20 py-2.5 text-white transition-colors hover:bg-secondary/30 disabled:cursor-not-allowed disabled:opacity-60 ${
								isIconOnly ? "justify-center px-2" : "gap-3 px-3"
							}`}>
							<svg
								className='h-5 w-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
								/>
							</svg>
							{!isIconOnly && (
								<span className='font-medium'>
									{isLoggingOut ? "Logging out..." : "Logout"}
								</span>
							)}
						</button>
					</div>
				</div>
			</aside>

			{isMobileMenuOpen && (
				<div
					onClick={() => setIsMobileMenuOpen(false)}
					className='fixed inset-0 z-30 bg-primary/50 lg:hidden'
				/>
			)}
		</>
	);
}
