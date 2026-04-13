const loadCustomBlocks = (editor) => {
	const blockManager = editor.BlockManager;

	// ===================== CONTENT SECTION =====================
	// Source: court-confirmed-sales.html
	blockManager.add("content-section", {
		label: "Content Section",
		media: '<i class="fa fa-file-alt"></i>',
		category: "Sections",
		content: `<section id="section-id">
	<div class="content-block shadow-card">
		<h2 class="section-title text-primary">SECTION TITLE HERE</h2>
		<p class="body-text text-secondary text-bold" style="margin-bottom: 1.5rem">
			First paragraph of content. Provide context and key information about this topic.
		</p>
		<p class="body-text text-secondary text-bold" style="margin-bottom: 1.5rem">
			Second paragraph with additional details and supporting information.
		</p>
		<p class="body-text text-secondary text-bold">
			Final paragraph with a clear takeaway or action point.
		</p>
	</div>
</section>`,
	});

	// ===================== CONTENT SECTION WITH POINTS =====================
	// Source: court-confirmed-sales.html — content-block containing a points-wrapper
	blockManager.add("content-section-points", {
		label: "Section + Points",
		media: '<i class="fa fa-list-ul"></i>',
		category: "Sections",
		content: `<section id="section-with-points">
	<div class="content-block shadow-card">
		<h2 class="section-title text-primary">SECTION WITH POINT ITEMS</h2>
		<p class="body-text text-secondary text-bold" style="margin-bottom: 1.5rem">
			Introductory paragraph explaining what the following points cover.
		</p>
		<div class="points-wrapper" style="margin-bottom: 1.5rem">
			<div class="point-item shadow-card">
				<img class="point-icon" src="./images/arrow.png" alt="arrow" />
				<div>
					<p class="body-text text-primary text-bold" style="margin-bottom: 0.5rem">FIRST POINT TITLE:</p>
					<p class="body-text text-secondary text-bold">Description of the first key point and why it matters.</p>
				</div>
			</div>
			<div class="point-item shadow-card">
				<img class="point-icon" src="./images/arrow.png" alt="arrow" />
				<div>
					<p class="body-text text-primary text-bold" style="margin-bottom: 0.5rem">SECOND POINT TITLE:</p>
					<p class="body-text text-secondary text-bold">Description of the second key point with supporting detail.</p>
				</div>
			</div>
			<div class="point-item shadow-card">
				<img class="point-icon" src="./images/arrow.png" alt="arrow" />
				<div>
					<p class="body-text text-primary text-bold" style="margin-bottom: 0.5rem">THIRD POINT TITLE:</p>
					<p class="body-text text-secondary text-bold">Description of the third key point and its impact.</p>
				</div>
			</div>
			<div class="point-item shadow-card">
				<img class="point-icon" src="./images/arrow.png" alt="arrow" />
				<div>
					<p class="body-text text-primary text-bold" style="margin-bottom: 0.5rem">FOURTH POINT TITLE:</p>
					<p class="body-text text-secondary text-bold">Description of the fourth key point summarizing what needs to happen.</p>
				</div>
			</div>
		</div>
		<p class="body-text text-secondary text-bold">Closing sentence summarizing the bigger picture takeaway.</p>
	</div>
</section>`,
	});

	// ===================== SECTION PHOTO =====================
	// Source: all pages — <div class="section-photo shadow-card"><img ...></div>
	blockManager.add("section-photo", {
		label: "Section Photo",
		media: '<i class="fa fa-image"></i>',
		category: "Media",
		content: `<div class="section-photo shadow-card">
	<img src="./probate.jpg" alt="Probate case support photo" loading="lazy" />
</div>`,
	});

	// ===================== POINTS LIST (STANDALONE) =====================
	// Source: multiple pages — standalone <div class="points-wrapper">
	blockManager.add("points-wrapper", {
		label: "Points List",
		media: '<i class="fa fa-check-circle"></i>',
		category: "Content",
		content: `<div class="points-wrapper">
	<div class="point-item shadow-card">
		<img class="point-icon" src="./images/arrow.png" alt="arrow" />
		<div class="body-text point-text" style="flex: 1">
			<b class="text-primary text-bold point-title">First Point Title</b><br />
			Detailed description of this point. Explain what it means and why it matters.
		</div>
	</div>
	<div class="point-item shadow-card">
		<img class="point-icon" src="./images/arrow.png" alt="arrow" />
		<div class="body-text point-text" style="flex: 1">
			<b class="text-primary text-bold point-title">Second Point Title</b><br />
			Detailed description of this point. Provide context and supporting information.
		</div>
	</div>
	<div class="point-item shadow-card">
		<img class="point-icon" src="./images/arrow.png" alt="arrow" />
		<div class="body-text point-text" style="flex: 1">
			<b class="text-primary text-bold point-title">Third Point Title</b><br />
			Detailed description of this point. Clear language helps the reader absorb information.
		</div>
	</div>
</div>`,
	});

	// ===================== STEP SECTION =====================
	// Source: streamlining-probate-real-estate-sales.html
	blockManager.add("step-section", {
		label: "Step Section",
		media: '<i class="fa fa-shoe-prints"></i>',
		category: "Sections",
		content: `<section id="step-1" class="step-container shadow-card">
	<div class="step-inner shadow-card">
		<div class="step-content">
			<div class="step-title-row">
				<h3 class="step-title-text">STEP TITLE — DEFINE YOUR OBJECTIVE HERE</h3>
			</div>
			<div class="content-block step-body shadow-card">
				<p class="body-text step-intro" style="margin-bottom: 1.5rem">
					Opening context for this step. Explain what is happening at this stage and why it is important.
				</p>
				<div class="points-wrapper" style="margin-bottom: 1.5rem">
					<div class="point-item shadow-card">
						<img src="./images/arrow.png" class="point-icon" alt="" />
						<div class="body-text point-text" style="flex: 1">
							<b class="text-primary text-bold point-title">First Action Item</b><br />
							Detailed explanation of this action, including who is responsible and expected outcome.
						</div>
					</div>
					<div class="point-item shadow-card">
						<img src="./images/arrow.png" class="point-icon" alt="" />
						<div class="body-text point-text" style="flex: 1">
							<b class="text-primary text-bold point-title">Second Action Item</b><br />
							Detailed explanation of this action, being specific about timelines and outcomes.
						</div>
					</div>
					<div class="point-item shadow-card">
						<img src="./images/arrow.png" class="point-icon" alt="" />
						<div class="body-text point-text" style="flex: 1">
							<b class="text-primary text-bold point-title">Third Action Item</b><br />
							Detailed explanation focusing on what makes this step critical to the process.
						</div>
					</div>
				</div>
				<p class="body-text step-closing">
					This step sets the foundation for everything that follows. Completing it correctly ensures the process stays on track.
				</p>
			</div>
		</div>
	</div>
</section>`,
	});

	// ===================== CATEGORY BANNER — PRIMARY =====================
	// Source: free-consultation.html
	blockManager.add("banner-primary", {
		label: "Banner — Primary",
		media: '<i class="fa fa-bookmark"></i>',
		category: "Banners",
		content: `<div class="category-banner banner-primary">
	<h2>For Executors, Administrators, Conservators &amp; Trustees</h2>
	<p class="body-text text-secondary text-bold">Court-Aligned. Attorney-Trusted. Ready on Day One.</p>
</div>`,
	});

	// ===================== CATEGORY BANNER — SECONDARY =====================
	// Source: faq.html
	blockManager.add("banner-secondary", {
		label: "Banner — Secondary",
		media: '<i class="fa fa-bookmark"></i>',
		category: "Banners",
		content: `<section id="category-banner-section">
	<div class="category-banner banner-secondary shadow-card">
		<h2>Probate</h2>
	</div>
</section>`,
	});

	// ===================== CONCLUSION / CTA SECTION =====================
	// Source: court-confirmed-sales.html — conclusion section with contact items
	blockManager.add("conclusion-section", {
		label: "Conclusion / CTA",
		media: '<i class="fa fa-phone"></i>',
		category: "Sections",
		content: `<section id="conclusion">
	<div class="content-block shadow-card">
		<h2 class="section-title text-primary">LET US KEEP YOUR CASE CLEAN AND COMPLIANT</h2>
		<p class="body-text text-secondary text-bold" style="margin-bottom: 1.5rem">
			If you are handling a probate or conservatorship case and want it managed properly from the beginning, I am ready to step in and take care of the entire real estate lane.
		</p>
		<div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
			<div class="contact-item" style="display: flex; align-items: flex-start; gap: 1rem">
				<img src="./svgs/phone-icon.svg" style="width: 2rem; height: 2rem; flex-shrink: 0; margin-top: 0.15rem;" />
				<div class="body-text text-bold" style="line-height: 1.1">
					<span class="text-secondary text-bold">(833) <span style="letter-spacing: 0.07em">PROBAID</span></span><br />
					<span class="text-primary text-bold" style="display: block; text-align: right; letter-spacing: 0.17em;">7762243</span>
				</div>
			</div>
			<div class="contact-item" style="display: flex; align-items: center; gap: 1rem">
				<img src="./svgs/uiw_mail.svg" style="width: 2rem; height: 2rem; flex-shrink: 0; margin-top: 0.15rem;" />
				<span class="body-text text-secondary text-bold">833PROBAID.com</span>
			</div>
		</div>
	</div>
</section>`,
	});
};

export default loadCustomBlocks;
