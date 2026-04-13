"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "probaid_chat_session";
const TOOLTIP_DISMISSED_KEY = "probaid_chat_tooltip_dismissed_v1";
const WELCOME =
	"Hey there! I'm **Alex** from 833PROBAID® — happy to help with anything around probate, trust, or conservatorship real estate. What's on your mind?";

const QUICK_REPLIES = [
	"What is probate real estate?",
	"How does court confirmation work?",
	"What's an overbid?",
	"Contact 833PROBAID®",
];

function renderWithRegisteredSup(text, keyPrefix) {
	const parts = String(text).split("®");
	return parts.flatMap((part, idx) =>
		idx < parts.length - 1
			? [part, <sup key={`${keyPrefix}-reg-${idx}`}>®</sup>]
			: [part],
	);
}

function formatMessage(text) {
	// tokenize: bold, email, phone, URL, italic, plain
	const TOKEN =
		/(\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}|\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b)/g;
	const tokens = text.split(TOKEN).filter((t) => t !== undefined);
	return tokens.map((t, i) => {
		if (/^\*\*[^*]+\*\*$/.test(t)) {
			return (
				<strong key={i} className='font-semibold'>
					{renderWithRegisteredSup(t.slice(2, -2), `bold-${i}`)}
				</strong>
			);
		}
		if (/^\*[^*]+\*$/.test(t)) {
			return <em key={i}>{renderWithRegisteredSup(t.slice(1, -1), `italic-${i}`)}</em>;
		}
		if (/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(t)) {
			return (
				<a
					key={i}
					href={`mailto:${t}`}
					className='underline decoration-dotted hover:decoration-solid break-all'
					style={{ color: "#0097A7" }}>
					{renderWithRegisteredSup(t, `email-${i}`)}
				</a>
			);
		}
		if (/\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/.test(t)) {
			const digits = t.replace(/\D/g, "");
			return (
				<a
					key={i}
					href={`tel:+${digits.length === 10 ? "1" + digits : digits}`}
					className='underline decoration-dotted hover:decoration-solid font-medium whitespace-nowrap'
					style={{ color: "#0097A7" }}>
					{renderWithRegisteredSup(t, `phone-${i}`)}
				</a>
			);
		}
		if (/^https?:\/\/[^\s]+$/.test(t) || /^www\.[^\s]+$/.test(t)) {
			const href = t.startsWith("http") ? t : `https://${t}`;
			return (
				<a
					key={i}
					href={href}
					target='_blank'
					rel='noopener noreferrer'
					className='underline decoration-dotted hover:decoration-solid break-all'
					style={{ color: "#0097A7" }}>
					{renderWithRegisteredSup(t, `url-${i}`)}
				</a>
			);
		}
		// preserve line breaks within a bubble
		return t
			.split("\n")
			.flatMap((line, li, arr) =>
				li < arr.length - 1
					? [
							<span key={`${i}-${li}`}>
								{renderWithRegisteredSup(line, `text-${i}-${li}`)}
							</span>,
							<br key={`${i}-${li}-br`} />,
						]
					: [
							<span key={`${i}-${li}`}>
								{renderWithRegisteredSup(line, `text-${i}-${li}`)}
							</span>,
						],
			);
	});
}

