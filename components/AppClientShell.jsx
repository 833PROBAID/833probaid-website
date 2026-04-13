"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../contexts/AuthContext";
import AIChatbot from "./AIChatbot";

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
