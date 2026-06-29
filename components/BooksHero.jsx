import { HomeBorderSVG } from "@/public/HomeBorderSVG";

export default function BooksHero({ bannerImage, title, subtitle }) {
	return (
		<div>
			<div className='flex flex-col items-center justify-center p-4 text-center sm:p-7 md:p-10 my-8 sm:my-12 border-4 rounded-3xl border-l-18 border-secondary transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg shadow-black/30 sm:shadow-xl sm:shadow-black/40 md:shadow-2xl md:shadow-black/50'>
				<h1 className='font-anton text-3xl uppercase leading-tight text-primary hover:text-secondary sm:text-4xl md:text-5xl'>
					{title.includes("®") ? (
						<>
							{title.split("®")[0]}
							<span
								style={{
									verticalAlign: "super",
									fontSize: "0.9em",
									lineHeight: "0",
								}}>
								®
							</span>
							{title.split("®")[1]}
						</>
					) : (
						<>{title}</>
					)}
				</h1>
				<p className='font-montserrat mt-4 text-lg font-bold uppercase text-secondary hover:text-primary sm:mt-6 sm:text-xl md:text-2xl'>
					{subtitle.includes("®") ? (
						<>
							{subtitle.split("®")[0]}
							<span
								style={{
									verticalAlign: "super",
									fontSize: "0.9em",
									lineHeight: "0",
								}}>
								®
							</span>
							{subtitle.split("®")[1]}
						</>
					) : (
						<>{subtitle}</>
					)}
				</p>
			</div>
			<div className='w-full my-8 sm:my-12'>
				<HomeBorderSVG imageUrl={bannerImage} />
			</div>
		</div>
	);
}
