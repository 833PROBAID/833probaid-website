/** Space kept above a #hash target, clearing the sticky navbar. */
export const HASH_OFFSET_PX = 200;

/**
 * Gives every content anchor the same offset useHashPin scrolls to, so the
 * browser's own fragment jumps (which can still fire late, e.g. on `load`)
 * land on the same spot instead of flush with the top.
 */
export const HASH_ANCHOR_CSS = `.homebook-content [id]{scroll-margin-top:${HASH_OFFSET_PX}px}`;
