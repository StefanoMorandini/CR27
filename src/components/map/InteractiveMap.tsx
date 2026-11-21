"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MapCategory, MapPoint } from "@/lib/types";
import { MAP_H, MAP_W, VenueBase } from "./VenueBase";
import { Marker, categoryColor } from "./markers";

export type MapLabels = {
  all: string;
  categories: Record<MapCategory, string>;
  indicative: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
  select: string;
};

const ZOOMS = [1, 1.5, 2, 3];

export function InteractiveMap({ points, labels }: { points: MapPoint[]; labels: MapLabels }) {
  const [cat, setCat] = useState<MapCategory | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);

  // marker più grandi sugli schermi stretti (facili da toccare)
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setBaseScale(w < 480 ? 1.7 : w < 800 ? 1.3 : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const markerScale = baseScale / Math.sqrt(ZOOMS[zoom]);

  // numerazione stabile (parcheggi esclusi: hanno la "P")
  const numbered = useMemo(() => {
    let n = 0;
    return points.map((p) => ({ p, n: p.category === "parcheggi" ? 0 : ++n }));
  }, [points]);
  const cats = (Object.keys(labels.categories) as MapCategory[]).filter((c) => points.some((p) => p.category === c));
  const visible = numbered.filter(({ p }) => cat === "all" || p.category === cat);
  const sel = numbered.find(({ p }) => p.id === selected);

  function focus(p: MapPoint) {
    setSelected(p.id);
    // con lo zoom attivo, centra il punto nell'area visibile
    const el = scroller.current;
    if (el && ZOOMS[zoom] > 1) {
      const scale = el.scrollWidth / MAP_W;
      el.scrollTo({ left: p.x * scale - el.clientWidth / 2, top: p.y * scale - el.clientHeight / 2, behavior: "smooth" });
    }
  }

  function setZoomLevel(z: number) {
    const el = scroller.current;
    const prev = ZOOMS[zoom];
    const cx = el ? (el.scrollLeft + el.clientWidth / 2) / prev : 0;
    const cy = el ? (el.scrollTop + el.clientHeight / 2) / prev : 0;
    setZoom(z);
    requestAnimationFrame(() => {
      if (!el) return;
      const next = ZOOMS[z];
      el.scrollTo({ left: cx * next - el.clientWidth / 2, top: cy * next - el.clientHeight / 2 });
    });
  }

  const chip = (active: boolean) =>
    `shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition ${active ? "bg-ink text-white" : "bg-stone text-ink/75 hover:text-ink"}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">
        {/* filtri */}
        <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1">
          <button onClick={() => setCat("all")} className={chip(cat === "all")}>
            {labels.all}
          </button>
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={chip(cat === c)}>
              <span className="mr-1.5 inline-block size-2.5 rounded-full align-middle" style={{ background: categoryColor[c] }} />
              {labels.categories[c]}
            </button>
          ))}
        </div>

        {/* mappa */}
        <div className="relative overflow-hidden rounded-3xl border border-line bg-stone">
          <div ref={scroller} className="max-h-[75vh] overflow-auto overscroll-contain">
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              style={{ width: `${ZOOMS[zoom] * 100}%` }}
              className="block h-auto select-none"
              role="img"
              aria-label="Mappa dello Stadio Comunale di Bellinzona"
            >
              <VenueBase />
              {visible.map(({ p, n }) => (
                <g
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  aria-label={p.name}
                  onClick={() => focus(p)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && focus(p)}
                  className="cursor-pointer outline-none"
                >
                  <circle cx={p.x} cy={p.y} r={22 * markerScale} fill="transparent" />
                  <Marker p={p} n={n} active={p.id === selected} dim={!!selected && p.id !== selected} scale={markerScale} />
                </g>
              ))}
            </svg>
          </div>
          {/* zoom */}
          <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow">
            <button
              onClick={() => setZoomLevel(Math.min(zoom + 1, ZOOMS.length - 1))}
              disabled={zoom === ZOOMS.length - 1}
              aria-label={labels.zoomIn}
              className="grid size-10 place-items-center text-xl font-bold hover:bg-stone disabled:opacity-30"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(zoom - 1, 0))}
              disabled={zoom === 0}
              aria-label={labels.zoomOut}
              className="grid size-10 place-items-center border-t border-line text-xl font-bold hover:bg-stone disabled:opacity-30"
            >
              −
            </button>
          </div>
        </div>
      </div>

      {/* elenco + dettaglio */}
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-line bg-white p-5 lg:min-h-28" aria-live="polite">
          {sel ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: categoryColor[sel.p.category] }}>
                {labels.categories[sel.p.category]}
              </p>
              <h2 className="font-display mt-1 text-2xl font-black uppercase leading-tight">{sel.p.name}</h2>
              {sel.p.description && <p className="mt-2 text-muted">{sel.p.description}</p>}
              {!sel.p.verified && (
                <p className="mt-3 inline-block rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                  {labels.indicative}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">{labels.select}</p>
          )}
        </div>
        <ul className="max-h-[50vh] divide-y divide-line overflow-auto rounded-3xl border border-line bg-white lg:max-h-[55vh]">
          {visible.map(({ p, n }) => (
            <li key={p.id}>
              <button
                onClick={() => focus(p)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-stone/60 ${p.id === selected ? "bg-red-soft/60" : ""}`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center text-xs font-black text-white ${p.category === "parcheggi" ? "rounded-md" : "rounded-full"}`}
                  style={{ background: categoryColor[p.category] }}
                >
                  {p.category === "parcheggi" ? "P" : n}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-tight">{p.name}</span>
                  {!p.verified && <span className="text-xs text-amber-700">{labels.indicative}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
