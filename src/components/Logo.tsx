import Link from "next/link";

/**
 * Logo provvisorio (wordmark). Quando arriva il logo ufficiale:
 * salvarlo in /public/logo.svg e sostituire il contenuto del <Link> con <Image>.
 */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Home — Regionali 2027 Bellinzona">
      <span className="grid size-9 place-items-center rounded-md bg-brand font-display text-lg font-extrabold text-white">
        27
      </span>
      <span className="leading-none">
        <span
          className={`block font-display text-lg font-bold uppercase tracking-wide ${inverted ? "text-white" : "text-ink"}`}
        >
          Regionali 2027
        </span>
        <span className={`block text-xs ${inverted ? "text-white/70" : "text-muted"}`}>
          Atletica · Bellinzona
        </span>
      </span>
    </Link>
  );
}
