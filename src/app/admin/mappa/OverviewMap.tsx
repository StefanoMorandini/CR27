"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Marker } from "@/components/map/markers";
import { usePanZoom } from "@/components/map/usePanZoom";
import { MAP_H, MAP_W, VenueBase, type MapLayer } from "@/components/map/VenueBase";
import type { MapPoint } from "@/lib/types";

const START = { x: 720, y: 560 };

/**
 * Mappa panoramica dell'admin (trascina e zooma come quella pubblica):
 * clic su un simbolo = modifica; clic su un punto vuoto = nuovo punto in quella posizione.
 */
export function OverviewMap({ points, selectedId }: { points: MapPoint[]; selectedId?: string }) {
  const router = useRouter();
  const [layer, setLayer] = useState<MapLayer>("mappa");
  const [hover, setHover] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pz = usePanZoom(svgRef, { mapW: MAP_W, mapH: MAP_H, minW: 140, initialCenter: START });
  const scale = (14 * pz.unitsPerPx) / 16;

  function onEmptyClick(e: React.MouseEvent<SVGSVGElement>) {
    if (pz.wasDrag()) return;
    const pt = pz.toMap(e.clientX, e.clientY);
    router.push(`/admin/mappa?x=${Math.round(pt.x)}&y=${Math.round(pt.y)}`, { scroll: false });
  }

  const hovered = points.find((p) => p.id === hover);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-white">
      <svg
        ref={svgRef}
        viewBox={pz.viewBox}
        className="absolute inset-0 block h-full w-full cursor-crosshair select-none"
        style={{ touchAction: pz.touchAction }}
        onClick={onEmptyClick}
        {...pz.handlers}
      >
        <VenueBase layer={layer} />
        {points.map((p) => (
          <g
            key={p.id}
            className="cursor-pointer"
            onMouseEnter={() => setHover(p.id)}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              if (!pz.wasDrag()) router.push(`/admin/mappa?id=${p.id}`, { scroll: false });
            }}
          >
            <circle cx={p.x} cy={p.y} r={24 * scale} fill="transparent" />
            <Marker p={p} active={p.id === selectedId} dim={!!selectedId && p.id !== selectedId} scale={scale} />
          </g>
        ))}
        {hovered && (
          <g transform={`translate(${hovered.x} ${hovered.y - 32 * scale}) scale(${scale})`} pointerEvents="none">
            <rect x={-(hovered.name.length * 3.6 + 10)} y="-15" width={hovered.name.length * 7.2 + 20} height="24" rx="12" fill="#1b1b1b" />
            <text textAnchor="middle" y="2" fontSize="12" fontWeight="600" fill="#fff">
              {hovered.name}
            </text>
          </g>
        )}
      </svg>
      <div className="pointer-events-none absolute left-3 top-3 max-w-[70%] rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow">
        Clic su un punto vuoto = nuovo punto · clic su un simbolo = modifica · trascina e zooma per spostarti
      </div>
      <button
        type="button"
        onClick={() => setLayer(layer === "mappa" ? "foto" : "mappa")}
        className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow"
      >
        {layer === "mappa" ? "Foto aerea" : "Mappa"}
      </button>
      <div className="absolute bottom-3 right-3 flex overflow-hidden rounded-xl border border-line bg-white shadow">
        <button type="button" onClick={() => pz.zoomAt(1.5)} className="grid size-9 place-items-center text-lg font-bold hover:bg-stone" aria-label="Ingrandisci">
          +
        </button>
        <button type="button" onClick={() => pz.zoomAt(1 / 1.5)} className="grid size-9 place-items-center border-l border-line text-lg font-bold hover:bg-stone" aria-label="Riduci">
          −
        </button>
        <button type="button" onClick={() => pz.reset()} className="grid size-9 place-items-center border-l border-line text-xs font-bold hover:bg-stone" aria-label="Vista intera">
          ⤢
        </button>
      </div>
    </div>
  );
}
