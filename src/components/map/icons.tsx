/**
 * Pittogrammi delle pedane e dei servizi (viewBox 24×24, tratto = currentColor).
 * Usati nei marker della mappa, nell'elenco e nel pannello delle pedane.
 */

export const ICON_KEYS = [
  "partenza",
  "arrivo",
  "corsa",
  "ostacoli",
  "lungo",
  "alto",
  "asta",
  "peso",
  "disco",
  "martello",
  "giavellotto",
  "appello",
  "crocette",
  "pettorali",
  "riscaldamento",
  "buvette",
  "navetta",
  "parcheggio",
  "wc",
  "sanitario",
  "info",
  "ingresso",
  "tribuna",
  "punto",
] as const;

export type IconKey = (typeof ICON_KEYS)[number];

export const ICON_LABELS: Record<IconKey, string> = {
  partenza: "Partenza",
  arrivo: "Arrivo",
  corsa: "Corsa",
  ostacoli: "Ostacoli",
  lungo: "Lungo / triplo",
  alto: "Salto in alto",
  asta: "Salto con l'asta",
  peso: "Getto del peso",
  disco: "Disco",
  martello: "Martello",
  giavellotto: "Giavellotto",
  appello: "Camera d'appello",
  crocette: "Crocette",
  pettorali: "Pettorali",
  riscaldamento: "Riscaldamento",
  buvette: "Buvette",
  navetta: "Navetta",
  parcheggio: "Parcheggio",
  wc: "Servizi igienici",
  sanitario: "Pronto soccorso",
  info: "Informazioni",
  ingresso: "Ingresso",
  tribuna: "Tribuna",
  punto: "Punto generico",
};

