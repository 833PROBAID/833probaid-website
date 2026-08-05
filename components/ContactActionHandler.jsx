"use client";

import { useEffect } from "react";

/**
 * Makes the `.contact-item` rows that come from GrapesJS page content
 * actionable on click:
 *
 *   .probaid-phone      -> tel:8337762243              (override: data-phone)
 *   .probaid-email      -> https://833probaid.com      (override: data-href)
 *   .probaid-info-email -> mailto:info@833probaid.com  (override: data-email)
 *
 * The markup lives in DB-stored HTML rendered through dangerouslySetInnerHTML,
 * so the listener is delegated on `document` and a MutationObserver keeps the
 * a11y attributes in sync as pages/blocks are swapped in.
 */

const DEFAULT_PHONE = "8337762243";
const INFO_EMAIL = "info@833probaid.com";
const SITE_URL = "https://833probaid.com";

const PHONE_CLASS = "probaid-phone";
const EMAIL_CLASS = "probaid-email";
const INFO_EMAIL_CLASS = "probaid-info-email";

const SELECTOR = `.${PHONE_CLASS}, .${EMAIL_CLASS}, .${INFO_EMAIL_CLASS}`;
const READY_ATTR = "data-contact-action-ready";

/** Resolves an element to the action it should trigger, or null. */
const getAction = (element) => {
	const { classList, dataset } = element;

	if (classList.contains(PHONE_CLASS)) {
		const digits = (dataset.phone || DEFAULT_PHONE).replace(/[^\d+]/g, "");
		return digits ? { href: `tel:${digits}`, label: `Call ${digits}` } : null;
	}

	if (classList.contains(INFO_EMAIL_CLASS)) {
		const address = dataset.email || INFO_EMAIL;
		return { href: `mailto:${address}`, label: `Email ${address}` };
	}

	if (classList.contains(EMAIL_CLASS)) {
		const url = dataset.href || SITE_URL;
		return { href: url, label: `Visit ${url.replace(/^https?:\/\//, "")}` };
	}

	return null;
};

export default function ContactActionHandler() {
	useEffect(() => {
		const activate = (event) => {
			const element = event.target?.closest?.(SELECTOR);
			if (!element) return;
			// Real links/buttons inside the row keep their own behaviour.
			if (event.target.closest("a, button")) return;

			const action = getAction(element);
			if (!action) return;

			event.preventDefault();
			window.location.href = action.href;
		};

		const handleKeyDown = (event) => {
			if (event.key !== "Enter" && event.key !== " ") return;
			activate(event);
		};

		// Mark contact rows as focusable links for keyboard + screen readers.
		const markContactItems = () => {
			document
				.querySelectorAll(`${SELECTOR}:not([${READY_ATTR}])`)
				.forEach((element) => {
					element.setAttribute(READY_ATTR, "true");
					element.setAttribute("role", "link");
					element.setAttribute("tabindex", "0");

					const action = getAction(element);
					if (action && !element.hasAttribute("aria-label")) {
						element.setAttribute("aria-label", action.label);
					}
				});
		};

		markContactItems();

		let frame = 0;
		const observer = new MutationObserver(() => {
			if (frame) return;
			frame = window.requestAnimationFrame(() => {
				frame = 0;
				markContactItems();
			});
		});
		observer.observe(document.body, { childList: true, subtree: true });

		document.addEventListener("click", activate);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			if (frame) window.cancelAnimationFrame(frame);
			observer.disconnect();
			document.removeEventListener("click", activate);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return null;
}
