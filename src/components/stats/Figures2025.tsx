import { cantonNames, edition2025, keyFigures2025 } from "@/lib/stats2025";
import type { Dictionary } from "@/i18n/dictionaries/it";

type L = Dictionary["pages"]["sponsor"];

/** Cifre chiave dell'edizione 2025. */
export function KeyFigures({ t, compact = false }: { t: L; compact?: boolean }) {
  const f = keyFigures2025;
  const items = [
    { v: String(f.entries), l: t.figures.entries },
    { v: f.athletes, l: t.figures.athletes },
    { v: String(f.clubs), l: t.figures.clubs },
    { v: String(f.cantons), l: t.figures.cantons },
    { v: `${f.outsideTicinoPct}%`, l: t.figures.outside },
    { v: `${f.womenPct}%`, l: t.figures.women },
    { v: f.audience, l: t.figures.audience },
    { v: f.volunteers, l: t.figures.volunteers },
  ];
  return (
    <ul className={`grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 lg:grid-cols-4"}`}>
      {items.map((i) => (
        <li key={i.l} className="reveal rounded-3xl border border-line bg-white p-5">
          <span className="font-display block text-3xl font-black text-red sm:text-4xl">{i.v}</span>
          <span className="mt-1 block text-sm text-muted">{i.l}</span>
        </li>
      ))}
    </ul>
  );
}

/** Iscrizioni per cantone (barre orizzontali). */
export function CantonBars({ t }: { t: L }) {
  const max = Math.max(...edition2025.byCanton.map((c) => c.entries));
  return (
    <figure className="reveal rounded-3xl border border-line bg-white p-6">
      <figcaption className="font-display text-xl font-black uppercase">{t.cantonsTitle}</figcaption>
      <ul className="mt-5 space-y-2.5">
        {edition2025.byCanton.map((c) => (
          <li key={c.canton} className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 text-sm">
            <span className="font-semibold">{cantonNames[c.canton] ?? c.canton}</span>
            <span className="h-3 overflow-hidden rounded-full bg-stone">
              <span
                className={`block h-full rounded-full ${c.canton === "TI" ? "bg-red" : "bg-blue"}`}
                style={{ width: `${(100 * c.entries) / max}%` }}
              />
            </span>
            <span className="text-right tabular-nums text-muted">{c.entries}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">{t.cantonsNote}</p>
    </figure>
  );
}