/** Arti spessi e arrotondati, testa piena: stile pittogramma sportivo. */
const L = { strokeWidth: 3.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const Head = ({ cx, cy, r = 2.7 }: { cx: number; cy: number; r?: number }) => (
  <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
);

/** Contenuto SVG dei pittogrammi (senza <svg>, per poterli usare anche dentro la mappa). */
export function IconGlyph({ name }: { name: IconKey | string }) {
  switch (name) {
    case "corsa": // corridore
      return (
        <>
          <Head cx={14.5} cy={3.8} />
          <path {...L} d="M13.6 8 10.8 13.6" />
          <path {...L} d="M8 9.4h5.2l3 2.6" />
          <path {...L} d="M10.8 13.6l3.4 2.6-1.4 4.6" />
          <path {...L} d="M10.8 13.6 8.2 17H4.8" />
        </>
      );
    case "partenza": // sprinter in accelerazione, busto inclinato
      return (
        <>
          <Head cx={16.4} cy={4.4} />
          <path {...L} d="M14.6 8 10.2 12.6" />
          <path {...L} d="M13.4 9.2l3.6 2.4M13.4 9.2 9.6 8.4" />
          <path {...L} d="M10.2 12.6l4 2.4-1.4 5.2" />
          <path {...L} d="M10.2 12.6 6.4 15.6 3.4 15" />
          <path d="M2.5 21.3h9" strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
    case "ostacoli": // scavalcamento: gamba d'attacco tesa sopra l'ostacolo
      return (
        <>
          <Head cx={12.6} cy={2.9} />
          <path {...L} d="M11.9 6.6 9.8 10.4" />
          <path {...L} d="M9.8 10.4l8-.6" />
          <path {...L} d="M9.8 10.4 5.2 12" />
          <path {...L} d="M11.3 7.8l4.4-1" />
          <path d="M7.5 16.2h11M9 16.2v5.3M17 16.2v5.3" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case "arrivo": // bandiera a scacchi
      return (
        <>
          <path d="M5 21.5V3" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M5 3.5h15v10H5z" strokeWidth="2" strokeLinejoin="round" />
          <path d="M5 3.5h5v3.3H5zM15 3.5h5v3.3h-5zM10 6.8h5v3.4h-5zM5 10.2h5v3.3H5zM15 10.2h5v3.3h-5z" fill="currentColor" stroke="none" />
        </>
      );
    case "lungo": // in volo, gambe avanti, sopra la fossa di sabbia
      return (
        <>
          <Head cx={7.4} cy={5.2} />
          <path {...L} d="M8.6 8.6 10.6 12.6" />
          <path {...L} d="M10.6 12.6h6.2l2.4 2.2" />
          <path {...L} d="M9.4 9.6l5-1.8" />
          <path d="M3 20.5h4.5" strokeWidth="2" strokeLinecap="round" />
          <path d="M11 20.5h10.5" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.1 2.6" />
        </>
      );
    case "alto": // dorsale: corpo ad arco sopra l'asticella
      return (
        <>
          <path d="M2.5 15h19M4 15v6.5M20 15v6.5" strokeWidth="2" strokeLinecap="round" />
          <Head cx={5.6} cy={11.2} />
          <path {...L} d="M8.2 10.4C10.6 6.6 14.6 6.4 16.8 9" />
          <path {...L} d="M16.8 9 20.2 5.2" />
        </>
      );
    case "asta": // in cima all'asta flessa
      return (
        <>
          <path d="M4 21.5C6.6 15 7.8 8.6 7.4 2.8" strokeWidth="2" strokeLinecap="round" />
          <Head cx={11.4} cy={4.2} />
          <path {...L} d="M10.4 7.2 7.8 3.6" />
          <path {...L} d="M11.6 8 16.2 9.2 20.6 7" />
        </>
      );
    case "peso": // sfera appoggiata al collo
      return (
        <>
          <Head cx={10} cy={3.8} />
          <circle cx={15.2} cy={6} r={2.4} fill="currentColor" stroke="none" />
          <path {...L} d="M10 7.8v6" />
          <path {...L} d="M10 9.4l3.4-1.6M10 9.6 6.8 12" />
          <path {...L} d="M10 13.8 7.4 20.5M10 13.8l3.6 6" />
        </>
      );
    case "disco": // rotazione con il braccio teso indietro
      return (
        <>
          <Head cx={15.6} cy={4.6} />
          <path {...L} d="M14 8.2 10.6 13" />
          <path {...L} d="M13 9.4 5.4 7.6" />
          <ellipse cx={3.6} cy={7.2} rx={2.1} ry={1.4} fill="currentColor" stroke="none" />
          <path {...L} d="M10.6 13l3.8 3.4.4 4.2M10.6 13l-2.2 4.4 1.6 3" />
        </>
      );
    case "martello": // sfera e catena
      return (
        <>
          <Head cx={8.4} cy={4.4} />
          <path {...L} d="M8.6 8.2 9.6 14" />
          <path {...L} d="M9 10h5.4" />
          <path d="M14.4 10h3" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx={19.4} cy={10} r={2.2} strokeWidth="2" />
          <path {...L} d="M9.6 14 6.6 20.5M9.6 14l3.6 6" />
        </>
      );
    case "giavellotto": // giavellotto sopra la testa, braccio indietro
      return (
        <>
          <path d="M2 7.2 21.5 1.6" strokeWidth="1.8" strokeLinecap="round" />
          <Head cx={13} cy={7} />
          <path {...L} d="M12.8 10.6 12.4 15.6" />
          <path {...L} d="M12.6 11.2 8.4 5.6M12.6 11.6l3.8 1.6" />
          <path {...L} d="M12.4 15.6 9 21M12.4 15.6l3.8 5" />
        </>
      );
    case "appello": // megafono
      return (
        <>
          <path d="M3.5 9.5v5h3.5l9 5V4.5l-9 5z" fill="currentColor" stroke="none" />
          <path d="M19 9a4 4 0 0 1 0 6" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case "crocette": // foglio con spunta
      return (
        <>
          <rect x="4.5" y="3" width="15" height="18" rx="2.5" strokeWidth="2.2" />
          <path d="m8 12.5 2.8 2.8L16 10" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case "pettorali": // pettorale con numero
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" stroke="none" />
          <text x="12" y="15.6" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="var(--icon-bg, #df2123)" stroke="none" fontFamily="Arial, sans-serif">
            27
          </text>
        </>
      );
    case "riscaldamento": // cronometro con settore pieno
      return (
        <>
          <circle cx="12" cy="13.5" r="7.5" strokeWidth="2.2" />
          <path d="M12 13.5V6A7.5 7.5 0 0 1 19.5 13.5z" fill="currentColor" stroke="none" />
          <path d="M9.5 2.5h5M12 2.5V6" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case "buvette": // tazza
      return (
        <>
          <path d="M4 9h12v4.5a5.5 5.5 0 0 1-5.5 5.5h-1A5.5 5.5 0 0 1 4 13.5z" fill="currentColor" stroke="none" />
          <path d="M16 10.5h1.5a2.6 2.6 0 0 1 0 5.2H16" strokeWidth="2.2" />
          <path d="M3 21.5h14" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case "navetta": // bus
      return (
        <>
          <rect x="3.5" y="3.5" width="17" height="14.5" rx="3" fill="currentColor" stroke="none" />
          <rect x="6" y="6" width="12" height="5" rx="1" fill="var(--icon-bg, #1b1b1b)" stroke="none" />
          <circle cx="7.5" cy="20" r="1.9" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="20" r="1.9" fill="currentColor" stroke="none" />
        </>
      );
    case "parcheggio":
      return (
        <text x="12" y="18.5" textAnchor="middle" fontSize="18" fontWeight="900" fill="currentColor" stroke="none" fontFamily="Arial, sans-serif">
          P
        </text>
      );
    case "wc":
      return (
        <text x="12" y="16" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="currentColor" stroke="none" fontFamily="Arial, sans-serif">
          WC
        </text>
      );
    case "sanitario": // croce
      return <path d="M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5z" fill="currentColor" stroke="none" />;
    case "info":
      return (
        <>
          <circle cx="12" cy="5.5" r="2.3" fill="currentColor" stroke="none" />
          <path d="M9.5 10h3.5v10M9.5 20h7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case "ingresso": // porta con freccia
      return (
        <>
          <path d="M13 3h7v18h-7" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M3 12h11M10.5 8l4 4-4 4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case "tribuna": // gradinate
      return <path d="M3 21h18V4h-5v5.5h-4.5V15H7v6" fill="currentColor" stroke="none" />;
    default:
      return <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />;
  }
}

/** Pittogramma autonomo (per elenco, pannello, admin). */
export function Icon({ name, className }: { name: IconKey | string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <IconGlyph name={name} />
    </svg>
  );
}
