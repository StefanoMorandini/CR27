"use client";

import { useEffect, useRef, useState } from "react";
import { Marker } from "@/components/map/markers";
import { MAP_H, MAP_W, VenueBase, type MapLayer } from "@/components/map/VenueBase";
import type { MapCategory, MapPoint } from "@/lib/types";

/**
 * Selettore di posizione nella sidebar: clic sulla mappa = posizione del punto.
 * Il marker segue categoria e simbolo scelti nel form. Gli altri punti sono in trasparenza.
 */
export function MapPicker({
  point,
  others,
  initial,
}: {
  point?: MapPoint;
  others: MapPoint[];
  initial?: { x: number; y: number };
}) {
  const svg = useRef<SVGSVGElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const start = point ? { x: point.x, y: point.y } : initial ?? null;
  const [pos, setPos] = useState<{ x: number; y: number } | null>(start);
  const [category, setCategory] = useState<MapCategory>(point?.category ?? "gare");
  const [icon, setIcon] = useState(point?.icon ?? "punto");
  const [layer, setLayer] = useState<MapLayer>("mappa");

  // segue i campi "categoria" e "simbolo" del form
  useEffect(() => {
    const form = wrap.current?.closest("form");
    if (!form) return;
    const read = () => {
      const fd = new FormData(form);
      setCategory((fd.get("category") as MapCategory) ?? "gare");
      setIcon((fd.get("icon") as string) ?? "punto");
    };
    read();
    form.addEventListener("change", read);
    return () => form.removeEventListener("change", read);
  }, []);

  function onClick(e: React.MouseEvent<SVGSVGElement>) {
    const ctm = svg.current?.getScreenCTM();
    if (!ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    setPos({ x: Math.round(pt.x * 10) / 10, y: Math.round(pt.y * 10) / 10 });
  }

  return (
    <div ref={wrap}>
      <div className="relative overflow-hidden rounded-2xl border border-line">
        <svg ref={svg} viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="block h-auto w-full cursor-crosshair" onClick={onClick}>
          <VenueBase layer={layer} />
          {others.map((p) => (
            <g key={p.id} opacity=".4">
              <Marker p={p} scale={0.8} />
            </g>
          ))}
          {pos && <Marker p={{ x: pos.x, y: pos.y, category, icon, verified: true }} active scale={1.2} />}
        </svg>
        <button
          type="button"
          onClick={() => setLayer(layer === "mappa" ? "foto" : "mappa")}
          className="absolute right-2 top-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold shadow"
        >
          {layer === "mappa" ? "Foto aerea" : "Mappa"}
        </button>
      </div>
      <p className="mt-1.5 text-xs text-muted">
        {pos ? `Posizione ${pos.x.toFixed(0)}, ${pos.y.toFixed(0)} — clicca sulla mappa per spostarla.` : "Clicca sulla mappa per posizionare il punto."}
      </p>
      <input type="hidden" name="x" value={pos?.x ?? ""} />
      <input type="hidden" name="y" value={pos?.y ?? ""} />
    </div>
  );
}
