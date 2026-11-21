"""
Crea le maschere (edifici, strade, aree sportive) e gli alberi dalla carta nazionale swisstopo.
Uso: python3 scripts/map/vectorize.py <pixelkarte.png> <cartella-output>
Poi: node scripts/map/trace.js <cartella-output>   (vettorializza le maschere con potrace)
La carta va scaricata a z19 (WMTS ch.swisstopo.pixelkarte-farbe), 2 px = 1 unità mappa.
"""
import json
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

src, out = sys.argv[1], Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
im = np.asarray(Image.open(src).convert("RGB")).astype(int)
H, W, _ = im.shape
r, g, b = im[..., 0], im[..., 1], im[..., 2]

def morph(mask, k, kind):
    img = Image.fromarray((mask * 255).astype(np.uint8))
    a, b_ = (ImageFilter.MinFilter, ImageFilter.MaxFilter) if kind == "open" else (ImageFilter.MaxFilter, ImageFilter.MinFilter)
    return np.asarray(img.filter(a(k)).filter(b_(k))) > 128

def save(mask, name):
    Image.fromarray(np.where(mask, 0, 255).astype(np.uint8)).save(out / name)

# zone con scritte grandi (unità mappa): x0, y0, x1, y1
TEXT = [(700, 135, 1185, 230), (815, 262, 965, 378), (455, 258, 540, 305)]

black = (r < 60) & (g < 60) & (b < 60)
bld = morph(black, 9, "open")          # via linee e testi sottili
strong = morph(black, 27, "open")      # via anche le lettere grandi
for x0, y0, x1, y1 in TEXT:
    bld[y0 * 2:y1 * 2, x0 * 2:x1 * 2] = strong[y0 * 2:y1 * 2, x0 * 2:x1 * 2]
save(bld, "m_buildings.png")

white = (r > 250) & (g > 250) & (b > 250)
orange = (r > 225) & (g > 140) & (g < 200) & (b > 120) & (b < 185) & (r - b > 50)   # strade principali
road = morph(morph(white | orange, 3, "open"), 5, "close")
for x0, y0, x1, y1 in TEXT[1:]:
    road[y0 * 2:y1 * 2, x0 * 2:x1 * 2] = False
save(road, "m_roads.png")

sport = ((abs(r - 218) < 6) & (abs(g - 232) < 6) & (abs(b - 215) < 6)) | ((abs(r - 230) < 5) & (abs(g - 243) < 5) & (abs(b - 225) < 5))
save(morph(sport, 9, "close"), "m_sport.png")

# alberi: puntini verdi → centri
tree = (abs(r - 131) < 30) & (abs(g - 172) < 30) & (abs(b - 112) < 30)
seen = np.zeros((H, W), bool)
pts = []
for y, x in zip(*np.nonzero(tree)):
    if seen[y, x]:
        continue
    q = deque([(y, x)]); seen[y, x] = True; acc = []
    while q:
        cy, cx = q.popleft(); acc.append((cy, cx))
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < H and 0 <= nx < W and tree[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True; q.append((ny, nx))
    if 30 < len(acc) < 600:
        a = np.array(acc)
        pts.append((round(a[:, 1].mean() / 2, 1), round(a[:, 0].mean() / 2, 1)))
json.dump(pts, open(out / "trees.json", "w"))
print("alberi", len(pts))
