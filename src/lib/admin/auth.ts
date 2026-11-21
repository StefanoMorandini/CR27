import "server-only";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";

/**
 * Verifica che l'utente sia autenticato e presente nella tabella `admins`.
 * Restituisce il client Supabase con la sessione dell'utente: tutte le scritture
 * passano comunque dalle regole RLS del database.
 */
export async function requireAdmin() {
  const sb = await getServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await sb.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) {
    await sb.auth.signOut();
    redirect("/admin/login?error=noadmin");
  }
  return { sb, user };
}
