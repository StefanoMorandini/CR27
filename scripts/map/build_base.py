"""
Genera public/map/base.svg — mappa di base dello Stadio Comunale di Bellinzona.

Fonti (swisstopo, open data — citare "© swisstopo"):
- Carta nazionale (ch.swisstopo.pixelkarte-farbe): edifici, strade, aree sportive e alberi,
  vettorializzati in topo_paths.json / trees.json
- SWISSIMAGE (ch.swisstopo.swissimage): rilievo di pista, campi, pedane e parcheggi
Sistema di coordinate: viewBox 0 0 1354 1159 (nord in alto, ~0.41 m per unità).
Pipeline: vectorize.py (maschere dalla carta) → trace.js (potrace) → questo script.
Esecuzione: python3 scripts/map/build_base.py
"""
import json
import math
from pathlib import Path

HERE = Path(__file__).parent
topo = json.loads((HERE / "topo_paths.json").read_text())
trees = json.loads((HERE / "trees.json").read_text())

W, H = 1354, 1159

# Stadio: centro della pista e orientamento (rilevati da SWISSIMAGE)
CX, CY, ROT = 692, 516, 43
STRAIGHT = 204  # rettilinei 84,39 m (≈2.42 unità/m)
R_IN, R_OUT = 88, 106.5  # raggio interno 36,5 m; bordo esterno pista

C = {
    "bg": "#f3f1ec", "sport": "#dcebd5", "road": "#ffffff", "roadEdge": "#e2ddd5",
    "bld": "#e0dbd3", "bldEdge": "#cbc4b9", "tree": "#c5dcb8", "grass": "#a9d29a",
    "grass2": "#b4d9a5", "turf": "#8fc77f", "track": "#e2725f", "track2": "#d9675a",
    "sand": "#ecdcaa", "mat": "#3b6fb6", "stand": "#d3ccc2", "park": "#dfe9f7",
    "parkEdge": "#9ab8e2", "label": "#6b6f75",
}

def lanes():
    out = []
    for i in range(7):
        r = R_IN + i * 3
        out.append(f'<rect x="{-(STRAIGHT / 2 + r):.1f}" y="{-r}" width="{STRAIGHT + 2 * r:.1f}" height="{2 * r}" rx="{r}"/>')
    # corsie del prolungamento a sud-est (partenza 100 m)
    for i in range(7):
        y = -(R_IN + i * 3)
        out.append(f'<line x1="192" y1="{y}" x2="{STRAIGHT / 2:.1f}" y2="{y}"/>')
    return "".join(out)

def arc_band(cx, r1, r2, a0, a1):
    """Settore di corona circolare (gradinate in curva), angoli in gradi."""
    p = lambda r, a: (cx + r * math.cos(math.radians(a)), r * math.sin(math.radians(a)))
    x1, y1 = p(r2, a0); x2, y2 = p(r2, a1); x3, y3 = p(r1, a1); x4, y4 = p(r1, a0)
    large = 1 if a1 - a0 > 180 else 0
    return (f"M{x1:.1f} {y1:.1f}A{r2} {r2} 0 {large} 1 {x2:.1f} {y2:.1f}"
            f"L{x3:.1f} {y3:.1f}A{r1} {r1} 0 {large} 0 {x4:.1f} {y4:.1f}Z")

def pitch(cx, cy, rot, w, h, fill, stripes=True):
    """Campo da calcio con linee (w lungo il lato maggiore)."""
    s = [f'<g transform="translate({cx} {cy}) rotate({rot})">',
         f'<rect x="{-w / 2}" y="{-h / 2}" width="{w}" height="{h}" fill="{fill}"/>']
    if stripes:
        n = 12
        for i in range(0, n, 2):
            s.append(f'<rect x="{-w / 2 + i * w / n:.1f}" y="{-h / 2}" width="{w / n:.1f}" height="{h}" fill="#fff" opacity=".07"/>')
    m = 6
    box_d, box_w = min(40, w * 0.15), min(97, h * 0.6)
    s.append('<g fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.3">')
    s.append(f'<rect x="{-w / 2 + m}" y="{-h / 2 + m}" width="{w - 2 * m}" height="{h - 2 * m}"/>')
    s.append(f'<line x1="0" y1="{-h / 2 + m}" x2="0" y2="{h / 2 - m}"/><circle r="{min(22, h * 0.14):.1f}"/>')
    s.append(f'<rect x="{-w / 2 + m}" y="{-box_w / 2:.1f}" width="{box_d:.1f}" height="{box_w:.1f}"/>')
    s.append(f'<rect x="{w / 2 - m - box_d:.1f}" y="{-box_w / 2:.1f}" width="{box_d:.1f}" height="{box_w:.1f}"/>')
    s.append("</g></g>")
    return "".join(s)

