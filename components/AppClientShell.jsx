"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { AuthProvider } from "../contexts/AuthContext";

const AIChatbot = dynamic(() => import("./AIChatbot"), {
	ssr: false,
});

export default function AppClientShell({ children }) {
	const route = usePathname() || "";
	const isDashboard = route.startsWith("/dashboard");

	return (
		<AuthProvider>
			{children}
			{!isDashboard && <AIChatbot />}
		</AuthProvider>
	);
}
