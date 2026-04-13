"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardSidebar from "../../components/DashboardSidebar";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardLayout({ children }) {
	const pathname = usePathname();
	const { user } = useAuth();
	const [sidebarMode, setSidebarMode] = useState("full");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const currentSection = pathname
		.replace("/dashboard", "")
		.split("/")
		.filter(Boolean)
		.map((part) => part.replace(/-/g, " "))
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" / ") || "Overview";

	const cycleSidebarMode = () => {
		setSidebarMode((prev) => {
			if (prev === "full") return "icon";
			if (prev === "icon") return "hidden";
			return "full";
		});
	};

	const sidebarModeLabel =
		sidebarMode === "full"
			? "Full"
			: sidebarMode === "icon"
				? "Icon"
				: "Off";

	return (
		<ProtectedRoute>
			<div className='flex h-screen overflow-hidden bg-primary/5'>
				<DashboardSidebar
					sidebarMode={sidebarMode}
					isMobileMenuOpen={isMobileMenuOpen}
					setIsMobileMenuOpen={setIsMobileMenuOpen}
				/>
				<main
					className={`flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ${
						sidebarMode === "full"
							? "lg:ml-72"
							: sidebarMode === "icon"
								? "lg:ml-24"
								: "lg:ml-0"
					}`}>
					<header className='sticky top-0 z-30 border-b border-primary/20 bg-white/90 backdrop-blur'>
						<div className='flex items-center justify-between gap-3 px-4 py-3 sm:px-6'>
							<div className='flex min-w-0 items-center gap-3'>
								<button
									onClick={() => setIsMobileMenuOpen(true)}
									className='rounded-xl border border-primary/30 bg-white p-2 text-primary shadow-sm transition-colors hover:bg-primary/10 lg:hidden'>
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

								<button
									onClick={cycleSidebarMode}
									title={`Sidebar mode: ${sidebarModeLabel}`}
									aria-label={`Sidebar mode: ${sidebarModeLabel}`}
									className='hidden rounded-xl border border-primary/30 bg-white p-2 text-primary shadow-sm transition-colors hover:bg-primary/10 lg:inline-flex'>
									<svg
										className='h-4 w-4'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										{sidebarMode === "full" ? (
											<>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M3 5h18M3 12h18M3 19h18'
												/>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M9 4v16'
												/>
											</>
										) : sidebarMode === "icon" ? (
											<>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M3 5h18M3 12h18M3 19h18'
												/>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M6 4v16'
												/>
											</>
										) : (
											<>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M4 4h16v16H4z'
												/>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M12 8v8M8 12h8'
												/>
											</>
										)}
									</svg>
								</button>

								<div className='hidden h-8 w-px bg-primary/20 sm:block' />

								<div className='flex min-w-0 items-center gap-3'>
									<div className='rounded-xl border border-primary/20 bg-primary/5 p-1.5'>
										<Image
											src='/images/footer-logo.png'
											alt='833PROBAID logo'
											width={34}
											height={34}
											className='h-8 w-auto object-contain'
										/>
									</div>
									<div className='min-w-0'>
										<p className='truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/70'>
											833PROBAID Dashboard
										</p>
										<p className='truncate text-sm font-semibold text-primary'>
											{currentSection}
										</p>
									</div>
								</div>
							</div>

							<div className='flex items-center gap-2 sm:gap-3'>
								<div className='hidden rounded-xl border border-secondary/40 bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary md:block'>
									Secure Session
								</div>
								<div className='flex items-center gap-2 rounded-2xl border border-primary/20 bg-white px-2 py-1.5 shadow-sm sm:px-3'>
									<div className='flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-white'>
										{user?.name?.charAt(0)?.toUpperCase() || "U"}
									</div>
									<div className='hidden sm:block'>
										<p className='max-w-45 truncate text-sm font-semibold text-primary'>
											{user?.name || "Dashboard User"}
										</p>
										<p className='max-w-45 truncate text-xs text-primary/70'>
											{user?.email || "No email"}
										</p>
									</div>
								</div>
							</div>
						</div>
					</header>

					<div className='flex-1 overflow-y-auto'>
						<div className='p-4 sm:p-6'>{children}</div>
					</div>
				</main>
			</div>
		</ProtectedRoute>
	);
}
