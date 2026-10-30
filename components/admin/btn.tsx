"use client";

import { useFormStatus } from "react-dom";

/**
 * A form submit button that shows its own loading state. While the server
 * action is running it disables itself and shows a spinner with a pending
 * label ("Uploading…" / "Saving…"), so an upload never looks frozen and can't
 * be fired twice. Must sit inside the <form> it submits (useFormStatus reads
 * the nearest form).
 */
export function Btn({
  children,
  variant = "solid",
  pendingLabel = "Saving…",
}: {
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "danger";
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  const v =
    variant === "solid"
      ? "bg-[var(--accent)] text-[var(--accent-ink)] hover:opacity-90"
      : variant === "danger"
        ? "border border-[var(--line)] text-[var(--color-error)] hover:border-[var(--color-error)]"
        : "border border-[var(--line)] text-[var(--fg)] hover:border-[var(--fg-muted)]";
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors disabled:cursor-wait disabled:opacity-80 ${v}`}
    >
      {pending ? (
        <>
          <span aria-hidden className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