stadium = f"""
<g transform="translate({CX} {CY}) rotate({ROT})">
  <!-- gradinate: rettilineo sud-ovest e curva sud-est -->
  <rect x="-125" y="110" width="227" height="20" fill="{C['stand']}"/>
  <g stroke="#fff" stroke-opacity=".5" stroke-width=".8"><line x1="-125" y1="117" x2="102" y2="117"/><line x1="-125" y1="124" x2="102" y2="124"/></g>
  <path d="{arc_band(STRAIGHT / 2, 110, 132, -15, 90)}" fill="{C['stand']}"/>
  <!-- tribuna principale -->
  <rect x="-72" y="-178" width="122" height="25" fill="{C['bld']}" stroke="{C['bldEdge']}"/>
  <!-- pista, fascia lungo la tribuna, prolungamento del rettilineo -->
  <rect x="{-(STRAIGHT / 2 + R_OUT):.1f}" y="{-R_OUT}" width="{STRAIGHT + 2 * R_OUT}" height="{2 * R_OUT}" rx="{R_OUT}" fill="{C['track']}"/>
  <rect x="-82" y="-142" width="254" height="40" fill="{C['track']}"/>
  <rect x="92" y="{-R_OUT}" width="102" height="20" fill="{C['track']}"/>
  <g fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".7">{lanes()}</g>
  <!-- pedana del lungo/triplo con due buche -->
  <rect x="-55" y="-134" width="190" height="6" fill="{C['track2']}"/>
  <rect x="-78" y="-138" width="22" height="13" fill="{C['sand']}"/>
  <rect x="136" y="-138" width="22" height="13" fill="{C['sand']}"/>
  <!-- campo interno (prato chiuso) -->
  {pitch(0, 0, 0, 267, 163, C['grass'])}
  <rect x="-133.5" y="-81.5" width="267" height="163" fill="url(#closed)"/>
  <!-- partenza 100 m (prolungamento a sud-est, a destra della tribuna) e arrivo (nord-ovest) -->
  <g stroke="#fff" stroke-width="2.4"><line x1="{-STRAIGHT / 2 + 242:.1f}" y1="-88" x2="{-STRAIGHT / 2 + 242:.1f}" y2="-106"/><line x1="{-STRAIGHT / 2:.1f}" y1="-88" x2="{-STRAIGHT / 2:.1f}" y2="-106"/></g>
  <!-- gabbia disco/martello -->
  <circle cx="-172.7" cy="23" r="5" fill="#fff"/>
  <path d="M-178.5 18.5a7.5 7.5 0 1 0 11.6 0" fill="none" stroke="#7d828a" stroke-width="1.8" stroke-linecap="round"/>
  <!-- materassi: alto (nord-ovest) e asta (sud-est) -->
  <rect x="-161" y="-37" width="13" height="12" rx="1.5" fill="{C['mat']}"/>
  <rect x="138" y="45" width="13" height="13" rx="1.5" fill="{C['mat']}"/>
</g>"""

# Parcheggi (rilevati su SWISSIMAGE)
parkings = {
    "chiusi": "835,268 900,215 985,262 950,352 872,382 808,318",
    "nordovest": "466,312 540,296 556,338 482,354",
    "ovest": "300,462 366,432 414,480 340,552",
    "sud": "675,840 865,888 840,1002 672,872",
}