function TypingIndicator() {
	return (
		<div className='flex items-end gap-2'>
			<div
				className='w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[9px] font-bold'
				style={{ background: "#0097A7" }}>
				AX
			</div>
			<div className='bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3'>
				<div className='flex gap-1 items-center h-4'>
					{[0, 150, 300].map((d) => (
						<span
							key={d}
							className='w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce'
							style={{ animationDelay: `${d}ms` }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

function WaveBar({ active, color }) {
	return (
		<div className='flex items-center justify-center gap-0.75 h-7'>
			{[...Array(14)].map((_, i) => (
				<span
					key={i}
					style={{
						display: "inline-block",
						width: 3,
						borderRadius: 99,
						background: color,
						height: active
							? `${5 + Math.abs(Math.sin(i * 0.7)) * 16}px`
							: "3px",
						animation: active
							? `waveBar ${0.4 + (i % 4) * 0.1}s ease-in-out infinite alternate`
							: "none",
						animationDelay: `${i * 40}ms`,
						opacity: active ? 1 : 0.25,
					}}
				/>
			))}
		</div>
	);
}

export default function AIChatbot() {
	const pathname = usePathname();
	const pageContextRef = useRef("");
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [typing, setTyping] = useState(false);
	const [listening, setListening] = useState(false);
	const [speaking, setSpeaking] = useState(false);
	const [voiceSupported, setVoiceSupported] = useState(false);
	const [speechSupported, setSpeechSupported] = useState(false);
	const [pulse, setPulse] = useState(false);
	const [unread, setUnread] = useState(0);
	const [autoSpeak, setAutoSpeak] = useState(false);
	const [minimized, setMinimized] = useState(false);
	const [copied, setCopied] = useState(null);
	const [interimText, setInterimText] = useState("");
	const [showTooltip, setShowTooltip] = useState(true);

	const [isMobile, setIsMobile] = useState(false);

	const messagesEndRef = useRef(null);
	const recognitionRef = useRef(null);
	const synthRef = useRef(null);
	const textareaRef = useRef(null);

	// Track viewport size for responsive layout
	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 640);
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, []);

	useEffect(() => {
		try {
			const dismissed = sessionStorage.getItem(TOOLTIP_DISMISSED_KEY) === "1";
			if (dismissed) setShowTooltip(false);
		} catch {}
	}, []);

	// Scrape visible page text whenever the route changes
	useEffect(() => {
		const scrape = () => {
			try {
				const clone = document.body.cloneNode(true);
				// Remove non-content elements
				clone
					.querySelectorAll(
						"script,style,noscript,nav,header,footer,svg,img,button,input,textarea,select,label," +
							"[aria-hidden='true'],[data-chatbot],[class*='chatbot'],[class*='AIChatbot']," +
							"[class*='Navbar'],[class*='navbar'],[class*='Footer'],[class*='footer']," +
							"[class*='sidebar'],[class*='Sidebar'],[class*='modal'],[class*='Modal']",
					)
					.forEach((el) => el.remove());

				const raw = clone.innerText || clone.textContent || "";

				// Deduplicate repeated lines (menus, repeated labels, etc.)
				const seen = new Set();
				const lines = raw
					.split(/\n/)
					.map((l) => l.trim())
					.filter((l) => {
						if (l.length < 3) return false; // skip blank / single chars
						if (/^\d+$/.test(l)) return false; // skip lone numbers
						if (seen.has(l)) return false; // skip duplicates
						seen.add(l);
						return true;
					});

				// Join, collapse spaces, cap to ~1500 chars (~375 tokens)
				pageContextRef.current = lines.join(" ").replace(/\s+/g, " ").trim();
			} catch (err) {
				console.warn("[AIChatbot] Scrape failed:", err);
				pageContextRef.current = "";
			}
		};
		const t = setTimeout(scrape, 600);
		return () => clearTimeout(t);
	}, [pathname]);

	useEffect(() => {
		try {
			const saved = sessionStorage.getItem(STORAGE_KEY);
			setMessages(
				saved ? JSON.parse(saved) : [{ role: "assistant", content: WELCOME }],
			);
		} catch {
			setMessages([{ role: "assistant", content: WELCOME }]);
		}
	}, []);

	useEffect(() => {
		setVoiceSupported(
			!!(window.SpeechRecognition || window.webkitSpeechRecognition),
		);
		setSpeechSupported(!!window.speechSynthesis);
		synthRef.current = window.speechSynthesis || null;
	}, []);

	useEffect(() => {
		if (messages.length > 0) {
			try {
				sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
			} catch {}
		}
	}, [messages]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, loading, interimText]);

	useEffect(() => {
		if (
			!open &&
			messages.length > 1 &&
			messages[messages.length - 1]?.role === "assistant"
		) {
			setUnread((u) => u + 1);
			setPulse(true);
			const t = setTimeout(() => setPulse(false), 4000);
			return () => clearTimeout(t);
		}
	}, [messages]); // eslint-disable-line

	useEffect(() => {
		if (open) {
			setUnread(0);
			setPulse(false);
		}
	}, [open]);

	const speakText = useCallback(
		(text) => {
			if (!synthRef.current || !speechSupported) return;
			synthRef.current.cancel();
			const clean = text.replace(/\*\*/g, "");
			const utterance = new SpeechSynthesisUtterance(clean);
			utterance.rate = 1.05;
			utterance.pitch = 1;
			utterance.volume = 1;
			const voices = synthRef.current.getVoices();
			const preferred =
				voices.find(
					(v) =>
						v.lang.startsWith("en") &&
						(v.name.includes("Natural") ||
							v.name.includes("Neural") ||
							v.name.includes("Samantha") ||
							v.name.includes("Google")),
				) || voices.find((v) => v.lang.startsWith("en"));
			if (preferred) utterance.voice = preferred;
			utterance.onstart = () => setSpeaking(true);
			utterance.onend = () => setSpeaking(false);
			utterance.onerror = () => setSpeaking(false);
			synthRef.current.speak(utterance);
		},
		[speechSupported],
	);

	const stopSpeaking = useCallback(() => {
		synthRef.current?.cancel();
		setSpeaking(false);
	}, []);

	const sendMessage = useCallback(
		async (text) => {
			const trimmed = (text || input).trim();
			if (!trimmed || loading) return;
			stopSpeaking();
			const userMsg = { role: "user", content: trimmed };
			const newMessages = [...messages, userMsg];
			setMessages(newMessages);
			setInput("");
			if (textareaRef.current) textareaRef.current.style.height = "auto";
			setLoading(true);
			setTyping(true);
			console.log(
				"[AIChatbot] Sending message | path:",
				pathname,
				"| context chars:",
				pageContextRef.current.length,
			);
			// Minimum "thinking" time so Alex doesn't feel instant
			const thinkStart = Date.now();
			const minThinkMs = 1800 + Math.random() * 1200; // 1.8 – 3.0 s
			try {
				const res = await fetch("/api/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						messages: newMessages,
						pageContext: pageContextRef.current,
						pathname,
					}),
				});
				const data = await res.json();
				const reply =
					data.reply || data.error || "Sorry, something went wrong.";
				const bubbles = reply
					.split(/\n\n+/)
					.map((p) => p.trim())
					.filter(Boolean);
				setLoading(false);
				// Wait out the remaining think time before showing any bubble
				const elapsed = Date.now() - thinkStart;
				const holdMs = Math.max(0, minThinkMs - elapsed);
				setTimeout(() => {
					let offset = 0;
					bubbles.forEach((part, i) => {
						// Gap before each bubble: scale with previous bubble's length
						const gap =
							i === 0
								? 0
								: Math.min(2200, Math.max(900, bubbles[i - 1].length * 22));
						offset += gap;
						setTimeout(() => {
							setMessages((prev) => [
								...prev,
								{ role: "assistant", content: part },
							]);
							if (i === bubbles.length - 1) {
								setTyping(false);
								if (autoSpeak) speakText(part);
							}
						}, offset);
					});
				}, holdMs);
			} catch {
				setLoading(false);
				setTyping(false);
				setMessages((prev) => [
					...prev,
					{ role: "assistant", content: "Connection error. Please try again." },
				]);
			}
		},
		[input, loading, messages, speakText, stopSpeaking, autoSpeak],
	);

	const startListening = useCallback(() => {
		if (!voiceSupported || listening) return;
		stopSpeaking();
		const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
		const r = new SR();
		r.lang = "en-US";
		r.interimResults = true;
		r.maxAlternatives = 1;
		r.continuous = false;
		r.onstart = () => setListening(true);
		r.onresult = (e) => {
			const transcript = Array.from(e.results)
				.map((x) => x[0].transcript)
				.join("");
			setInterimText(transcript);
			setInput(transcript);
			if (e.results[e.results.length - 1].isFinal) {
				sendMessage(transcript);
				setListening(false);
				setInterimText("");
			}
		};
		r.onerror = () => {
			setListening(false);
			setInterimText("");
		};
		r.onend = () => {
			setListening(false);
			setInterimText("");
		};
		recognitionRef.current = r;
		r.start();
	}, [voiceSupported, listening, stopSpeaking, sendMessage]);

	const stopListening = useCallback(() => {
		recognitionRef.current?.stop();
		setListening(false);
		setInterimText("");
	}, []);

	const clearChat = useCallback(() => {
		stopSpeaking();
		setMessages([{ role: "assistant", content: WELCOME }]);
		sessionStorage.removeItem(STORAGE_KEY);
		setUnread(0);
	}, [stopSpeaking]);

	const copyMessage = useCallback((text, i) => {
		navigator.clipboard.writeText(text.replace(/\*\*/g, "")).then(() => {
			setCopied(i);
			setTimeout(() => setCopied(null), 2000);
		});
	}, []);

	const dismissTooltip = useCallback(() => {
		setShowTooltip(false);
		try {
			sessionStorage.setItem(TOOLTIP_DISMISSED_KEY, "1");
		} catch {}
	}, []);

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const handleTextareaChange = (e) => {
		setInput(e.target.value);
		e.target.style.height = "auto";
		e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
	};

	const statusText = listening
		? "Listening…"
		: speaking
			? "Speaking…"
			: loading
				? "Thinking…"
				: "Online · Probate Expert";

	return (
		<>
			{/* Launcher */}
			<div
				className='fixed z-9999 flex flex-col items-end gap-2'
				style={{ bottom: isMobile ? 16 : 24, right: isMobile ? 14 : 20 }}>
				{/* Tooltip — only visible when chat is closed */}
				{!open && showTooltip && (
					<div
						className='flex flex-col items-end'
						style={{ animation: 'tooltipFloat 3.2s ease-in-out infinite' }}>
						{/* Card */}
						<div
							style={{
								position: 'relative',
								background:
									'linear-gradient(145deg, #007b86 0%, #0097A7 52%, #00b8c8 100%)',
								borderLeft: '6px solid #FD7702',
								border: '1.5px solid rgba(255,255,255,0.42)',
								borderRadius: '16px 16px 16px 6px',
								padding: isMobile ? '12px 14px 12px 12px' : '14px 18px 14px 14px',
								boxShadow: '0 18px 44px rgba(0,151,167,0.42), 0 10px 20px rgba(15,23,42,0.28)',
								minWidth: isMobile ? 194 : 242,
								maxWidth: isMobile ? 270 : 326,
								backdropFilter: 'blur(4px)',
							}}>
							<button
								type='button'
								onClick={dismissTooltip}
								aria-label='Dismiss chatbot tooltip'
								style={{
									position: 'absolute',
									top: 7,
									right: 7,
									width: isMobile ? 30 : 32,
									height: isMobile ? 30 : 32,
									borderRadius: '50%',
									border: '1px solid rgba(255,255,255,0.6)',
									background: '#FD7702',
									color: '#ffffff',
									fontSize: isMobile ? 18 : 20,
									fontWeight: 900,
									lineHeight: 1,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									padding: 0,
									boxShadow: '0 4px 12px rgba(15,23,42,0.28)',
								}}>
								✕
							</button>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									paddingRight: 40,
								}}>
								
								<span
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										padding: '2px 8px',
										borderRadius: 999,
										fontSize: 9,
										fontWeight: 800,
										letterSpacing: '0.08em',
										textTransform: 'uppercase',
										background: 'rgba(253,119,2,0.22)',
										border: '1px solid rgba(253,119,2,0.65)',
										color: '#fff',
									}}>
									Live Support
								</span>
							</div>
							<div style={{ height: 3, background: '#FD7702', borderRadius: 99, marginTop: 8, marginBottom: 10 }} />
							<p style={{
								color: '#fff',
								fontWeight: 900,
								fontSize: isMobile ? 14 : 16,
								letterSpacing: '0.025em',
								lineHeight: 1.25,
								paddingRight: 40,
								fontFamily: 'inherit',
							}}>
								833PROBAID<sup>®</sup> Client Support
							</p>
							<p style={{
								color: 'rgba(255,255,255,0.82)',
								fontSize: isMobile ? 11 : 12,
								marginTop: 5,
								lineHeight: 1.45,
								maxWidth: isMobile ? 232 : 272,
								fontFamily: 'inherit',
							}}>
								Ask Alex about probate timelines, overbid strategy, and estate sale next steps.
							</p>
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 10 }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
								<span style={{
									width: 8,
									height: 8,
									borderRadius: '50%',
									background: '#FD7702',
									boxShadow: '0 0 8px rgba(239,108,0,0.95)',
									display: 'inline-block',
									flexShrink: 0,
									animation: 'onlinePing 2s ease-in-out infinite',
								}} />
								<span style={{
									color: 'rgba(255,255,255,0.65)',
									fontSize: 9,
									letterSpacing: '0.08em',
									fontWeight: 700,
									fontFamily: 'inherit',
								}}>
									ONLINE NOW
								</span>
								</div>
								<span
									style={{
										color: 'rgba(255,255,255,0.86)',
										fontSize: 10,
										fontWeight: 700,
										letterSpacing: '0.02em',
									}}>
									Tap to chat
								</span>
							</div>
						</div>
						{/* Arrow pointing down toward button */}
						<div style={{
							width: 0,
							height: 0,
							borderLeft: '10px solid transparent',
							borderRight: '10px solid transparent',
							borderTop: '10px solid #008f9d',
							marginRight: isMobile ? 26 : 34,
						}} />
					</div>
				)}
				{/* Launch button — circle, orange fill, teal ring */}
				<button
					onClick={() => {
						setOpen((o) => !o);
						setMinimized(false);
					}}
					aria-label='Open chat support'
					className='relative flex items-center justify-center focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95'
					style={{
						width: isMobile ? 62 : 74,
						height: isMobile ? 62 : 74,
						borderRadius: '50%',
						background: '#EF6C00',
						border: '4px solid #0097A7',
						boxShadow: '0 0 0 3px rgba(0,151,167,0.28), 0 10px 36px rgba(239,108,0,0.6)',
					}}>
					{/* Expanding ring pulses — orange then teal */}
					{!open && (
						<>
							<span style={{
								position: 'absolute',
								inset: -6,
								borderRadius: '50%',
								border: '3px solid #EF6C00',
								opacity: 0,
								animation: 'launcherRing 2.4s ease-out infinite',
								pointerEvents: 'none',
							}} />
							<span style={{
								position: 'absolute',
								inset: -6,
								borderRadius: '50%',
								border: '3px solid #0097A7',
								opacity: 0,
								animation: 'launcherRing 2.4s ease-out infinite',
								animationDelay: '1.2s',
								pointerEvents: 'none',
							}} />
						</>
					)}
					{open ? (
						<svg
							className='w-7 h-7 text-white'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2.5}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					) : (
						/* Support icon */
						<svg
							width={isMobile ? 29 : 34}
							height={isMobile ? 29 : 34}
							viewBox='0 0 24 24'
							fill='none'
							stroke='white'
							strokeWidth='2.2'
							strokeLinecap='round'
							strokeLinejoin='round'
							xmlns='http://www.w3.org/2000/svg'>
							<path d='M4 13v3a2 2 0 0 0 2 2h2v-6H6a2 2 0 0 0-2 2Z' />
							<path d='M20 13v3a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 2Z' />
							<path d='M4 13a8 8 0 1 1 16 0' />
							<path d='M12 17v2' />
							<path d='M10 21h4' />
						</svg>
					)}
					{unread > 0 && !open && (
						<span
							className='absolute -top-1 -right-1 min-w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1 border-2 border-white'
							style={{ background: '#0097A7' }}>
							{unread > 9 ? "9+" : unread}
						</span>
					)}
				</button>
			</div>

			{/* Chat panel */}
			<div
				className='fixed z-9998 flex flex-col'
				style={isMobile ? {
					// Full-screen on mobile
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					width: '100%',
					height: minimized ? 0 : '100%',
					borderRadius: 0,
					overflow: 'hidden',
					background: '#fff',
					boxShadow: 'none',
					border: 'none',
					transform: open ? 'translateY(0) scale(1)' : 'translateY(100%) scale(1)',
					opacity: open ? 1 : 0,
					pointerEvents: open ? 'auto' : 'none',
					transition: 'transform 0.3s cubic-bezier(0.34,1.2,0.64,1), opacity 0.2s ease, height 0.25s ease',
					transformOrigin: 'bottom center',
					fontFamily: 'var(--font-montserrat, system-ui, sans-serif)',
				} : {
					// Floating panel on desktop
					bottom: "calc(env(safe-area-inset-bottom, 0px) + 100px)",
					right: "clamp(8px, 4vw, 20px)",
					width: "clamp(340px, 92vw, 500px)",
					height: minimized ? 0 : "clamp(480px, 78vh, 700px)",
					borderRadius: 24,
					overflow: "hidden",
					background: "#fff",
					boxShadow:
						"0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,151,167,0.18), 0 0 0 2px rgba(0,151,167,0.12)",
					border: "1.5px solid #0097A7",
					transform: open
						? "translateY(0) scale(1)"
						: "translateY(20px) scale(0.95)",
					opacity: open ? 1 : 0,
					pointerEvents: open ? "auto" : "none",
					transition:
						"transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease, height 0.25s ease",
					transformOrigin: "bottom right",
					fontFamily: "var(--font-montserrat, system-ui, sans-serif)",
				}}>
				{/* Header */}
				<div
					className='shrink-0 flex items-center justify-between px-4 py-3.5'
					style={{ background: "#0097A7" }}>
					<div className='flex items-center gap-3'>
						<div className='relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-white/25'>
							<span className='text-white font-bold text-sm'>AX</span>
							<span className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white' />
						</div>
						<div>
							<p className='text-white font-bold text-sm leading-tight'>
								Alex · 833PROBAID<sup>®</sup>
							</p>
							<p className='text-white/70 text-[11px] mt-0.5'>{statusText}</p>
						</div>
					</div>
					<div className='flex items-center gap-0.5'>
						<button
							onClick={() => setAutoSpeak((a) => !a)}
							title={autoSpeak ? "Auto-speak on" : "Auto-speak off"}
							className='p-2 rounded-lg transition-colors hover:bg-white/15'
							style={{ color: autoSpeak ? "#fff" : "rgba(255,255,255,0.45)" }}>
							<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
								<path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z' />
							</svg>
						</button>
						<button
							onClick={() => setMinimized((m) => !m)}
							title='Minimize'
							className='p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/15 transition-colors'>
							<svg
								className='w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M20 12H4'
								/>
							</svg>
						</button>
						<button
							onClick={() => setOpen(false)}
							title='Close'
							className='p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/15 transition-colors'>
							<svg
								className='w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2.5}
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Messages */}
				<div
					className='flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-gray-50'
					style={{ minHeight: 0 }}>
					{messages.map((msg, i) => {
						const isUser = msg.role === "user";
						const prev = messages[i - 1];
						const showSender = !isUser && (!prev || prev.role !== "assistant");
						const time = new Date().toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						});
						return (
							<div
								key={i}
								className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
								{showSender && (
									<span className='text-[10px] text-gray-400 font-medium mb-1 ml-9'>
										Alex
									</span>
								)}
								<div
									className={`flex items-end gap-2 group ${isUser ? "flex-row-reverse" : "flex-row"}`}>
									{!isUser && (
										<div
											className='w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[9px] font-bold'
											style={{ background: "#0097A7" }}>
											AX
										</div>
									)}
									<div
										className='flex flex-col gap-1'
										style={{ maxWidth: "78%" }}>
										<div
											className={`px-3.5 py-2.5 text-sm leading-relaxed ${
												isUser
													? "text-white rounded-2xl rounded-br-sm"
													: "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm shadow-sm"
											}`}
											style={isUser ? { background: "#0097A7" } : {}}>
											{formatMessage(msg.content)}
										</div>
										<div
											className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? "justify-end" : "justify-start"}`}>
											<span className='text-[10px] text-gray-400'>{time}</span>
											{!isUser && speechSupported && (
												<button
													onClick={() =>
														speaking ? stopSpeaking() : speakText(msg.content)
													}
													className='text-[10px] px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-500 hover:border-[#0097A7] hover:text-[#0097A7] transition-colors'>
													{speaking ? "■ Stop" : "▶ Listen"}
												</button>
											)}
											<button
												onClick={() => copyMessage(msg.content, i)}
												className='text-[10px] px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors'>
												{copied === i ? "✓ Copied" : "Copy"}
											</button>
										</div>
									</div>
								</div>
							</div>
						);
					})}
					{interimText && (
						<div className='flex flex-row-reverse items-end gap-2'>
							<div
								className='px-3.5 py-2.5 text-sm rounded-2xl rounded-br-sm italic text-white/80'
								style={{
									background: "#0097A7",
									opacity: 0.6,
									maxWidth: "78%",
								}}>
								{interimText}…
							</div>
						</div>
					)}
					{typing && <TypingIndicator />}
					<div ref={messagesEndRef} />
				</div>

				{/* Quick replies */}
				{!loading &&
					messages[messages.length - 1]?.role === "assistant" &&
					messages.length <= 2 && (
						<div className='shrink-0 px-4 py-2.5 flex gap-2 flex-wrap bg-white border-t border-gray-100'>
							{QUICK_REPLIES.map((q) => (
								<button
									key={q}
									onClick={() => sendMessage(q)}
									className='text-[11px] px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:border-[#0097A7] hover:text-[#0097A7] transition-colors font-medium whitespace-nowrap'>
									{renderWithRegisteredSup(q, `quick-${q}`)}
								</button>
							))}
						</div>
					)}

				{/* Voice waveform */}
				{(listening || speaking) && (
					<div className='shrink-0 px-4 py-2 border-t border-gray-100 bg-white'>
						<WaveBar active={true} color={listening ? "#0097A7" : "#FD7702"} />
					</div>
				)}

				{/* Input */}
				<div className='shrink-0 bg-white border-t border-gray-100 px-3.5 py-3'>
					<div className='flex items-end gap-2'>
						<textarea
							ref={textareaRef}
							value={input}
							onChange={handleTextareaChange}
							onKeyDown={handleKeyDown}
							placeholder='Ask about probate, trust, estate sales…'
							rows={1}
							disabled={loading || listening}
							className='flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 leading-relaxed'
							style={{
								maxHeight: 120,
								overflowY: "auto",
								fontFamily: "inherit",
								"--tw-ring-color": "#0097A7",
							}}
						/>
						{voiceSupported && (
							<button
								onClick={listening ? stopListening : startListening}
								disabled={loading || speaking}
								title={listening ? "Stop" : "Voice input"}
								className='shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 focus:outline-none disabled:opacity-40'
								style={{
									background: listening ? "#ef4444" : "#f3f4f6",
									color: listening ? "#fff" : "#6b7280",
								}}>
								<svg
									className={`w-4 h-4 ${listening ? "animate-pulse" : ""}`}
									fill='currentColor'
									viewBox='0 0 24 24'>
									<path d='M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z' />
								</svg>
							</button>
						)}
						<button
							onClick={() => sendMessage()}
							disabled={loading || !input.trim() || listening}
							className='shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 focus:outline-none disabled:opacity-40'
							style={{ background: "#FD7702", color: "#fff" }}
							title='Send'>
							{loading ? (
								<svg
									className='w-4 h-4 animate-spin'
									fill='none'
									viewBox='0 0 24 24'>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
									/>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z'
									/>
								</svg>
							) : (
								<svg
									className='w-4 h-4'
									fill='currentColor'
									viewBox='0 0 24 24'>
									<path d='M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' />
								</svg>
							)}
						</button>
					</div>
					<p className='text-[10px] text-gray-400 text-center mt-2 select-none'>
						Enter to send · Shift+Enter for newline
					</p>
				</div>
			</div>

			<style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
        @keyframes launcherRing {
          0%   { transform: scale(1);   opacity: 0.75; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes onlinePing {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        @keyframes tooltipFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
      `}</style>
		</>
	);
}
