"use client";

import AnimatedText from "./AnimatedText";

export default function TrustCard({ text, serial }) {
	return (
		<div
			className={`group ${serial % 2 == 0 ? "bg-primary" : "bg-secondary"} rounded-xl border border-black/30 p-4 shadow-[0px_3.04px_7.39px_0px_rgba(0,0,0,0.68),6.07px_-6.07px_4.05px_0px_rgba(0,0,0,0.25)_inset,-4.05px_5.06px_4.05px_0px_rgba(255,255,255,0.25)_inset,-2.02px_-1.01px_4.05px_0px_rgba(0,0,0,0.6)] md:p-6 lg:p-8 xl:p-12 transition-transform duration-500 ease-out hover:scale-[1.02]`}
		style={{ willChange: 'transform' }}>
			<div className='rounded-xl bg-white p-4 shadow-[-1.06px_1.78px_12.43px_4px_rgba(0,0,0,0.64)] md:p-6 lg:p-8 xl:p-12'>
				<div className='rounded-xl bg-white p-4 shadow-[-1.06px_1.78px_12.43px_4px_rgba(0,0,0,0.64)] md:p-6 lg:p-8 xl:p-7'>
					<p className='font-montserrat text-center text-sm font-bold sm:text-lg md:text-xl lg:text-2xl'>
						<AnimatedText text={text} />
					</p>
				</div>
			</div>
		</div>
	);
}