def label(x, y, text, rot=0, size=11, weight=600, fill=None, spacing=0):
    t = f' transform="rotate({rot} {x} {y})"' if rot else ""
    ls = f' letter-spacing="{spacing}"' if spacing else ""
    return (f'<text x="{x}" y="{y}"{t}{ls} font-size="{size}" font-weight="{weight}" '
            f'fill="{fill or C["label"]}" text-anchor="middle">{text}</text>')

labels = "".join([
    label(714, 104, "Via Mirasole", -33, 10, 500),
    label(742, 238, "Via Lucomagno", 40, 10, 500),
    label(1172, 420, "Viale Giuseppe Motta", 38, 10, 500),
    label(548, 782, "Via Luigi Lavizzari", -18, 10, 500),
    label(905, 870, "Via Luigi Lavizzari", 9, 10, 500),
    label(700, 528, "PRATO CHIUSO", 43, 11, 700, "#ffffff", 2),
    label(1022, 640, "Campo di riscaldamento", 22, 12, 700, "#3f6b35"),
    label(478, 690, "Campo ovest", 62, 12, 700, "#3f6b35"),
    label(790, 372, "Tribuna", 43, 10, 700),
])

scale = (f'<g transform="translate(24 {H - 24})"><rect x="0" y="-4" width="121" height="4" fill="#1b1b1b"/>'
         f'<rect x="60.5" y="-4" width="60.5" height="4" fill="#fff" stroke="#1b1b1b" stroke-width=".8"/>'
         f'<text x="0" y="-9" font-size="10" font-weight="600" fill="#1b1b1b">0</text>'
         f'<text x="121" y="-9" font-size="10" font-weight="600" fill="#1b1b1b" text-anchor="middle">50 m</text></g>')
north = ('<g transform="translate(1318 38)"><circle r="18" fill="#fff" stroke="#d8d2c8"/>'
         '<path d="M0 -12L6 5 0 1 -6 5Z" fill="#1b1b1b"/>'
         '<text y="14" text-anchor="middle" font-size="8" font-weight="700" fill="#1b1b1b">N</text></g>')
attribution = f'<text x="1346" y="{H - 8}" font-size="9" fill="#8a8f96" text-anchor="end">Base cartografica © swisstopo</text>'

tree_svg = "".join(f'<circle cx="{x}" cy="{y}" r="5.5"/>' for x, y in trees)
park_svg = "".join(f'<polygon points="{p}"/>' for p in parkings.values())

svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="Inter, Arial, sans-serif">
<defs>
  <pattern id="closed" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="9" stroke="#fff" stroke-opacity=".35" stroke-width="2.2"/>
  </pattern>
  <pattern id="park" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(43)">
    <line x1="0" y1="0" x2="0" y2="7" stroke="{C['parkEdge']}" stroke-opacity=".45" stroke-width="1.2"/>
  </pattern>
</defs>
<rect width="{W}" height="{H}" fill="{C['bg']}"/>
<path d="{topo['sport']}" fill="{C['sport']}" fill-rule="evenodd"/>
<path d="{topo['roads']}" fill="{C['road']}" stroke="{C['roadEdge']}" stroke-width="1" fill-rule="evenodd"/>
<g fill="{C['park']}" stroke="{C['parkEdge']}" stroke-width="1.2" stroke-dasharray="4 3">{park_svg}</g>
<g fill="url(#park)">{park_svg}</g>
{pitch(478, 674, 61.5, 225, 150, C['grass2'])}
{pitch(1026, 686, 22, 255, 155, C['turf'])}
{pitch(1021, 523, 24, 70, 48, C['turf'], False)}
<g fill="{C['tree']}">{tree_svg}</g>
<path d="{topo['buildings']}" fill="{C['bld']}" stroke="{C['bldEdge']}" stroke-width=".8" fill-rule="evenodd"/>
{stadium}
{labels}
{scale}{north}{attribution}
</svg>
"""
out = HERE.parent.parent / "public" / "map" / "base.svg"
out.write_text(svg)
print(out, round(len(svg) / 1024), "KB")
