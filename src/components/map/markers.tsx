import type { MapCategory, MapPoint } from "@/lib/types";
import { IconGlyph } from "./icons";

export const categoryColor: Record<MapCategory, string> = {
  gare: "#df2123",
  atleti: "#0b4f9c",
  servizi: "#1b1b1b",
  parcheggi: "#2f6fc0",
};

/** Marker con il pittogramma del punto (quadrato per i parcheggi). */
export function Marker({ p, active, dim, scale = 1 }: { p: Pick<MapPoint, "x" | "y" | "category" | "verified" | "icon">; active?: boolean; dim?: boolean; scale?: number }) {
  const color = categoryColor[p.category];
  const r = 16;
  const square = p.category === "parcheggi";
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${scale * (active ? 1.25 : 1)})`} opacity={dim ? 0.3 : 1} style={{ transition: "opacity .2s" }}>
      {active && <circle r="30" fill={color} opacity=".2" className="live-dot" />}
      {/* ombra */}
      <circle cy="2" r={r} fill="#000" opacity=".18" />
      {square ? (
        <rect x={-r} y={-r} width={r * 2} height={r * 2} rx="6" fill={color} stroke="#fff" strokeWidth="3" />
      ) : (
        <circle r={r} fill={color} stroke="#fff" strokeWidth="3" strokeDasharray={p.verified ? undefined : "5 3"} />
      )}
      <g
        transform="translate(-11 -11) scale(.9167)"
        color="#fff"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <IconGlyph name={p.icon} />
      </g>
    </g>
  );
}
