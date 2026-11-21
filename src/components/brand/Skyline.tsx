/**
 * Skyline stilizzato di Bellinzona (viewBox 1600×400):
 * - Alpi sullo sfondo e versanti della valle
 * - Castelgrande sulla rocca, con Torre Bianca, Torre Nera e la Murata che
 *   scende verso ovest (sinistra) fino al fiume
 * - Montebello sul versante est e, più in alto, Sasso Corbaro tra i boschi
 * - i tetti della città vecchia e il campanile della Collegiata
 * Merli "a coda di rondine", tipici dei castelli di Bellinzona.
 * I castelli stanno nella fascia x 420–1260, visibile anche su mobile.
 */

// ------------------------------------------------------------ generatori

/** Pseudo-casuale deterministico (stesso disegno a ogni render). */
function rng(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/** Cresta montuosa: interpola i punti di controllo e aggiunge irregolarità naturali. */
function ridge(points: [number, number][], rough: number, seed: number) {
  const r = rng(seed);
  let d = `M0 400V${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const steps = Math.max(1, Math.round((x2 - x1) / 14));
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      // curva morbida tra i punti (smoothstep) + rumore
      const e = t * t * (3 - 2 * t);
      const y = y1 + (y2 - y1) * e + (s < steps ? (r() - 0.5) * rough : 0);
      d += `L${(x1 + (x2 - x1) * t).toFixed(0)} ${y.toFixed(1)}`;
    }
  }
  return d + "V400Z";
}

/** Merli a coda di rondine lungo un bordo orizzontale (y = sommità del muro). */
function swallowtails(x: number, y: number, w: number, m = 9, gap = 6) {
  let d = "";
  for (let cx = x + 1; cx + m <= x + w; cx += m + gap) {
    // merlo con intaglio a V in cima
    d += `M${cx} ${y + 1}V${y - m}l${m * 0.3} 0l${m * 0.2} ${m * 0.45}l${m * 0.2} ${-m * 0.45}l${m * 0.3} 0V${y + 1}Z`;
  }
  return d;
}

/** Muro rettangolare con merli a coda di rondine. */
function wall(x: number, y: number, w: number, h: number, m?: number) {
  return `M${x} ${y}h${w}v${h}h${-w}Z` + swallowtails(x, y, w, m);
}

/** Torre: corpo + merli + piccola feritoia. */
function tower(x: number, y: number, w: number, bottom: number, m = 7) {
  return `M${x} ${y}h${w}V${bottom}h${-w}Z` + swallowtails(x, y, w, m, 4);
}

/** Muro merlato in pendenza (Murata, mura di Montebello). */
function slopedWall(xa: number, ya: number, xb: number, yb: number, h: number) {
  // sempre da sinistra a destra
  const [x1, y1, x2, y2] = xa < xb ? [xa, ya, xb, yb] : [xb, yb, xa, ya];
  const yAt = (x: number) => y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
  let d = `M${x1} ${y1}L${x2} ${y2}V${y2 + h}L${x1} ${y1 + h}Z`;
  for (let x = x1 + 2; x + 10 <= x2; x += 15) {
    d += `M${x} ${yAt(x) + 2}V${yAt(x) - 9}h3l2 4l2 -4h3V${yAt(x + 10) + 2}Z`;
  }
  return d;
}

function houses() {
  const r = rng(11);
  let d = "";
  let x = -10;
  while (x < 1610) {
    const w = 22 + Math.round(r() * 30);
    const h = 12 + Math.round(r() * 20);
    const roof = 6 + Math.round(r() * 7);
    const base = 374;
    d += `M${x} ${base}V${base - h}l${w / 2} ${-roof}l${w / 2} ${roof}V${base}Z`;
    x += w + 1;
  }
  return d;
}

/** Bosco sul crinale: chiome e conifere che spuntano sopra la linea del pendio. */
function trees(from: number, to: number, yAt: (x: number) => number, skip: [number, number][], seed: number) {
  const r = rng(seed);
  let d = "";
  for (let x = from; x < to; x += 9 + r() * 10) {
    if (skip.some(([a, b]) => x > a && x < b)) continue;
    const y = yAt(x) + 3;
    if (r() > 0.4) {
      const rad = 4 + r() * 4;
      d += `M${x - rad} ${y}a${rad} ${rad} 0 1 1 ${rad * 2} 0Z`;
    } else {
      const h = 10 + r() * 8;
      d += `M${x} ${y - h}l5 ${h}h-10Z`;
    }
  }
  return d;
}

// ------------------------------------------------------------ scena

/** Versante est (dove stanno Montebello e Sasso Corbaro): pianori ai castelli. */
const eastSlope =
  "M690 400V352C760 340 820 300 868 268L1000 262C1050 236 1095 196 1138 172L1240 168C1300 150 1380 120 1460 108C1520 100 1570 104 1600 108V400Z";
const eastSlopeY = (x: number) =>
  x < 868 ? 352 - ((x - 690) / 178) * 84 : x < 1000 ? 266 : x < 1138 ? 262 - ((x - 1000) / 138) * 90 : x < 1240 ? 170 : 168 - ((x - 1240) / 360) * 60;

const castelgrande = [
  // rocca con pareti scoscese
  "M455 400L486 338C500 314 520 296 548 290L560 286H752L770 292C786 302 798 318 806 340L828 400Z",
  // mura del recinto sul pianoro
  wall(556, 260, 200, 30),
  // Torre Bianca (snella) e Torre Nera (più massiccia)
  tower(596, 170, 28, 262),
  tower(690, 190, 38, 262),
  // edificio residenziale tra le torri
  "M632 238h46v24h-46ZM632 238l23-12 23 12Z",
  // Murata: scende verso ovest fino al fiume, con una porta-torre
  slopedWall(556, 276, 400, 352, 18),
  tower(470, 298, 20, 344, 6),
].join("");

const montebello = [
  slopedWall(872, 262, 790, 318, 14),
  wall(868, 232, 136, 34),
  tower(920, 178, 32, 236),
  tower(982, 206, 20, 236, 6),
].join("");

const sassoCorbaro = [wall(1148, 136, 88, 34), tower(1148, 96, 30, 140)].join("");

/** Campanile della Collegiata ai piedi di Castelgrande */
const campanile = "M842 374V286h18v88ZM840 286l11-26 11 26Z";

const farAlps = ridge(
  [
    [0, 168], [110, 122], [220, 152], [320, 96], [420, 140], [520, 112], [630, 150], [750, 88],
    [870, 132], [980, 104], [1090, 140], [1210, 82], [1330, 124], [1450, 98], [1600, 138],
  ],
  10,
  3,
);

const valley = ridge(
  [
    [0, 150], [90, 170], [200, 214], [300, 262], [400, 300], [520, 326], [700, 334], [820, 300],
    [960, 236], [1100, 182], [1250, 142], [1420, 118], [1600, 116],
  ],
  7,
  5,
);

export function Skyline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 400" className={className} aria-hidden preserveAspectRatio="xMidYMax meet">

      {/* Alpi lontane */}
      <path fill="#e3ebf6" d={farAlps} />

      {/* versanti della valle */}
      <path fill="#d9e4f2" d={valley} />

      {/* versante est con boschi, Montebello e Sasso Corbaro */}
      <path fill="#d0deef" d={eastSlope} />
      <path fill="#d0deef" d={trees(700, 1600, eastSlopeY, [[860, 1010], [1140, 1245]], 21)} />

      {/* città, castelli */}
      <g fill="#b9cce7">
        <path d={montebello} />
        <path d={sassoCorbaro} />
        <path d={houses()} />
        <path d={castelgrande} />
        <path d={campanile} />
        <rect x="0" y="372" width="1600" height="28" />
      </g>
      {/* pareti di roccia di Castelgrande */}
      <path
        stroke="#a9c0e0"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        d="M500 330l-10 28M516 312l-6 40M536 300l-4 30M780 306l8 30M792 330l6 26"
      />

      {/* bandiere sulle torri */}
      <g stroke="#b9cce7" strokeWidth="2">
        <path d="M610 170v-24M936 178v-22M1163 96v-22" />
      </g>
      <g fill="var(--red)">
        <path className="flag" d="M610 146l16 6-16 6z" />
        <path className="flag" d="M936 156l14 5-14 5z" style={{ animationDelay: "-0.6s" }} />
        <path className="flag" d="M1163 74l14 5-14 5z" style={{ animationDelay: "-1.2s" }} />
      </g>
    </svg>
  );
}
