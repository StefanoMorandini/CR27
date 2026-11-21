/**
 * Base della mappa dello Stadio Comunale di Bellinzona (nord in alto).
 * - "mappa": public/map/base.svg, generata da scripts/map/build_base.py (dati swisstopo)
 * - "foto":  public/map/swissimage.webp, foto aerea SWISSIMAGE © swisstopo
 * Sistema di coordinate: viewBox 0 0 1354 920 (lo stesso dei punti in `map_points`).
 */
export const MAP_W = 1354;
export const MAP_H = 920;

export type MapLayer = "mappa" | "foto";

export function VenueBase({ layer = "mappa" }: { layer?: MapLayer }) {
  return (
    <>
      <image
        href={layer === "foto" ? "/map/swissimage.webp" : "/map/base.svg"}
        x="0"
        y="0"
        width={MAP_W}
        height={MAP_H}
        preserveAspectRatio="none"
      />
      {layer === "foto" && (
        <text x={MAP_W - 8} y={MAP_H - 8} textAnchor="end" fontSize="11" fill="#fff" stroke="#000" strokeOpacity=".35" strokeWidth="2.5" paintOrder="stroke">
          Foto aerea SWISSIMAGE © swisstopo
        </text>
      )}
    </>
  );
}
