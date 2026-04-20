"use client";

import { useEffect, useRef } from "react";
import ContactCard from "./ContactCard";
import LogoCard from "./LogoCard";
import NewsletterCard from "./NewsletterCard";

export default function Footer() {
	const marqueeRef = useRef(null);
	const textRef = useRef(null);

	useEffect(() => {
		const marquee = marqueeRef.current;
		const text = textRef.current;

		if (!marquee || !text) return;

		let position = 0;
		const speed = 1;

		const animate = () => {
			position -= speed;
			if (Math.abs(position) >= text.offsetWidth / 2) {
				position = 0;
			}
			text.style.transform = `translateX(${position}px)`;
			requestAnimationFrame(animate);
		};

		const animationId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationId);
	}, []);

	return (
		<footer className='bg-primary/35 border-primary mt-8 border-y-2 md:mt-12'>
			<div className='bg-secondary shadow-[0_-8px_12.7px_rgba(0,0,0,0.63),0_10px_12.2px_0px_rgba(0,0,0,0.63)] mt-0.5'>
				<div ref={marqueeRef} className='overflow-hidden'>
					<div
						ref={textRef}
						style={{ willChange: "transform" }}
						className='whitespace-nowrap font-montserrat inline-flex font-bold text-white text-[40px] lg:text-[60px] xl:text-[82px]'>
						PROBATE &#10625; TRUST &#10625; CONSERVATORSHIP &#10625; PROBATE
						&#10625; TRUST &#10625; CONSERVATORSHIP &#10625; SUCCESSOR IN
						INTEREST &#10625; PROBATE &#10625; TRUST &#10625; CONSERVATORSHIP
						&#10625; PROBATE &#10625; TRUST &#10625; CONSERVATORSHIP &#10625;
						SUCCESSOR IN INTEREST &#10625;
					</div>
				</div>
			</div>

			<div className='py-8'>
				<div className='mx-auto w-full container px-4 md:px-0 font-montserrat'>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-1'>
						<ContactCard />
						<LogoCard />
						<NewsletterCard />
					</div>
				</div>
			</div>

			<hr className='text-black/36' />
			<div className='mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-4 py-4 font-bold md:flex-row'>
				<p>
					© {new Date().getFullYear()}{" "}
					<span className='text-secondary'>
						833PROBAID
						<span
							style={{
								verticalAlign: "super",
								fontSize: "0.6em",
								lineHeight: "0",
							}}>
							®
						</span>
					</span>{" "}
					. All rights reserved.
				</p>
				<a className='text-secondary' href='#'>
					Privacy Policy & Terms of Service/Disclosure
				</a>
			</div>
		</footer>
	);
}
