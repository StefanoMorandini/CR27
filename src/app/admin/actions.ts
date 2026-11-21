"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { event } from "@/lib/event";

// ---------------------------------------------------------------- helpers
const str = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === "string" ? v.trim() : "";
};
const optional = (f: FormData, k: string) => str(f, k) || null;
const int = (f: FormData, k: string) => Number.parseInt(str(f, k) || "0", 10) || 0;
const bool = (f: FormData, k: string) => f.get(k) === "on";
const url = (f: FormData, k: string) => {
  const v = str(f, k);
  if (!v) return null;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

function back(path: string, key: "ok" | "error", code: string): never {
  redirect(`${path}?${key}=${code}`);
}

// ---------------------------------------------------------------- auth
export async function login(formData: FormData) {
  const sb = await getServerSupabase();
  const { error } = await sb.auth.signInWithPassword({
    email: str(formData, "email"),
    password: str(formData, "password"),
  });
  if (error) back("/admin/login", "error", "credentials");
  redirect("/admin");
}

export async function logout() {
  const sb = await getServerSupabase();
  await sb.auth.signOut();
  redirect("/admin/login");
}

export async function requestPasswordReset(formData: FormData) {
  const sb = await getServerSupabase();
  // Risposta sempre uguale: non rivela se l'email esiste
  await sb.auth.resetPasswordForEmail(str(formData, "email"), {
    redirectTo: `${event.siteUrl}/admin/password`,
  });
  back("/admin/login", "ok", "reset");
}

// ---------------------------------------------------------------- sponsor
async function uploadLogo(sb: Awaited<ReturnType<typeof requireAdmin>>["sb"], file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return undefined;
  const ext = (file.name.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `sponsors/${crypto.randomUUID()}.${ext}`;
  const { error } = await sb.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export async function saveSponsor(formData: FormData) {
  const { sb } = await requireAdmin();
  const id = str(formData, "id");
  const name = str(formData, "name");
  const tier_id = str(formData, "tier_id");
  const from = id ? `/admin/sponsor/${id}` : "/admin/sponsor";
  if (!name || !tier_id) back(from, "error", "required");

  let logo_url: string | null | undefined;
  try {
    logo_url = await uploadLogo(sb, formData.get("logo"));
  } catch {
    back(from, "error", "upload");
  }
  if (logo_url === undefined && bool(formData, "remove_logo")) logo_url = null;

  const row = {
    name,
    tier_id,
    website_url: url(formData, "website_url"),
    description: optional(formData, "description"),
    sort_order: int(formData, "sort_order"),
    published: bool(formData, "published"),
    ...(logo_url !== undefined ? { logo_url } : {}),
  };
  const { error } = id
    ? await sb.from("sponsors").update(row).eq("id", id)
    : await sb.from("sponsors").insert(row);
  if (error) back(from, "error", "save");

  updateTag("sponsors");
  back("/admin/sponsor", "ok", id ? "updated" : "created");
}

export async function deleteSponsor(formData: FormData) {
  const { sb } = await requireAdmin();
  const { error } = await sb.from("sponsors").delete().eq("id", str(formData, "id"));
  if (error) back("/admin/sponsor", "error", "delete");
  updateTag("sponsors");
  back("/admin/sponsor", "ok", "deleted");
}

// ---------------------------------------------------------------- tier
const displays = ["featured", "large", "medium", "small"];

export async function saveTier(formData: FormData) {
  const { sb } = await requireAdmin();
  const id = str(formData, "id");
  const name = str(formData, "name");
  const display = str(formData, "display");
  if (!name || !displays.includes(display)) back("/admin/tier", "error", "required");
  const row = { name, display, sort_order: int(formData, "sort_order") };
  const { error } = id
    ? await sb.from("sponsor_tiers").update(row).eq("id", id)
    : await sb.from("sponsor_tiers").insert(row);
  if (error) back("/admin/tier", "error", "save");
  updateTag("sponsors");
  back("/admin/tier", "ok", id ? "updated" : "created");
}

export async function deleteTier(formData: FormData) {
  const { sb } = await requireAdmin();
  const { error } = await sb.from("sponsor_tiers").delete().eq("id", str(formData, "id"));
  // 23503 = esistono sponsor collegati a questo tier
  if (error) back("/admin/tier", "error", error.code === "23503" ? "tier_in_use" : "delete");
  updateTag("sponsors");
  back("/admin/tier", "ok", "deleted");
}

// ---------------------------------------------------------------- link e impostazioni
const settingKeys = ["results_live_url", "results_embed_url", "registration_url", "contact_email"] as const;

export async function saveSettings(formData: FormData) {
  const { sb } = await requireAdmin();
  const rows = settingKeys.map((key) => ({
    key,
    value: key === "contact_email" ? str(formData, key) : (url(formData, key) ?? ""),
  }));
  const { error } = await sb.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) back("/admin/link", "error", "save");
  updateTag("settings");
  back("/admin/link", "ok", "updated");
}

const kinds = ["live", "results", "startlist", "document"];

export async function saveResultLink(formData: FormData) {
  const { sb } = await requireAdmin();
  const id = str(formData, "id");
  const label = str(formData, "label");
  const link = url(formData, "url");
  const kind = str(formData, "kind");
  if (!label || !link || !kinds.includes(kind)) back("/admin/link", "error", "required");
  const row = {
    label,
    url: link,
    kind,
    event_date: optional(formData, "event_date"),
    embeddable: bool(formData, "embeddable"),
    sort_order: int(formData, "sort_order"),
    published: bool(formData, "published"),
  };
  const { error } = id
    ? await sb.from("result_links").update(row).eq("id", id)
    : await sb.from("result_links").insert(row);
  if (error) back("/admin/link", "error", "save");
  updateTag("results");
  back("/admin/link", "ok", id ? "updated" : "created");
}

export async function deleteResultLink(formData: FormData) {
  const { sb } = await requireAdmin();
  const { error } = await sb.from("result_links").delete().eq("id", str(formData, "id"));
  if (error) back("/admin/link", "error", "delete");
  updateTag("results");
  back("/admin/link", "ok", "deleted");
}
