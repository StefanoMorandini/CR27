/**
 * Contenuti di ESEMPIO usati solo quando Supabase non è configurato
 * (sviluppo locale senza .env). In produzione i dati arrivano dal database.
 */
import type { ScheduleItem, Sponsor } from "./types";

const base = {
  round: null,
  venue_area: null,
  status: "scheduled" as const,
  delay_min: 0,
  results_url: null,
  startlist_url: null,
  notes: "Esempio",
};

export const fallbackSchedule: ScheduleItem[] = [
  { ...base, id: "s1", event_date: "2027-06-19", start_time: "09:30", discipline: "80 m ostacoli", category: "U16", gender: "F", round: "Batterie", venue_area: "Pista" },
  { ...base, id: "s2", event_date: "2027-06-19", start_time: "09:45", discipline: "Salto in alto", category: "U18", gender: "M", venue_area: "Pedana alto" },
  { ...base, id: "s3", event_date: "2027-06-19", start_time: "10:15", discipline: "100 m", category: "Attivi", gender: "M", round: "Batterie", venue_area: "Pista" },
  { ...base, id: "s4", event_date: "2027-06-19", start_time: "11:00", discipline: "Getto del peso", category: "U20", gender: "F", venue_area: "Pedana peso" },
  { ...base, id: "s5", event_date: "2027-06-19", start_time: "14:00", discipline: "100 m", category: "Attivi", gender: "M", round: "Finale", venue_area: "Pista" },
  { ...base, id: "s6", event_date: "2027-06-20", start_time: "09:30", discipline: "Salto in lungo", category: "U16", gender: "M", venue_area: "Pedana lungo" },
  { ...base, id: "s7", event_date: "2027-06-20", start_time: "10:00", discipline: "200 m", category: "Attivi", gender: "F", round: "Batterie", venue_area: "Pista" },
  { ...base, id: "s8", event_date: "2027-06-20", start_time: "15:30", discipline: "4×100 m", category: "Attivi", gender: "X", round: "Finale", venue_area: "Pista" },
];

export const fallbackSponsors: Sponsor[] = [];
