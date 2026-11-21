/** Configurazione statica dell'evento (non cambia durante l'anno). */
export const site = {
  name: "Campionati Regionali di Atletica 2027",
  shortName: "Regionali 2027",
  city: "Bellinzona",
  venue: "Stadio Comunale di Bellinzona",
  // Inizio del primo giorno di gare, ora svizzera (CEST = UTC+2)
  startsAt: "2027-06-19T09:00:00+02:00",
  endsAt: "2027-06-20T18:00:00+02:00",
  days: [
    { date: "2027-06-19", label: "Sabato 19 giugno", short: "Sa 19.6" },
    { date: "2027-06-20", label: "Domenica 20 giugno", short: "Do 20.6" },
  ],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Stadio+Comunale+Bellinzona",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const nav = [
  { href: "/programma", label: "Programma", mobile: true },
  { href: "/risultati", label: "Risultati", mobile: true },
  { href: "/info", label: "Info pratiche", mobile: true },
  { href: "/food", label: "Food & Drink", mobile: true },
  { href: "/pernottamento", label: "Pernottamento" },
  { href: "/sponsor", label: "Sponsor" },
  { href: "/comitato", label: "Comitato" },
] as const;
