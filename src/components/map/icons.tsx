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

/** Contenuto SVG dei pittogrammi (senza <svg>, per poterli usare anche dentro la mappa). */
export function IconGlyph({ name }: { name: IconKey | string }) {
  switch (name) {
    case "partenza": // atleta sui blocchi
      return (
        <>
          <circle cx="16.5" cy="6.5" r="2" fill="currentColor" stroke="none" />
          <path d="M14.5 9 9 12.5l-3.5-.5M11 11.5l2.5 4-2 4.5M9 12.5 6 16.5H3M15 10.5l3 2.5" />
          <path d="M2.5 20.5h19" opacity=".6" />
        </>
      );
    case "corsa": // corridore
      return (
        <>
          <circle cx="15" cy="4.5" r="2" fill="currentColor" stroke="none" />
          <path d="M14 7.5 11 13l-4 1M11 13l3.5 3-1.5 5M11 13l-3.5 3.5L4 16M13.5 8.5 17 11l3-1M13.5 8.5 9.5 8 7.5 10" />
        </>
      );
    case "ostacoli":
      return (
        <>
          <circle cx="11" cy="4" r="2" fill="currentColor" stroke="none" />
          <path d="M10.5 7 8 12l-5-1M8 12l7.5-1.5 2 2.5M10.5 7l4 1.5M10.5 7 6.5 9" />
          <path d="M14 15h7M15 15v6M20 15v6" />
        </>
      );
    case "arrivo": // bandiera a scacchi
      return (
        <>
          <path d="M5 21V3.5" />
          <path d="M5 4h14v9H5" />
          <path
            d="M5 4h3.5v3H5zM12 4h3.5v3H12zM8.5 7H12v3H8.5zM15.5 7H19v3h-3.5zM5 10h3.5v3H5zM12 10h3.5v3H12z"
            fill="currentColor"
            stroke="none"
          />
        </>
      );
    case "lungo": // salto in volo sopra la sabbia
      return (
        <>
          <circle cx="7" cy="5" r="2" fill="currentColor" stroke="none" />
          <path d="M8 7.5 10.5 12l6.5-.5 3 2M10.5 12l3.5 2.5M8 7.5 5 10.5M8.5 8 12 6.5" />
          <path d="M3 20.5h18" opacity=".6" />
          <path d="M13 18.5h8" strokeDasharray="1.5 1.5" />
        </>
      );
    case "alto": // scavalcamento dorsale sopra l'asticella
      return (
        <>
          <path d="M2.5 14.5h19" />
          <path d="M3 21v-6.5M21 21v-6.5" opacity=".6" />
          <circle cx="6" cy="11" r="2" fill="currentColor" stroke="none" />
          <path d="M8 10.5c3-3.5 6-3.5 8.5-1.5l3 3.5M16.5 9l1-4" />
        </>
      );
    case "asta": // asta e atleta in alto
      return (
        <>
          <path d="M4 21 15.5 4" />
          <circle cx="18" cy="4.5" r="1.9" fill="currentColor" stroke="none" />
          <path d="M16.5 6.5 14 11l-3 1.5M14 11l3 3M16 7.5l-.5-3" />
          <path d="M2.5 21h6" opacity=".6" />
        </>
      );
    case "peso": // lanciatore con la sfera al collo, pedana circolare
      return (
        <>
          <circle cx="11" cy="4" r="2" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="6" r="2.1" fill="currentColor" stroke="none" />
          <path d="M11 6.5v6.5M11 8.5l3.5-1.5M11 9 7.5 11.5M11 13l-3 4.5M11 13l3.5 4" />
          <ellipse cx="11" cy="19.5" rx="7" ry="1.8" opacity=".7" />
        </>
      );
    case "disco": // lanciatore in rotazione con il disco
      return (
        <>
          <circle cx="10" cy="4" r="2" fill="currentColor" stroke="none" />
          <path d="M10 6.5 11 13M10.5 8.5l7 2M10.5 9 6.5 7M11 13l-3.5 5M11 13l3 5" />
          <ellipse cx="19.5" cy="10.8" rx="2.6" ry="1.4" fill="currentColor" stroke="none" />
          <path d="M3 20.5c2.5 1.5 13.5 1.5 16 0" opacity=".6" />
        </>
      );
    case "martello": // sfera e catena in rotazione
      return (
        <>
          <circle cx="8" cy="4.5" r="2" fill="currentColor" stroke="none" />
          <path d="M8 7v6.5M8 9l4.5 1.5M8 13.5l-3 5M8 13.5l3 5" />
          <path d="M12.5 10.5 17 14.5" />
          <circle cx="18.5" cy="16" r="2.3" fill="currentColor" stroke="none" />
          <path d="M14 3.5a8 8 0 0 1 7 7" strokeDasharray="1.5 2" opacity=".7" />
        </>
      );
    case "giavellotto":
      return (
        <>
          <circle cx="9" cy="4.5" r="2" fill="currentColor" stroke="none" />
          <path d="M9 7l1 6.5M9.5 9 5 7.5M9.5 9.5l4 2M10 13.5l-3 6M10 13.5l4 5" />
          <path d="m3 11 19-8" />
        </>
      );
    case "appello": // megafono
      return (
        <>
          <path d="M4 10v4h3l8 4.5V5.5L7 10H4z" />
          <path d="M7 14l1.5 5" />
          <path d="M18 9.5a3.5 3.5 0 0 1 0 5" />
        </>
      );
    case "crocette": // foglio con spunta
      return (
        <>
          <rect x="5" y="3.5" width="14" height="17" rx="2" />
          <path d="m8.5 12.5 2.5 2.5 4.5-5" />
          <path d="M9 3.5V2.5h6v1" />
        </>
      );
    case "pettorali": // pettorale con spille
      return (
        <>
          <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
          <circle cx="6" cy="8" r=".9" fill="currentColor" stroke="none" />
          <circle cx="18" cy="8" r=".9" fill="currentColor" stroke="none" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="7.5"
            fontWeight="800"
            fill="currentColor"
            stroke="none"
            fontFamily="Arial, sans-serif"
          >
            27
          </text>
        </>
      );
    case "riscaldamento": // cronometro
      return (
        <>
          <circle cx="12" cy="13.5" r="7" />
          <path d="M10 2.5h4M12 2.5v4M12 13.5 15 10.5M18.5 6.5l1.5-1.5" />
        </>
      );
    case "buvette": // tazza
      return (
        <>
          <path d="M4.5 9.5h11v4.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" />
          <path d="M15.5 11h1.5a2.5 2.5 0 0 1 0 5h-1.8" />
          <path d="M8 3c-1 1.5 1 2.5 0 4M11.5 3c-1 1.5 1 2.5 0 4" opacity=".7" />
          <path d="M3 21h14" />
        </>
      );
    case "navetta": // bus
      return (
        <>
          <rect x="3.5" y="4" width="17" height="13" rx="2.5" />
          <path d="M3.5 11h17M8 4v7M16 4v7" />
          <circle cx="7.5" cy="19" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="19" r="1.8" fill="currentColor" stroke="none" />
        </>
      );
    case "parcheggio":
      return (
        <path d="M8 20V4h5.5a4.5 4.5 0 0 1 0 9H8" strokeWidth="3" />
      );
    case "wc":
      return (
        <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill="currentColor" stroke="none" fontFamily="Arial, sans-serif">
          WC
        </text>
      );
    case "sanitario": // croce
      return <path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z" fill="currentColor" stroke="none" />;
    case "info":
      return (
        <>
          <circle cx="12" cy="6" r="1.8" fill="currentColor" stroke="none" />
          <path d="M9.5 10.5H12.5v9M9.5 19.5h6" strokeWidth="2.6" />
        </>
      );
    case "ingresso": // porta con freccia
      return (
        <>
          <path d="M13 3.5h6.5v17H13" />
          <path d="M3.5 12h11M11 8.5l3.5 3.5-3.5 3.5" />
        </>
      );
    case "tribuna": // gradinate
      return <path d="M3 20.5h18V5.5h-4.5v5H12v5H7.5v5" />;
    default:
      return <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />;
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <IconGlyph name={name} />
    </svg>
  );
}
