import {
	Geist,
	Geist_Mono,
	Anton,
	Roboto,
	League_Spartan,
	Montserrat,
	Passions_Conflict,
	Sarpanch,
	Oswald,
	Poppins,
} from "next/font/google";
import "./globals.css";
import AppClientShell from "../components/AppClientShell";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const anton = Anton({
	weight: "400",
	variable: "--font-anton",
	subsets: ["latin"],
});

const roboto = Roboto({
	weight: ["100", "300", "400", "500", "700", "900"],
	variable: "--font-roboto",
	subsets: ["latin"],
	style: ["normal", "italic"],
});

const leagueSpartan = League_Spartan({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-league-spartan",
	subsets: ["latin"],
});

const montserrat = Montserrat({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-montserrat",
	subsets: ["latin"],
	style: ["normal", "italic"],
});

const passionsConflict = Passions_Conflict({
	weight: "400",
	variable: "--font-passions-conflict",
	subsets: ["latin"],
});

const sarpanch = Sarpanch({
	weight: ["400", "500", "600", "700", "800", "900"],
	variable: "--font-sarpanch",
	subsets: ["latin"],
});

const oswald = Oswald({
	weight: ["200", "300", "400", "500", "600", "700"],
	variable: "--font-oswald",
	subsets: ["latin"],
});

const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
	subsets: ["latin"],
	style: ["normal", "italic"],
});

export default function RootLayout({ children }) {
	return (
		<html lang='en' style={{ userSelect: "none", WebkitUserSelect: "none" }}>
			<head>
				<link
					rel='stylesheet'
					href='https://cdn.jsdelivr.net/npm/react-quill@2.0.0/dist/quill.snow.css'
				/>
				<link
					rel='stylesheet'
					href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css'
					integrity='sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=='
					crossOrigin='anonymous'
					referrerPolicy='no-referrer'
				/>
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link
					rel='preconnect'
					href='https://fonts.gstatic.com'
					crossOrigin='anonymous'
				/>
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap'
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${roboto.variable} ${leagueSpartan.variable} ${montserrat.variable} ${passionsConflict.variable} ${sarpanch.variable} ${oswald.variable} ${poppins.variable} antialiased`}>
				<AppClientShell>{children}</AppClientShell>
			</body>
		</html>
	);
}
