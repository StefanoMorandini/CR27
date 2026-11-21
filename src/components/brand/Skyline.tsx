/**
 * Skyline stilizzato di Bellinzona: le Alpi sullo sfondo, la collina con
 * Montebello e Sasso Corbaro, Castelgrande (Torre Bianca, Torre Nera e Murata)
 * e i tetti della città. viewBox 1600×400, i castelli sono nella fascia
 * centrale (x 420–1240) così restano visibili anche su mobile.
 */

/** Merlatura: rettangolo [x, y, w, h] con merli sul lato superiore. */
function crenellated(x: number, y: number, w: number, h: number, merlon = 8, gap = 7) {
  let d = `M${x} ${y + h}V${y}`;
  let cx = x;
  while (cx + merlon < x + w) {
    d += `h${merlon}v${merlon * 0.8}h${gap}v${-merlon * 0.8}`;
    cx += merlon + gap;
  }
  d += `H${x + w}V${y + h}Z`;
  return d;
}

/** Muro merlato in pendenza (la Murata che scende da Castelgrande). */
function slopedWall(x1: number, y1: number, x2: number, y2: number, h: number) {
  const slope = (y2 - y1) / (x2 - x1);
  let d = `M${x1} ${y1}L${x2} ${y2}V${y2 + h}L${x1} ${y1 + h}Z`;
  for (let x = x1; x + 8 <= x2; x += 15) {
    const y = y1 + (x - x1) * slope;
    d += `M${x} ${y + 2}v-9h8v${9 + slope * 8}Z`;
  }
  return d;
}

/** Tetti della città: casette deterministiche lungo il fondovalle. */
function houses() {
  let d = "";
  let x = -10;
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  while (x < 1610) {
    const w = 26 + Math.round(rnd() * 34);
    // più basse sotto Castelgrande, più alte in centro città
    const h = 14 + Math.round(rnd() * 22);
    const base = 372;
    const roof = 8 + Math.round(rnd() * 8);
    d += `M${x} ${base}V${base - h}l${w / 2} ${-roof}l${w / 2} ${roof}V${base}Z`;
    x += w + 2;
  }
  return d;
}

const castelgrande = [
  // rocca
  "M405 400L452 300C462 282 470 274 486 270H662C676 272 684 282 694 300L742 400Z",
  // mura sul pianoro
  crenellated(470, 244, 200, 28),
  // Torre Bianca (più alta) e Torre Nera
  crenellated(512, 168, 34, 104, 7, 6),
  crenellated(604, 192, 30, 80, 7, 5),
  // Murata verso il fiume
  slopedWall(668, 268, 830, 338, 18),
].join("");

const montebello = [
  crenellated(892, 226, 150, 30),
  crenellated(944, 176, 40, 80, 7, 6),
  crenellated(1024, 204, 24, 52, 6, 5),
].join("");

const sassoCorbaro = [crenellated(1146, 110, 34, 62, 7, 6), crenellated(1176, 136, 62, 36)].join("");

/** Campanile con tetto a punta */
const campanile = "M790 372V292h16v80ZM788 292l10-22 10 22Z";

export function Skyline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 400" className={className} aria-hidden preserveAspectRatio="xMidYMax meet">
      {/* Alpi */}
      <path
        fill="#e9f0f9"
        d="M0 400V210l70-40 60 28 90-92 70 58 55-36 75 62 60-74 85 86 70-30 80 64 95-112 90 94 60-36 85 70 75-96 95 88 70-44 80 60 90-104 85 92 60-30 80 64v-24 268z"
      />
      {/* nevai sulle cime */}
      <path
        fill="#fff"
        opacity=".9"
        d="M220 106l-22 23 14 4 8-9 10 8 12-5zM605 120l-20 24 13 3 7-8 9 8 10-5zM935 92l-24 26 15 4 9-10 10 9 13-6zM1245 102l-22 22 14 4 8-9 9 8 12-5zM1490 94l-24 26 15 3 9-9 10 8 12-6z"
      />
      {/* colline: a destra salgono verso Montebello e Sasso Corbaro */}
      <path
        fill="#d8e4f3"
        d="M0 400V318c120-20 230-14 330 4l90 10c120 10 260 18 380 6 60-6 100-40 150-70 40-24 90-12 130-30 40-18 70-56 110-62 30-4 60 8 90 0 70-18 130-40 190-36 60 4 90 26 130 34v226z"
      />
      {/* castelli + città */}
      <g fill="#bfd1e9">
        <path d={castelgrande} />
        <path d={montebello} />
        <path d={sassoCorbaro} />
        <path d={campanile} />
        <path d={houses()} />
        <rect x="0" y="370" width="1600" height="30" />
      </g>
      {/* bandierine rosse sulle torri */}
      <g fill="var(--red)">
        <path className="flag" d="M529 168v-22l16 6-16 6" />
        <path className="flag" d="M964 176v-20l14 5-14 5" style={{ animationDelay: "-0.6s" }} />
        <path className="flag" d="M1163 110v-20l14 5-14 5" style={{ animationDelay: "-1.2s" }} />
      </g>
      <g stroke="#bfd1e9" strokeWidth="2">
        <path d="M529 168v-22M964 176v-20M1163 110v-20" />
      </g>
    </svg>
  );
}
