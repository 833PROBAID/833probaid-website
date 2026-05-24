# Client Updates — Work Completed

This document lists the issues that have been fixed on the website. Each entry describes the problem, where it appeared, and how it was resolved — written in plain language.

---

## 1. Shadow and Space Problem on Mobile Cards

**Where:** Homepage, on mobile phones. Specifically the two cards that appear just above the section titled *"Your Probate Real Estate Tools"* — the large information card and the QR code card.

### What was wrong

On a mobile phone, both cards had soft, rounded corners — but the shadow around them looked **sharp and rectangular**, with hard 90-degree edges. This made the cards look unfinished, as if the shadow didn't belong to the rounded card.

In particular, the QR code card had a visible straight line of shadow cut off underneath it, instead of a soft, even glow.

### How it was resolved

Three things were adjusted:

1. **The shadow style was replaced.** The old shadows were drawn in a way that produced hard edges. They were swapped out for the same gentle, layered shadow style already used by the "Thank You for Trusting Us" cards lower on the homepage. Those cards already looked correct, so the same look is now used everywhere.

2. **A thin soft border was added** to the cards, matching the "Thank You for Trusting Us" cards. This helps the shadow blend smoothly into the rounded corners instead of meeting the card at a sharp edge.

3. **An invisible "frame" around the cards was removed.** The section containing the cards had a setting that acted like an invisible picture frame, cutting off any shadow that tried to extend past its edges. Because the cards filled the frame from side to side, the shadows on the bottom and on the sides were getting sliced into hard, straight lines. Removing that frame lets the shadow now spread softly all the way around the card.

### Result

The two mobile cards now have soft, evenly-distributed shadows that follow their rounded corners on all four sides — matching the look of the "Thank You for Trusting Us" cards.

---

## 2. Tools Cards — Title and Description Alignment

**Where:** Homepage, the *"Your Probate Real Estate Tools"* section. The four cards in that row — **Insurance Risk Checker**, **Overbid Calculator**, **Access Risk Analyzer**, and **Executor Readiness Quiz**.

### What was wrong

Three issues were affecting these cards:

1. **Too much empty space between the icon and the title.** The gap above the title (for example, on the *Insurance Risk Checker* card) was wider than it needed to be, making the card feel disconnected at the top.

2. **Titles didn't line up across cards.** Some titles fit on one line and others wrapped onto two lines. Because each title was being centered inside its own area, the starting position drifted up or down depending on the length — so the titles weren't sitting at the same height across all four cards.

3. **Two-line titles overlapped the description, and descriptions also didn't line up.** When a title wrapped to two lines, the second line ran into the top of the description text below it. And like the titles, the descriptions were vertically centered inside their own area, so they also started at slightly different positions on each card.

### How it was resolved

1. **The title was pulled closer to the icon.** The gap between the icon and the title was tightened so the two feel like part of the same group.

2. **All titles now start from the same top position.** Instead of being vertically centered (which made them drift), titles are now anchored to the top of their area. Whether a title is one line or two, every card's title now begins at the exact same height.

3. **The title area was given enough room for two lines without crowding the description.** This is the key fix for the overlap: there's now always a clean gap between the bottom of a two-line title and the top of the description.

4. **All descriptions also start from the same top position.** Descriptions are now anchored to a fixed starting point below the title area. So even if one card has a two-line title and another has a one-line title, every card's description begins at the same height across the row. One-line title cards simply have a little extra clean space between the title and the description.

### Result

The four tool cards now look consistent as a row: icons, titles, and descriptions all align at the same heights across cards, and the longer two-line title (*Insurance Risk Checker*) no longer collides with the description below it.

---

## 3. Book-Cover Opening Animation — Cleaner, Faster, Snappier

**Where:** Every place on the site where clicking a "Read Article" or "Learn More" button plays the book-cover opening effect. This includes:

- The blog listing page (`/blogs`) — clicking any article card.
- The homepage and "/new-page" — clicking any book card under the *"The System Attorneys Rely On"* section and the grid of cards below it.

### What was wrong

Three things felt off about the book-cover opening animation:

1. **The cover opened too far.** It rotated almost all the way back, ending up nearly laid flat behind the card. This made it look like the cover had fully "flipped off" instead of just being opened to peek inside.

2. **The animation took too long.** The opening played out over about three seconds in some places. For a click-to-navigate action, that's enough time for the user to feel like the site is dragging.

3. **There was a noticeable pause after the cover opened.** The cover would finish opening, sit fully open for a moment, and only then navigate to the next page. That little hesitation made the whole interaction feel awkward — as if the site was thinking before moving you forward.

### How it was resolved

1. **The cover now opens only partially (about 85%).** Instead of rotating all the way back, the cover stops just before reaching a fully sideways position. This way it still clearly opens and reveals the inside, but it visibly remains "ajar" rather than laid flat. Applied uniformly to every card type on the site so the effect feels consistent everywhere.

2. **The animation duration was cut roughly in half.** Where the open used to take about 3 seconds in some places, it now takes about 1.5 seconds. The default for cards using the shorter timing also dropped from about 1.4 seconds down to 0.7 seconds. The text fade-in delay was tightened proportionally so the content inside the card appears earlier in the open.

3. **Navigation now starts at click time, not after the animation finishes.** Previously, the website waited for the cover to finish opening before asking the browser to load the next page. That created the awkward pause. Now, the moment you click, the browser immediately starts fetching and preparing the next page in the background, *while* the cover is still opening. By the time the cover is out of the way, the new page is already loaded and ready to appear instantly. No more dead time.

### Result

The book-cover effect now feels much more responsive. The cover opens partially (not fully laid back), the animation is faster, and the next page appears the moment the cover is out of the way — no pause, no hesitation. The same fix was applied across every card on the site that uses this effect, so the behaviour is now consistent everywhere.

---

## 4. Blog Cards — Inside Layout & Spacing Adjustments

**Where:** The blog listing page (`/blogs`). Specifically the look of each blog card once the inside (the inner page) is visible — including the photo with the orange border, the title, the horizontal line, and the author row.

### What was wrong

Two separate spacing issues were noticeable on these cards:

1. **The orange border around the photo sat too close to the orange piece on the card's spine.** Each card has a small orange "staple" on the spine, and the photo inside the card has its own thick orange border. On wider screens these two orange elements were almost touching — there was barely any clean white space between them, which made the inside of the card feel cramped.

2. **When a blog had a short title, the space between the image, the title, and the horizontal line beneath the title felt unbalanced.** The image and title sat tight together at the top, while a large empty white area appeared further down. Short-title cards looked half-empty, as if something was missing.

### How it was resolved

1. **More breathing room around the photo inside the card.** The padding around the photo was increased on every side. The most visible effect is on the side facing the spine, where the gap between the orange staple and the photo's orange border now opens up clearly. The photo also gets extra space at the top, right, and bottom — making the entire inside of the card feel less crowded.

2. **Bigger gaps between the photo, the title, and the horizontal line.** Two spacing tweaks were combined: first, the overall vertical spacing between the three stacked items (image, title, author block) was widened. Second, an extra cushion was added specifically between the **title and the horizontal line beneath it** — so that gap is now noticeably larger than the image-to-title gap. Together this means the title no longer sits crammed against the image, and even short titles feel intentionally placed rather than floating in empty white space.

### Result

The inside of each blog card now reads as deliberately laid out. The two orange elements have proper space between them, the photo isn't pinned against the spine, and short-title cards no longer have an awkward empty area between the title and the rest of the content. The spacing now feels balanced regardless of how long or short an individual blog title is.

---
