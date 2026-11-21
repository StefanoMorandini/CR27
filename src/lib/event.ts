/** Dati fissi dell'evento (non dipendono dalla lingua). */
export const event = {
  // Orari in ora svizzera (CEST = UTC+2)
  startsAt: "2027-06-19T09:00:00+02:00",
  endsAt: "2027-06-20T18:00:00+02:00",
  days: ["2027-06-19", "2027-06-20"] as const,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Stadio+Comunale+Bellinzona",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
