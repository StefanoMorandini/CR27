"use client";

import { useNowSeconds } from "@/lib/hooks/useNow";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    giorni: Math.floor(s / 86400),
    ore: Math.floor((s % 86400) / 3600),
    min: Math.floor((s % 3600) / 60),
    sec: s % 60,
  };
}

/** Countdown fino all'inizio delle gare; durante i giorni di gara mostra "In corso". */
export function Countdown({ startsAt, endsAt }: { startsAt: string; endsAt: string }) {
  const sec = useNowSeconds();
  const now = sec === null ? null : sec * 1000;

  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();

  if (now !== null && now >= start && now <= end) {
    return (
      <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-display text-xl font-bold uppercase text-brand">
        <span className="size-2.5 animate-pulse rounded-full bg-brand" /> Gare in corso
      </p>
    );
  }
  if (now !== null && now > end) {
    return <p className="font-display text-xl font-bold uppercase">Grazie a tutti! Arrivederci.</p>;
  }

  const p = parts(now === null ? 0 : start - now);
  return (
    <div className="flex gap-2 sm:gap-3" aria-label="Tempo all'inizio delle gare" role="timer">
      {Object.entries(p).map(([label, value]) => (
        <div key={label} className="min-w-16 rounded-lg bg-white/10 px-3 py-2 text-center ring-1 ring-white/15">
          <div className="font-display text-3xl font-bold tabular-nums sm:text-4xl">
            {now === null ? "–" : String(value).padStart(label === "giorni" ? 1 : 2, "0")}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-white/60">{label}</div>
        </div>
      ))}
    </div>
  );
}
