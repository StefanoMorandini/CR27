/**
 * Mappa vettoriale schematica dello Stadio Comunale di Bellinzona (nord in alto).
 * Ridisegnata dalla foto aerea e dalla planimetria dell'evento: non è in scala esatta.
 * Sistema di coordinate: viewBox 0 0 1000 570 (lo stesso dei punti in `map_points`).
 */
export const MAP_W = 1000;
export const MAP_H = 570;

// Asse dello stadio: centro e rotazione (la pista corre da nord-ovest a sud-est)
const CX = 488;
const CY = 282;
const ROT = 42;

const C = {
  ground: "#f3f1ec",
  green: "#dcebd5",
  grass: "#bcdcae",
  grass2: "#b2d6a3",
  turf: "#9fcd8f",
  track: "#e7756a",
  sand: "#ead9ab",
  building: "#dedad3",
  buildingStroke: "#cdc7bd",
  road: "#ffffff",
  roadEdge: "#e2ddd5",
  tree: "#c7dfbb",
  stand: "#cfc9c0",
  label: "#6b6f75",
};

function Lanes() {
  // righe bianche delle corsie (6 corsie + bordo)
  return (
    <g fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth=".7">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const inset = i * 2.6;
        return (
          <rect
            key={i}
            x={-210 + inset}
            y={-103 + inset}
            width={420 - inset * 2}
            height={206 - inset * 2}
            rx={103 - inset}
          />
        );
      })}
    </g>
  );
}

