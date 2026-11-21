import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase per la lettura dei contenuti pubblici.
 * Non usa cookie: può quindi essere usato dentro funzioni `"use cache"`.
 * Restituisce `null` se le variabili d'ambiente non sono configurate
 * (il sito usa allora i contenuti di esempio in `src/lib/fallback.ts`).
 */
let client: SupabaseClient | null | undefined;

export function getPublicSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}
