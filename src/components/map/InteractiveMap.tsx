"use client";

import { useEffect, useRef, useState } from "react";
import type { MapCategory, MapPoint } from "@/lib/types";
import { MAP_H, MAP_W, VenueBase, type MapLayer } from "./VenueBase";
import { Marker, categoryColor } from "./markers";
import { Icon } from "./icons";

export type MapLabels = {
  all: string;
  categories: Record<MapCategory, string>;
  indicative: string;
  zoomIn: string;
  zoomOut: string;
  select: string;
  pedane: string;
  layerMap: string;
  layerPhoto: string;
};

const ZOOMS = [1, 1.5, 2, 3];

export function InteractiveMap({ points, labels }: { points: MapPoint[]; labels: MapLabels }) {
  const [cat, setCat] = useState<MapCategory | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0);
  const [layer, setLayer] = useState<MapLayer>("mappa");
  const [viewW, setViewW] = useState(900);
  const scroller = useRef<HTMLDivElement>(null);
  const mapBox = useRef<HTMLDivElement>(null);

  // larghezza visibile della mappa (per dimensionare i marker)
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setViewW(e.contentRect.width || 900));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // raggio costante sullo schermo (≈14 px desktop, ≈9 px mobile) a ogni livello di zoom
  const targetPx = viewW < 600 ? 9 : 14;
  const markerScale = (targetPx * MAP_W) / (16 * viewW * ZOOMS[zoom]);

  const cats = (Object.keys(labels.categories) as MapCategory[]).filter((c) => points.some((p) => p.category === c));
  const visible = points.filter((p) => cat === "all" || p.category === cat);
  const pedane = points.filter((p) => p.category === "gare");
  const sel = points.find((p) => p.id === selected);

  function focus(p: MapPoint, scrollToMap = false) {
    setSelected(p.id);
    if (cat !== "all" && p.category !== cat) setCat("all");
    const el = scroller.current;
    if (el && ZOOMS[zoom] > 1) {
      const scale = el.scrollWidth / MAP_W;
      el.scrollTo({ left: p.x * scale - el.clientWidth / 2, top: p.y * scale - el.clientHeight / 2, behavior: "smooth" });
    }
    if (scrollToMap) mapBox.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function setZoomLevel(z: number) {
    const el = scroller.current;
    const prev = ZOOMS[zoom];
    const target = sel ?? null;
    const cx = el ? (el.scrollLeft + el.clientWidth / 2) / prev : 0;
    const cy = el ? (el.scrollTop + el.clientHeight / 2) / prev : 0;
    setZoom(z);
    requestAnimationFrame(() => {
      if (!el) return;
      const next = ZOOMS[z];
      if (target) {
        const scale = el.scrollWidth / MAP_W;
        el.scrollTo({ left: target.x * scale - el.clientWidth / 2, top: target.y * scale - el.clientHeight / 2 });
      } else {
        el.scrollTo({ left: cx * next - el.clientWidth / 2, top: cy * next - el.clientHeight / 2 });
      }
    });
  }

  const chip = (active: boolean) =>
    `shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition ${active ? "bg-ink text-white" : "bg-stone text-ink/75 hover:text-ink"}`;

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------ pannello pedane */}
      {pedane.length > 0 && (
        <section aria-labelledby="pedane-title">
          <h2 id="pedane-title" className="font-display mb-4 text-2xl font-black uppercase sm:text-3xl">
            {labels.pedane}
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {pedane.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => focus(p, true)}
                  className={`group flex h-full w-full flex-col items-center gap-2 rounded-2xl border p-4 text-center transition hover:-translate-y-0.5 hover:shadow-lg ${
                    p.id === selected ? "border-red bg-red-soft/60" : "border-line bg-white hover:border-red"
                  }`}
                >
                  <span className="grid size-16 place-items-center rounded-full bg-red text-white shadow-md shadow-red/25 transition group-hover:scale-105">
                    <Icon name={p.icon} className="size-10" />
                  </span>
                  <span className="text-sm font-bold leading-tight">{p.name}</span>
                  {!p.verified && <span className="text-[11px] font-semibold text-amber-700">{labels.indicative}</span>}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0" ref={mapBox}>
          {/* filtri + livello */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
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
            <div className="flex rounded-full bg-stone p-1 text-sm font-semibold" role="group" aria-label="Livello mappa">
              {(["mappa", "foto"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayer(l)}
                  aria-pressed={layer === l}
                  className={`rounded-full px-3.5 py-1.5 transition ${layer === l ? "bg-white text-ink shadow" : "text-ink/60 hover:text-ink"}`}
                >
                  {l === "mappa" ? labels.layerMap : labels.layerPhoto}
                </button>
              ))}
            </div>
          </div>

          {/* mappa */}
          <div className="relative overflow-hidden rounded-3xl border border-line bg-stone">
            <div ref={scroller} className="max-h-[78vh] overflow-auto overscroll-contain">
              <svg
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                style={{ width: `${ZOOMS[zoom] * 100}%` }}
                className="block h-auto select-none"
                role="img"
                aria-label="Mappa dello Stadio Comunale di Bellinzona"
              >
                <VenueBase layer={layer} />
                {visible.map((p) => (
                  <g
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    aria-label={p.name}
                    onClick={() => focus(p)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && focus(p)}
                    className="cursor-pointer outline-none"
                  >
                    <circle cx={p.x} cy={p.y} r={26 * markerScale} fill="transparent" />
                    <Marker p={p} active={p.id === selected} dim={!!selected && p.id !== selected} scale={markerScale} />
                  </g>
                ))}
              </svg>
            </div>
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

        {/* dettaglio + elenco */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-5 lg:min-h-32" aria-live="polite">
            {sel ? (
              <div className="flex gap-4">
                <span
                  className={`grid size-14 shrink-0 place-items-center text-white ${sel.category === "parcheggi" ? "rounded-xl" : "rounded-full"}`}
                  style={{ background: categoryColor[sel.category] }}
                >
                  <Icon name={sel.icon} className="size-9" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: categoryColor[sel.category] }}>
                    {labels.categories[sel.category]}
                  </p>
                  <h2 className="font-display mt-0.5 text-xl font-black uppercase leading-tight">{sel.name}</h2>
                  {sel.description && <p className="mt-2 text-sm text-muted">{sel.description}</p>}
                  {!sel.verified && (
                    <p className="mt-3 inline-block rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                      {labels.indicative}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">{labels.select}</p>
            )}
          </div>
          <ul className="max-h-[50vh] divide-y divide-line overflow-auto rounded-3xl border border-line bg-white lg:max-h-[55vh]">
            {visible.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => focus(p)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-stone/60 ${p.id === selected ? "bg-red-soft/60" : ""}`}
                >
                  <span
                    className={`grid size-9 shrink-0 place-items-center text-white ${p.category === "parcheggi" ? "rounded-lg" : "rounded-full"}`}
                    style={{ background: categoryColor[p.category] }}
                  >
                    <Icon name={p.icon} className="size-6" />
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
    </div>
  );
}
