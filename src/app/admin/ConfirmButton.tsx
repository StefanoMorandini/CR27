"use client";

/** Pulsante di invio che chiede conferma (per le eliminazioni). */
export function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className="rounded-full border border-red/30 bg-white px-4 py-2 text-sm font-semibold text-red transition hover:bg-red-soft"
    >
      {children}
    </button>
  );
}
