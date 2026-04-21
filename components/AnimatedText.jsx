"use client";

const supStyle = { verticalAlign: "super", fontSize: "0.7em", lineHeight: "1" };

export default function AnimatedText({
	text,
	className = "",
	as: Component = "span",
	animate = false,
	...props
}) {
	if (!animate) {
		const rendered = text.includes("®")
			? text.split("®").reduce((acc, part, i) => (
					i === 0
						? [part]
						: [...acc, <span key={i} style={supStyle}>®</span>, part]
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
					<span style={supStyle}>®</span>
					{parts[1]}
				</>
			);
		}
		return word;
	};

	return (
		<Component className={className} {...props}>
			{words.map((word, index) => (
				<span key={index}>
					{/* Outer span owns the float animation; inner span owns the hover transform.
					    Splitting them prevents Safari from dropping one transform when both
					    target the same element. */}
					<span
						className="animated-word-outer cursor-default"
						style={{ animationDelay: `${index * 0.1}s` }}>
						<span className="animated-word-inner transition-transform duration-300 ease-out md:hover:scale-110 md:hover:-translate-y-1">
							{renderWord(word)}
						</span>
					</span>
					{index < words.length - 1 && " "}
				</span>
			))}
		</Component>
	);
}
