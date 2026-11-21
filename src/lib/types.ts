export type Gender = "F" | "M" | "X";

export type ScheduleStatus =
  | "scheduled"
  | "call_room"
  | "in_progress"
  | "finished"
  | "delayed"
  | "cancelled";

export interface ScheduleItem {
  id: string;
  event_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM[:SS]
  discipline: string;
  category: string;
  gender: Gender;
  round: string | null;
  venue_area: string | null;
  status: ScheduleStatus;
  delay_min: number;
  results_url: string | null;
  startlist_url: string | null;
  notes: string | null;
}

export interface ResultLink {
  sort_order: number;
  published: boolean;
  id: string;
  label: string;
  url: string;
  kind: "live" | "results" | "startlist" | "document";
  event_date: string | null;
  embeddable: boolean;
}

export type TierDisplay = "featured" | "large" | "medium" | "small";

export interface SponsorTier {
  id: string;
  name: string;
  display: TierDisplay;
  sort_order: number;
  price_chf: number | null;
  price_public: boolean;
  max_sponsors: number | null;
  benefits: string[];
}

export type SponsorStatus = "contatto" | "proposta" | "confermato" | "fatturato" | "pagato" | "annullato";

/** Contatti e dati dell'accordo: solo area admin (RLS). */
export interface SponsorContact {
  sponsor_id: string;
  legal_name: string | null;
  contact_name: string | null;
  salutation: string | null;
  email: string | null;
  phone: string | null;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  country: string;
  amount_chf: number | null;
  agreement_date: string | null;
  status: SponsorStatus;
  notes: string | null;
}

export interface Sponsor {
  id: string;
  name: string;
  tier_id: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  sort_order: number;
  published: boolean;
}

export interface Accommodation {
  id: string;
  name: string;
  kind: string;
  address: string | null;
  locality: string | null;
  distance_km: number | null;
  price_range: string | null;
  website_url: string | null;
  phone: string | null;
  booking_code: string | null;
  notes: string | null;
  is_partner: boolean;
}

export interface CommitteeMember {
  id: string;
  full_name: string;
  role: string;
  area: string | null;
  email: string | null;
  photo_url: string | null;
  responsibilities: string[];
  is_committee: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string | null;
  level: "info" | "important" | "urgent";
  pinned: boolean;
  published_at: string;
}

export interface FbPoint {
  id: string;
  name: string;
  location: string | null;
  opening_info: string | null;
}

export interface FbMenuItem {
  id: string;
  point_id: string | null;
  name: string;
  category: "food" | "drink" | "snack" | "dessert";
  price_chf: number | null;
  allergens: string[];
  vegetarian: boolean;
  vegan: boolean;
  available: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  topic: string;
}

export interface SiteSettings {
  registration_url: string;
  results_live_url: string;
  results_embed_url: string;
  contact_email: string;
}

export type MapCategory = "gare" | "atleti" | "servizi" | "parcheggi";

export interface MapPoint {
  id: string;
  name: string;
  category: MapCategory;
  description: string | null;
  x: number;
  y: number;
  verified: boolean;
  icon: string;
  sort_order: number;
  published: boolean;
}
