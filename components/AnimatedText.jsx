"use client";

// Reusable component for animated text with word-by-word hover
export default function AnimatedText({
	text,
	className = "",
	as: Component = "span",
	animate = false,
	...props
}) {
	// When not animating, render plain text to avoid hundreds of extra DOM nodes
	// which cause Safari scroll jank
	if (!animate) {
		const rendered = text.includes("®")
			? text.split("®").reduce((acc, part, i) => (
					i === 0
						? [part]
						: [
								...acc,
								<span key={i} style={{ verticalAlign: "super", fontSize: "0.7em", lineHeight: "0" }}>®</span>,
								part,
						  ]
			  ), [])
			: text;
		return <Component className={className} {...props}>{rendered}</Component>;
	}

	const words = text.split(" ");

	const renderWord = (word) => {
		if (word.includes("®")) {
			const parts = word.split("®");
			return (
				<>
					{parts[0]}
					<span style={{ verticalAlign: "super", fontSize: "0.7em", lineHeight: "0" }}>®</span>
					{parts[1]}
				</>
			);
		}
		return word;
	};

	return (
		<>
			<style>{`
				@keyframes floatAnimation {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-8px); }
				}
				.animated-text-word {
					animation: floatAnimation 2.5s ease-in-out infinite;
					display: inline-block;
				}
			`}</style>
			<Component className={className} {...props}>
				{words.map((word, index) => (
					<span key={index}>
						<span
						className='animated-text-word cursor-default transition-transform duration-300 ease-out md:hover:scale-110 md:hover:-translate-y-1'
						style={{ animationDelay: `${index * 0.1}s` }}>
							{renderWord(word)}
						</span>
						{index < words.length - 1 && " "}
					</span>
				))}
			</Component>
		</>
	);
}
