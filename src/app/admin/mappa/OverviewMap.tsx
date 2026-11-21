"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Marker } from "@/components/map/markers";
import { MAP_H, MAP_W, VenueBase, type MapLayer } from "@/components/map/VenueBase";
import type { MapPoint } from "@/lib/types";

/**
 * Mappa panoramica dell'admin:
 * clic su un marker = modifica; clic su un punto vuoto = nuovo punto in quella posizione.
 */
export function OverviewMap({ points, selectedId }: { points: MapPoint[]; selectedId?: string }) {
  const router = useRouter();
  const svg = useRef<SVGSVGElement>(null);
  const [layer, setLayer] = useState<MapLayer>("mappa");
  const [hover, setHover] = useState<string | null>(null);

  function onEmptyClick(e: React.MouseEvent<SVGSVGElement>) {
    const ctm = svg.current?.getScreenCTM();
    if (!ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    router.push(`/admin/mappa?x=${Math.round(pt.x)}&y=${Math.round(pt.y)}`, { scroll: false });
  }

  const hovered = points.find((p) => p.id === hover);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-white">
      <svg ref={svg} viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="block h-auto w-full cursor-crosshair" onClick={onEmptyClick}>
        <VenueBase layer={layer} />
        {points.map((p) => (
          <g
            key={p.id}
            className="cursor-pointer"
            onMouseEnter={() => setHover(p.id)}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/mappa?id=${p.id}`, { scroll: false });
            }}
          >
            <circle cx={p.x} cy={p.y} r="24" fill="transparent" />
            <Marker p={p} active={p.id === selectedId} dim={!!selectedId && p.id !== selectedId} />
          </g>
        ))}
        {hovered && (
          <g transform={`translate(${hovered.x} ${hovered.y - 34})`} pointerEvents="none">
            <rect x={-(hovered.name.length * 3.6 + 10)} y="-15" width={hovered.name.length * 7.2 + 20} height="24" rx="12" fill="#1b1b1b" />
            <text textAnchor="middle" y="2" fontSize="12" fontWeight="600" fill="#fff">
              {hovered.name}
            </text>
          </g>
        )}
      </svg>
      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow">
        Clicca su un punto vuoto per aggiungere un punto · clicca un simbolo per modificarlo
      </div>
      <button
        type="button"
        onClick={() => setLayer(layer === "mappa" ? "foto" : "mappa")}
        className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow"
      >
        {layer === "mappa" ? "Foto aerea" : "Mappa"}
      </button>
    </div>
  );
}