export function VenueBase() {
  return (
    <g>
      <defs>
        <pattern id="closed" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#fff" strokeOpacity=".45" strokeWidth="2" />
        </pattern>
      </defs>

      <rect width={MAP_W} height={MAP_H} fill={C.ground} />

      {/* aree verdi */}
      <path fill={C.green} d="M0 0H120L60 120 0 170Z M0 380L150 330 420 590H0Z M720 290L1000 230V570H760Z" />

      {/* strade */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke={C.roadEdge} strokeWidth="16" d="M120 -10L240 100 90 300 -10 345 M240 100L460 55 720 -10 M520 280L410 250 285 300 230 400 M700 250L1010 200 M700 250L640 330" />
        <path stroke={C.road} strokeWidth="12" d="M120 -10L240 100 90 300 -10 345 M240 100L460 55 720 -10 M520 280L410 250 285 300 230 400 M700 250L1010 200 M700 250L640 330" />
        {/* strada dietro la tribuna */}
        <path stroke={C.roadEdge} strokeWidth="12" d="M470 60L700 250" />
        <path stroke={C.road} strokeWidth="8" d="M470 60L700 250" />
      </g>

      {/* parcheggi (superfici) */}
      <g fill="#e9e6e0" stroke="#ddd8cf">
        <path d="M600 30L720 10 760 110 650 150Z" />
        <path d="M140 235L215 225 230 300 160 315Z" />
        <path d="M280 105L345 95 350 135 290 140Z" />
      </g>

      {/* edifici */}
      <g fill={C.building} stroke={C.buildingStroke}>
        <path d="M385 20L440 12 452 62 397 70Z" />
        <path d="M655 150L740 130 760 215 675 235Z" />
        <path d="M700 230L745 220 760 265 715 275Z" />
        <path d="M775 150L845 135 860 215 790 230Z" />
        <path d="M860 190L925 225 905 300 845 270Z" />
        <path d="M0 175L70 160 80 250 0 270Z" />
        <path d="M100 450L190 470 175 570 80 570Z" />
        <path d="M200 20L250 15 255 60 205 65Z M150 50L190 45 195 90 155 95Z" />
      </g>

      {/* alberi */}
      <g fill={C.tree}>
        {[
          [300, 330, 18], [325, 370, 16], [350, 420, 18], [380, 455, 16], [415, 485, 17], [455, 505, 16],
          [470, 545, 18], [690, 470, 14], [660, 500, 15], [90, 380, 26], [60, 430, 22], [950, 500, 26],
          [940, 300, 18], [300, 250, 14], [330, 160, 14], [880, 330, 16],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>

      {/* campo ovest (peso) */}
      <g transform="translate(278 425) rotate(32)">
        <rect x="-115" y="-75" width="230" height="150" fill={C.grass} />
        <g fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.2">
          <rect x="-105" y="-65" width="210" height="130" />
          <line x1="0" y1="-65" x2="0" y2="65" />
          <circle r="18" />
        </g>
      </g>

      {/* campo di riscaldamento (sintetico, a est) */}
      <g transform="translate(782 438) rotate(25)">
        <rect x="-120" y="-75" width="240" height="150" fill={C.turf} />
        <g fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="1.2">
          <rect x="-110" y="-65" width="220" height="130" />
          <line x1="0" y1="-65" x2="0" y2="65" />
          <circle r="18" />
        </g>
      </g>

      {/* stadio */}
      <g transform={`translate(${CX} ${CY}) rotate(${ROT})`}>
        {/* gradinate: lato sud-ovest e curva sud-est */}
        <rect x="-150" y="106" width="270" height="16" fill={C.stand} />
        <path d="M120 106A103 103 0 0 0 213 0h16A119 119 0 0 1 120 122Z" fill={C.stand} />
        {/* tribuna principale (nord-est) */}
        <rect x="-60" y="-165" width="140" height="38" fill={C.building} stroke={C.buildingStroke} />
        {/* pista */}
        <rect x="-210" y="-103" width="420" height="206" rx="103" fill={C.track} />
        {/* prolungamento del rettilineo (partenza 100 m) */}
        <rect x="-200" y="-103" width="100" height="18" fill={C.track} />
        {/* pedana del lungo e fossa di sabbia */}
        <rect x="-70" y="-120" width="190" height="9" fill={C.track} />
        <rect x="120" y="-122" width="24" height="13" fill={C.sand} />
        <Lanes />
        {/* campo interno */}
        <rect x="-194" y="-87" width="388" height="174" rx="87" fill={C.grass} />
        <rect x="-116" y="-70" width="232" height="140" fill={C.grass2} />
        <g fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.2">
          <rect x="-110" y="-64" width="220" height="128" />
          <line x1="0" y1="-64" x2="0" y2="64" />
          <circle r="18" />
        </g>
        {/* prato chiuso */}
        <rect x="-116" y="-70" width="232" height="140" fill="url(#closed)" />
        {/* linee di partenza e arrivo */}
        <g stroke="#fff" strokeWidth="2.2">
          <line x1="-117" y1="-103" x2="-117" y2="-87" />
          <line x1="107" y1="-103" x2="107" y2="-87" />
        </g>
        {/* gabbia disco/martello, materassi alto e asta */}
        <circle cx="-154" cy="35" r="7" fill="#fff" fillOpacity=".55" stroke="#fff" />
        <path d="M-161 35a7 7 0 0 1 14 0" fill="none" stroke="#8a8f96" strokeWidth="1.6" />
        <rect x="-150" y="-22" width="14" height="12" fill="#fff" />
        <rect x="124" y="50" width="14" height="12" fill="#fff" />
      </g>

      {/* etichette di contesto */}
      <g fill={C.label} fontSize="11" fontWeight="600" fontFamily="var(--font-inter), sans-serif" textAnchor="middle">
        <text x="545" y="300" transform="rotate(42 545 300)" opacity=".8">PRATO CHIUSO</text>
        <text x="782" y="402">Campo di riscaldamento</text>
        <text x="270" y="395">Campo ovest</text>
        <text x="560" y="128" transform="rotate(42 560 128)">Tribuna</text>
      </g>

      {/* nord */}
      <g transform="translate(965 40)" fontFamily="var(--font-inter), sans-serif">
        <circle r="17" fill="#fff" stroke={C.roadEdge} />
        <path d="M0 -11L5 4 0 1 -5 4Z" fill="#1b1b1b" />
        <text y="13" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1b1b1b">N</text>
      </g>
    </g>
  );
}
