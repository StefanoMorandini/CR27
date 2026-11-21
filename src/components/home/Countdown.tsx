"use client";

import { useNowSeconds } from "@/lib/hooks/useNow";

type Labels = { days: string; hours: string; minutes: string; seconds: string };

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
}

/** Countdown con i numeri stampati su "pettorali". Durante le gare mostra "In corso". */
export function Countdown({
  startsAt,
  endsAt,
  units,
  liveLabel,
  finishedLabel,
  label,
}: {
  startsAt: string;
  endsAt: string;
  units: Labels;
  liveLabel: string;
  finishedLabel: string;
  label: string;
}) {
  const sec = useNowSeconds();
  const now = sec === null ? null : sec * 1000;
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();

  if (now !== null && now >= start && now <= end) {
    return (
      <p className="inline-flex items-center gap-3 rounded-full bg-red px-5 py-2.5 font-display text-lg font-black uppercase text-white">
        <span className="live-dot size-2.5 rounded-full bg-white" /> {liveLabel}
      </p>
    );
  }
  if (now !== null && now > end) {
    return <p className="font-display text-xl font-black uppercase text-red">{finishedLabel}</p>;
  }

  const values = parts(now === null ? 0 : start - now);
  const names = [units.days, units.hours, units.minutes, units.seconds];
  const tilt = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-muted">{label}</p>
      <div className="flex justify-center gap-2 sm:gap-4" role="timer" aria-live="off">
        {values.map((v, i) => (
          <div
            key={names[i]}
            className={`bib relative min-w-[72px] overflow-hidden rounded-md border border-line bg-white px-2 pb-2 text-center sm:min-w-24 sm:px-3 ${tilt[i]}`}
          >
            <div className="h-3 bg-red sm:h-4" aria-hidden />
            {/* fori delle spille */}
            <span className="absolute left-1.5 top-5 size-1.5 rounded-full bg-line sm:top-6" aria-hidden />
            <span className="absolute right-1.5 top-5 size-1.5 rounded-full bg-line sm:top-6" aria-hidden />
            <div className="font-display mt-1.5 text-[28px] font-black tabular-nums text-ink sm:text-5xl">
              {now === null ? "–" : String(v).padStart(i === 0 ? 1 : 2, "0")}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted sm:text-xs">{names[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
