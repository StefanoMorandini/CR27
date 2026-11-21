import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase con la sessione dell'utente (cookie). Da usare solo nell'area
 * admin e nelle Server Actions: legge i cookie, quindi è sempre dinamico.
 */
export async function getServerSupabase() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // Chiamato da un Server Component: i cookie li aggiorna il proxy.
          }
        },
      },
    },
  );
}
