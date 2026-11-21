"use client";

import { useMemo, useState } from "react";
import { useNowSeconds } from "@/lib/hooks/useNow";
import type { ScheduleItem, ScheduleStatus } from "@/lib/types";

type Day = { date: string; label: string; short: string };

const statusLabel: Record<ScheduleStatus, { text: string; cls: string } | null> = {
  scheduled: null,
  call_room: { text: "Camera d'appello", cls: "bg-sky/10 text-sky" },
  in_progress: { text: "In corso", cls: "bg-brand text-white" },
  finished: { text: "Concluso", cls: "bg-ok/10 text-ok" },
  delayed: { text: "Ritardo", cls: "bg-warn/10 text-warn" },
  cancelled: { text: "Annullato", cls: "bg-ink/10 text-ink line-through" },
};

const genderLabel = { F: "Donne", M: "Uomini", X: "Misto" } as const;

const zurichDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich" });

export function ScheduleView({ items, days }: { items: ScheduleItem[]; days: readonly Day[] }) {
  const [picked, setDay] = useState<string | null>(null);
  const sec = useNowSeconds();
  const today = sec === null ? null : zurichDate.format(new Date(sec * 1000));
  // Nei giorni di gara si apre direttamente sul giorno corrente
  const day = picked ?? (days.find((d) => d.date === today) ?? days[0]).date;
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).sort(),
    [items],
  );

  const visible = items.filter(
    (i) =>
      i.event_date === day &&
      (category === "all" || i.category === category) &&
      (query === "" || i.discipline.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-white/95 px-4 py-3 backdrop-blur">
        <div role="tablist" aria-label="Giorno di gara" className="grid grid-cols-2 gap-2 sm:inline-grid">
          {days.map((d) => (
            <button
              key={d.date}
              role="tab"
              aria-selected={day === d.date}
              onClick={() => setDay(d.date)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                day === d.date ? "bg-navy text-white" : "bg-sand text-ink hover:bg-line"
              }`}
            >
              <span className="sm:hidden">{d.short}</span>
              <span className="hidden sm:inline">{d.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <label className="sr-only" htmlFor="cat">
            Categoria
          </label>
          <select
            id="cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-line bg-white px-3 py-2 text-sm"
          >
            <option value="all">Tutte le categorie</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="q">
            Cerca disciplina
          </label>
          <input
            id="q"
            type="search"
            placeholder="Cerca disciplina…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2 text-sm"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-muted">Nessuna gara per questa selezione.</p>
      ) : (
        <ol className="divide-y divide-line">
          {visible.map((i) => {
            const st = statusLabel[i.status];
            return (
              <li key={i.id} className="flex gap-4 py-4">
                <div className="w-16 shrink-0">
                  <time className="font-display text-2xl font-bold tabular-nums">
                    {i.start_time.slice(0, 5)}
                  </time>
                  {i.delay_min > 0 && <p className="text-xs font-semibold text-warn">+{i.delay_min}&apos;</p>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {i.discipline}
                    {i.round && <span className="font-normal text-muted"> · {i.round}</span>}
                  </p>
                  <p className="text-sm text-muted">
                    {i.category} {genderLabel[i.gender]}
                    {i.venue_area && <> · {i.venue_area}</>}
                  </p>
                  {(i.startlist_url || i.results_url) && (
                    <p className="mt-2 flex gap-3 text-sm font-semibold">
                      {i.startlist_url && (
                        <a href={i.startlist_url} target="_blank" rel="noopener" className="text-sky underline underline-offset-4">
                          Lista di partenza
                        </a>
                      )}
                      {i.results_url && (
                        <a href={i.results_url} target="_blank" rel="noopener" className="text-brand underline underline-offset-4">
                          Risultati
                        </a>
                      )}
                    </p>
                  )}
                </div>
                {st && (
                  <span className={`h-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${st.cls}`}>
                    {st.text}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
