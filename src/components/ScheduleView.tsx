"use client";

import { useMemo, useState } from "react";
import { useNowSeconds } from "@/lib/hooks/useNow";
import type { Dictionary } from "@/i18n/dictionaries/it";
import type { ScheduleItem, ScheduleStatus } from "@/lib/types";

const statusClass: Record<Exclude<ScheduleStatus, "scheduled">, string> = {
  call_room: "bg-blue-soft text-blue",
  in_progress: "bg-red text-white",
  finished: "bg-stone text-muted",
  delayed: "bg-amber-100 text-amber-800",
  cancelled: "bg-stone text-muted line-through",
};

const zurichDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich" });

export function ScheduleView({ items, labels }: { items: ScheduleItem[]; labels: Dictionary["schedule"] }) {
  const days = labels.days;
  const [picked, setDay] = useState<string | null>(null);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const sec = useNowSeconds();
  const today = sec === null ? null : zurichDate.format(new Date(sec * 1000));
  // Nei giorni di gara si apre direttamente sul giorno corrente
  const day = picked ?? (days.find((d) => d.date === today) ?? days[0]).date;

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))).sort(), [items]);

  const visible = items.filter(
    (i) =>
      i.event_date === day &&
      (category === "all" || i.category === category) &&
      (query === "" || i.discipline.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div>
      <div className="sticky top-[68px] z-20 -mx-4 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:top-[76px]">
        <div role="tablist" aria-label={labels.dayTabs} className="grid grid-cols-2 gap-1 rounded-full bg-stone p-1">
          {days.map((d) => (
            <button
              key={d.date}
              role="tab"
              aria-selected={day === d.date}
              onClick={() => setDay(d.date)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                day === d.date ? "bg-red text-white shadow" : "text-ink/70 hover:text-ink"
              }`}
            >
              <span className="sm:hidden">{d.short}</span>
              <span className="hidden sm:inline">{d.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <label className="sr-only" htmlFor="cat">
            {labels.category}
          </label>
          <select
            id="cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-line bg-white px-3 py-2 text-sm"
          >
            <option value="all">{labels.allCategories}</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="q">
            {labels.search}
          </label>
          <input
            id="q"
            type="search"
            placeholder={labels.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-line px-3 py-2 text-sm"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-muted">{labels.none}</p>
      ) : (
        <ol className="divide-y divide-line">
          {visible.map((i) => (
            <li key={i.id} className={`flex gap-4 py-4 ${i.status === "in_progress" ? "-mx-4 bg-red-soft px-4" : ""}`}>
              <div className="w-16 shrink-0">
                <time className="font-display text-2xl font-black tabular-nums">{i.start_time.slice(0, 5)}</time>
                {i.delay_min > 0 && <p className="text-xs font-bold text-amber-700">+{i.delay_min}&apos;</p>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {i.discipline}
                  {i.round && <span className="font-normal text-muted"> · {i.round}</span>}
                </p>
                <p className="text-sm text-muted">
                  {i.category} {labels.gender[i.gender]}
                  {i.venue_area && <> · {i.venue_area}</>}
                </p>
                {(i.startlist_url || i.results_url) && (
                  <p className="mt-2 flex gap-4 text-sm font-semibold">
                    {i.startlist_url && (
                      <a href={i.startlist_url} target="_blank" rel="noopener" className="text-blue underline underline-offset-4">
                        {labels.startlist}
                      </a>
                    )}
                    {i.results_url && (
                      <a href={i.results_url} target="_blank" rel="noopener" className="text-red underline underline-offset-4">
                        {labels.results}
                      </a>
                    )}
                  </p>
                )}
              </div>
              {i.status !== "scheduled" && (
                <span className={`h-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[i.status]}`}>
                  {labels.status[i.status]}
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
