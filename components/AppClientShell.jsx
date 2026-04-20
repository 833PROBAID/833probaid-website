"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { AuthProvider } from "../contexts/AuthContext";

const AIChatbot = dynamic(() => import("./AIChatbot"), {
	ssr: false,
});

export default function AppClientShell({ children }) {
	const route = usePathname() || "";
	const isDashboard = route.startsWith("/dashboard");

	useEffect(() => {
		const prevent = (event) => {
			if (!isDashboard) {
				event.preventDefault();
			}
		};

		document.addEventListener("copy", prevent);
		document.addEventListener("cut", prevent);
		document.addEventListener("paste", prevent);
		document.addEventListener("contextmenu", prevent);

		return () => {
			document.removeEventListener("copy", prevent);
			document.removeEventListener("cut", prevent);
			document.removeEventListener("paste", prevent);
			document.removeEventListener("contextmenu", prevent);
		};
	}, [isDashboard]);

	return (
		<AuthProvider>
			{children}
			{!isDashboard && <AIChatbot />}
		</AuthProvider>
	);
}
