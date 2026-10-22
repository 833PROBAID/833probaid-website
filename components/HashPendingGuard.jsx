import { HASH_PENDING_CSS, HASH_PENDING_SCRIPT } from "@/app/utils/hashPending";

/**
 * Render at the top of a server page whose client part calls useHashPin, so a
 * #hash load stays hidden until the target is in place. `css` adds page rules
 * (e.g. anchor scroll margins) to the same style tag.
 */
export default function HashPendingGuard({ css = "" }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HASH_PENDING_CSS + css }} />
      {/* Wrapped rather than a React <script>: the HTML parser still runs it
          before first paint, but React itself never renders a script element
          (which it rejects with a console error). */}
      <span
        hidden
        dangerouslySetInnerHTML={{
          __html: `<script>${HASH_PENDING_SCRIPT}</script>`,
        }}
      />
    </>
  );
}
