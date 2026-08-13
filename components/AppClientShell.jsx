"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { AuthProvider } from "../contexts/AuthContext";
import ContactActionHandler from "./ContactActionHandler";
import CtaWordLinks from "./CtaWordLinks";

const AIChatbot = dynamic(() => import("./AIChatbot"), {
	ssr: false,
});

export default function AppClientShell({ children }) {
	const route = usePathname() || "";
	const isDashboard = route.startsWith("/dashboard");

	return (
		<AuthProvider>
			<ContactActionHandler />
			{!isDashboard && <CtaWordLinks />}
			{children}
			{!isDashboard && <AIChatbot />}
		</AuthProvider>
	);
}
