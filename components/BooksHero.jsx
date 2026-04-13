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
			<div className='relative w-full overflow-hidden rounded-2xl border-4 border-secondary shadow-lg shadow-black/30 sm:shadow-xl sm:shadow-black/40 md:shadow-2xl md:shadow-black/50 my-8 sm:my-12'>
				{/*
			<div className='relative h-[400px] w-full sm:h-[500px] md:h-[600px]'>
				<img
					src={bannerImage}
					alt={title}
					className='h-full w-full object-cover'
				/>
				<div className='absolute inset-0 bg-black/60' />
				<div className='absolute inset-0 flex flex-col items-center justify-center px-4 text-center sm:px-8 md:px-12'>
					<h1 className='font-anton text-3xl uppercase leading-tight text-white sm:text-4xl md:text-5xl'>
						{title}
					</h1>
					<p className='font-montserrat mt-4 text-lg font-medium uppercase text-white sm:mt-6 sm:text-xl md:text-2xl'>
						{subtitle}
					</p>
				</div>
			</div> */}

				<div className='relative w-full aspect-video overflow-hidden'>
					<img
						src={bannerImage}
						alt={title}
						className='h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-110'
					/>
				</div>
			</div>
		</div>
	);
}
