"use client";

import { useRef, useState } from "react";
import { Marker } from "@/components/map/markers";
import { MAP_H, MAP_W, VenueBase } from "@/components/map/VenueBase";
import type { MapCategory, MapPoint } from "@/lib/types";

/**
 * Selettore di posizione: clic sulla mappa = nuova posizione del punto.
 * Gli altri punti sono mostrati in trasparenza come riferimento.
 */
export function MapPicker({ point, others }: { point?: MapPoint; others: MapPoint[] }) {
  const svg = useRef<SVGSVGElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(point ? { x: point.x, y: point.y } : null);
  const [category, setCategory] = useState<MapCategory>(point?.category ?? "gare");

  function onClick(e: React.MouseEvent<SVGSVGElement>) {
    const el = svg.current;
    const ctm = el?.getScreenCTM();
    if (!el || !ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    setPos({ x: Math.round(pt.x * 10) / 10, y: Math.round(pt.y * 10) / 10 });
  }

  // segue la categoria scelta nel form (colore del marker)
  function onFormChange(e: React.SyntheticEvent<HTMLDivElement>) {
    const sel = (e.currentTarget.closest("form") as HTMLFormElement | null)?.elements.namedItem("category");
    if (sel instanceof HTMLSelectElement) setCategory(sel.value as MapCategory);
  }

  return (
    <div onFocusCapture={onFormChange} onMouseEnter={onFormChange}>
      <div className="overflow-hidden rounded-2xl border border-line">
        <svg ref={svg} viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="block h-auto w-full cursor-crosshair" onClick={onClick}>
          <VenueBase />
          {others.map((p) => (
            <g key={p.id} opacity=".35">
              <Marker p={p} n={0} scale={0.8} />
            </g>
          ))}
          {pos && (
            <Marker
              p={{ ...(point ?? ({} as MapPoint)), category, verified: true, x: pos.x, y: pos.y }}
              n={0}
              active
              scale={1.2}
            />
          )}
        </svg>
      </div>
      <p className="mt-1.5 text-xs text-muted">
        {pos ? `Posizione: ${pos.x.toFixed(0)}, ${pos.y.toFixed(0)} — clicca per spostarla.` : "Clicca sulla mappa per posizionare il punto."}
      </p>
      <input type="hidden" name="x" value={pos?.x ?? ""} />
      <input type="hidden" name="y" value={pos?.y ?? ""} />
    </div>
  );
}
