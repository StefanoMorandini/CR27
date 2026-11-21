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
  id: string;
  label: string;
  url: string;
  kind: "live" | "results" | "startlist" | "document";
  event_date: string | null;
  embeddable: boolean;
}

export type SponsorTier = "main" | "gold" | "silver" | "supporter" | "institutional" | "media";

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
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
