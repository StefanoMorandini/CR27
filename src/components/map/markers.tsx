import type { MapCategory, MapPoint } from "@/lib/types";

export const categoryColor: Record<MapCategory, string> = {
  gare: "#df2123",
  atleti: "#0b4f9c",
  servizi: "#1b1b1b",
  parcheggi: "#2f6fc0",
};

/** Marker: cerchio numerato (P per i parcheggi). */
export function Marker({ p, n, active, dim, scale = 1 }: { p: MapPoint; n: number; active?: boolean; dim?: boolean; scale?: number }) {
  const color = categoryColor[p.category];
  const r = active ? 15 : 12;
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${scale})`} opacity={dim ? 0.25 : 1} style={{ transition: "opacity .2s" }}>
      {active && <circle r="24" fill={color} opacity=".18" className="live-dot" />}
      {p.category === "parcheggi" ? (
        <rect x={-r} y={-r} width={r * 2} height={r * 2} rx="4" fill={color} stroke="#fff" strokeWidth="2.5" />
      ) : (
        <circle r={r} fill={color} stroke="#fff" strokeWidth="2.5" strokeDasharray={p.verified ? undefined : "4 2"} />
      )}
      <text
        y="0.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize={active ? 13 : 11}
        fontWeight="800"
        fontFamily="var(--font-inter), sans-serif"
      >
        {p.category === "parcheggi" ? "P" : n || ""}
      </text>
    </g>
  );
}

