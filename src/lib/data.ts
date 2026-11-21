import { cacheLife, cacheTag } from "next/cache";
import { getPublicSupabase } from "./supabase/public";
import { fallbackSchedule, fallbackSponsors } from "./fallback";
import type {
  Accommodation,
  Announcement,
  CommitteeMember,
  Faq,
  FbMenuItem,
  FbPoint,
  MapPoint,
  ResultLink,
  ScheduleItem,
  SiteSettings,
  Sponsor,
  SponsorTier,
} from "./types";

/**
 * Livello di accesso ai dati. Ogni funzione è in cache ("use cache") con un tag:
 * quando l'area admin modificherà un contenuto, basterà invalidare il tag
 * corrispondente (revalidateTag/updateTag) per aggiornare il sito.
 *
 * Programma e risultati usano una cache breve ("minutes") perché nei giorni di
 * gara cambiano spesso; il resto usa "hours".
 */

async function select<T>(table: string, order: string[], fallback: T[]): Promise<T[]> {
  const sb = getPublicSupabase();
  if (!sb) return fallback;
  let q = sb.from(table).select("*").eq("published", true);
  for (const col of order) q = q.order(col, { ascending: true });
  const { data, error } = await q;
  if (error) {
    // Con Supabase configurato non mostriamo mai i dati di esempio
    console.error(`[data] ${table}:`, error.message);
    return [];
  }
  return (data ?? []) as T[];
}

export async function getSchedule(): Promise<ScheduleItem[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("schedule");
  return select<ScheduleItem>("schedule_items", ["event_date", "start_time"], fallbackSchedule);
}

export async function getResultLinks(): Promise<ResultLink[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("results");
  return select<ResultLink>("result_links", ["sort_order"], []);
}

export async function getAnnouncements(): Promise<Announcement[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("announcements");
  const items = await select<Announcement>("announcements", [], []);
  return items.sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || b.published_at.localeCompare(a.published_at),
  );
}

export async function getSponsors(): Promise<Sponsor[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("sponsors");
  return select<Sponsor>("sponsors", ["sort_order", "name"], fallbackSponsors);
}

export async function getSponsorTiers(): Promise<SponsorTier[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("sponsors");
  const sb = getPublicSupabase();
  if (!sb) return [];
  const { data, error } = await sb.from("sponsor_tiers").select("*").order("sort_order");
  if (error) {
    console.error("[data] sponsor_tiers:", error.message);
    return [];
  }
  // numeric di Postgres arriva come stringa
  return (data as SponsorTier[]).map((t) => ({ ...t, price_chf: t.price_chf == null ? null : Number(t.price_chf) }));
}

export async function getAccommodations(): Promise<Accommodation[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("accommodations");
  return select<Accommodation>("accommodations", ["sort_order"], []);
}

export async function getCommittee(): Promise<CommitteeMember[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("committee");
  return select<CommitteeMember>("committee_members", ["sort_order"], []);
}

export async function getFood(): Promise<{ points: FbPoint[]; items: FbMenuItem[] }> {
  "use cache";
  cacheLife("hours");
  cacheTag("food");
  const [points, items] = await Promise.all([
    select<FbPoint>("fb_points", ["sort_order"], []),
    select<FbMenuItem>("fb_menu_items", ["sort_order"], []),
  ]);
  return { points, items };
}

export async function getFaqs(): Promise<Faq[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("faqs");
  return select<Faq>("faqs", ["sort_order"], []);
}

const emptySettings: SiteSettings = {
  registration_url: "",
  results_live_url: "",
  results_embed_url: "",
  contact_email: "",
};

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("minutes");
  cacheTag("settings");
  const sb = getPublicSupabase();
  if (!sb) return emptySettings;
  const { data, error } = await sb.from("site_settings").select("key, value");
  if (error || !data) return emptySettings;
  const out = { ...emptySettings };
  for (const row of data) {
    if (row.key in out && typeof row.value === "string") {
      out[row.key as keyof SiteSettings] = row.value;
    }
  }
  return out;
}

export async function getMapPoints(): Promise<MapPoint[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("map");
  const rows = await select<MapPoint>("map_points", ["sort_order"], []);
  // numeric di Postgres arriva come stringa
  return rows.map((p) => ({ ...p, x: Number(p.x), y: Number(p.y) }));
}
