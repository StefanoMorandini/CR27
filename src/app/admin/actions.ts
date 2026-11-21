"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { event } from "@/lib/event";
import { ICON_KEYS } from "@/components/map/icons";

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
  redirect(`${path}${path.includes("?") ? "&" : "?"}${key}=${code}`);
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
  const from = id ? `/admin/sponsor?id=${id}` : "/admin/sponsor?new=1";
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
  let sponsorId = id;
  if (id) {
    const { error } = await sb.from("sponsors").update(row).eq("id", id);
    if (error) back(from, "error", "save");
  } else {
    const { data, error } = await sb.from("sponsors").insert(row).select("id").single();
    if (error || !data) back(from, "error", "save");
    sponsorId = data.id;
  }

  // contatti e accordo (tabella riservata agli admin)
  const amount = str(formData, "amount_chf").replace(/['\s]/g, "").replace(",", ".");
  const status = str(formData, "status");
  const contact = {
    sponsor_id: sponsorId,
    legal_name: optional(formData, "legal_name"),
    contact_name: optional(formData, "contact_name"),
    salutation: optional(formData, "salutation"),
    email: optional(formData, "contact_email"),
    phone: optional(formData, "contact_phone"),
    street: optional(formData, "street"),
    postal_code: optional(formData, "postal_code"),
    city: optional(formData, "city"),
    country: str(formData, "country") || "Svizzera",
    amount_chf: amount && Number.isFinite(Number(amount)) ? Number(amount) : null,
    agreement_date: optional(formData, "agreement_date"),
    status: sponsorStatuses.includes(status) ? status : "contatto",
    notes: optional(formData, "notes"),
  };
  const { error: cErr } = await sb.from("sponsor_contacts").upsert(contact, { onConflict: "sponsor_id" });
  if (cErr) back(`/admin/sponsor?id=${sponsorId}`, "error", "save");

  updateTag("sponsors");
  back(`/admin/sponsor?id=${sponsorId}`, "ok", id ? "updated" : "created");
}

const sponsorStatuses = ["contatto", "proposta", "confermato", "fatturato", "pagato", "annullato"];

export async function toggleSponsor(formData: FormData) {
  const { sb } = await requireAdmin();
  const { error } = await sb
    .from("sponsors")
    .update({ published: str(formData, "published") !== "true" })
    .eq("id", str(formData, "id"));
  if (error) back("/admin/sponsor", "error", "save");
  updateTag("sponsors");
  back("/admin/sponsor", "ok", "updated");
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
  const from = id ? `/admin/tier?id=${id}` : "/admin/tier";
  if (!name || !displays.includes(display)) back(from, "error", "required");
  const price = str(formData, "price_chf").replace(/['\s]/g, "").replace(",", ".");
  const max = str(formData, "max_sponsors");
  const row = {
    name,
    display,
    sort_order: int(formData, "sort_order"),
    price_chf: price && Number.isFinite(Number(price)) ? Number(price) : null,
    price_public: bool(formData, "price_public"),
    max_sponsors: max ? Number.parseInt(max, 10) || null : null,
    benefits: str(formData, "benefits")
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean),
  };
  const { error } = id
    ? await sb.from("sponsor_tiers").update(row).eq("id", id)
    : await sb.from("sponsor_tiers").insert(row);
  if (error) back(from, "error", "save");
  updateTag("sponsors");
  back(from, "ok", id ? "updated" : "created");
}

export async function deleteTier(formData: FormData) {
  const { sb } = await requireAdmin();
  const { error } = await sb.from("sponsor_tiers").delete().eq("id", str(formData, "id"));
  // 23503 = esistono sponsor collegati a questo tier
  if (error) back(`/admin/tier?id=${str(formData, "id")}`, "error", error.code === "23503" ? "tier_in_use" : "delete");
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

// ---------------------------------------------------------------- mappa
const mapCategories = ["gare", "atleti", "servizi", "parcheggi"];

export async function saveMapPoint(formData: FormData) {
  const { sb } = await requireAdmin();
  const id = str(formData, "id");
  const from = id ? `/admin/mappa?id=${id}` : "/admin/mappa";
  const name = str(formData, "name");
  const category = str(formData, "category");
  const x = Number.parseFloat(str(formData, "x"));
  const y = Number.parseFloat(str(formData, "y"));
  if (!name || !mapCategories.includes(category) || !Number.isFinite(x) || !Number.isFinite(y)) {
    back(from, "error", "map_required");
  }
  const iconValue = str(formData, "icon");
  const icon = (ICON_KEYS as readonly string[]).includes(iconValue) ? iconValue : "punto";
  const row = {
    name,
    category,
    icon,
    description: optional(formData, "description"),
    x: Math.min(1354, Math.max(0, Math.round(x * 10) / 10)),
    y: Math.min(1159, Math.max(0, Math.round(y * 10) / 10)),
    verified: bool(formData, "verified"),
    sort_order: int(formData, "sort_order"),
    published: bool(formData, "published"),
  };
  const { error } = id
    ? await sb.from("map_points").update(row).eq("id", id)
    : await sb.from("map_points").insert(row);
  if (error) back(from, "error", "save");
  updateTag("map");
  back(from, "ok", id ? "updated" : "created");
}

export async function deleteMapPoint(formData: FormData) {
  const { sb } = await requireAdmin();
  const { error } = await sb.from("map_points").delete().eq("id", str(formData, "id"));
  if (error) back("/admin/mappa", "error", "delete");
  updateTag("map");
  back("/admin/mappa", "ok", "deleted");
}

// ---------------------------------------------------------------- impostazioni private
const privateKeys = [
  "sender_name",
  "sender_address",
  "letter_place",
  "signer_name",
  "signer_role",
  "contact_name",
  "contact_email",
  "contact_phone",
  "iban",
  "account_holder",
  "payment_days",
];

export async function savePrivateSettings(formData: FormData) {
  const { sb } = await requireAdmin();
  const rows = privateKeys.map((key) => {
    const v = formData.get(key);
    return { key, value: typeof v === "string" ? v.trim() : "" };
  });
  const { error } = await sb.from("private_settings").upsert(rows, { onConflict: "key" });
  if (error) back("/admin/impostazioni", "error", "save");
  back("/admin/impostazioni", "ok", "updated");
}

// ---------------------------------------------------------------- comitato
export async function saveMember(formData: FormData) {
  const { sb } = await requireAdmin();
  const id = str(formData, "id");
  const from = id ? `/admin/comitato?id=${id}` : "/admin/comitato";
  const full_name = str(formData, "full_name");
  const role = str(formData, "role");
  if (!full_name || !role) back(from, "error", "required");

  let photo_url: string | null | undefined;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `committee/${crypto.randomUUID()}.${ext}`;
    const { error } = await sb.storage.from("media").upload(path, file, { contentType: file.type });
    if (error) back(from, "error", "upload");
    photo_url = sb.storage.from("media").getPublicUrl(path).data.publicUrl;
  } else if (bool(formData, "remove_photo")) {
    photo_url = null;
  }

  const row = {
    full_name,
    role,
    area: optional(formData, "area"),
    email: optional(formData, "email"),
    responsibilities: str(formData, "responsibilities")
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean),
    is_committee: bool(formData, "is_committee"),
    sort_order: int(formData, "sort_order"),
    published: bool(formData, "published"),
    ...(photo_url !== undefined ? { photo_url } : {}),
  };
  const { error } = id
    ? await sb.from("committee_members").update(row).eq("id", id)
    : await sb.from("committee_members").insert(row);
  if (error) back(from, "error", "save");
  updateTag("committee");
  back(from, "ok", id ? "updated" : "created");
}

export async function deleteMember(formData: FormData) {
  const { sb } = await requireAdmin();
  const { error } = await sb.from("committee_members").delete().eq("id", str(formData, "id"));
  if (error) back("/admin/comitato", "error", "delete");
  updateTag("committee");
  back("/admin/comitato", "ok", "deleted");
}
