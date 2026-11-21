"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { Field, inputCls } from "../ui";

type State = "checking" | "ready" | "nosession" | "saving" | "done";

/**
 * Imposta / cambia la password.
 * Funziona sia con il link di recupero (token nell'URL) sia da utente già collegato.
 */
export function PasswordForm() {
  const router = useRouter();
  const [state, setState] = useState<State>("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sb = getBrowserSupabase();
    (async () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const code = new URLSearchParams(window.location.search).get("code");
      if (hash.get("access_token") && hash.get("refresh_token")) {
        await sb.auth.setSession({ access_token: hash.get("access_token")!, refresh_token: hash.get("refresh_token")! });
        window.history.replaceState(null, "", window.location.pathname);
      } else if (code) {
        await sb.auth.exchangeCodeForSession(code);
        window.history.replaceState(null, "", window.location.pathname);
      }
      const { data } = await sb.auth.getUser();
      setState(data.user ? "ready" : "nosession");
    })().catch(() => setState("nosession"));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const pw = String(f.get("password") ?? "");
    if (pw.length < 10) return setError("La password deve avere almeno 10 caratteri.");
    if (pw !== f.get("confirm")) return setError("Le due password non coincidono.");
    setError(null);
    setState("saving");
    const { error } = await getBrowserSupabase().auth.updateUser({ password: pw });
    if (error) {
      setError("Impossibile salvare la password. Il link potrebbe essere scaduto: richiedine uno nuovo.");
      setState("ready");
      return;
    }
    setState("done");
    setTimeout(() => router.push("/admin"), 1200);
  }

  if (state === "checking") return <p className="text-sm text-muted">Verifica in corso…</p>;
  if (state === "nosession")
    return (
      <p className="text-sm text-muted">
        Link non valido o scaduto. Richiedi un nuovo link da{" "}
        <Link href="/admin/login" className="font-semibold text-blue underline">
          Accesso → Password dimenticata
        </Link>
        .
      </p>
    );
  if (state === "done") return <p className="text-sm font-semibold text-blue">Password salvata. Ti porto all&apos;area admin…</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Nuova password" hint="Almeno 10 caratteri.">
        <input name="password" type="password" required minLength={10} autoComplete="new-password" className={inputCls} />
      </Field>
      <Field label="Ripeti la password">
        <input name="confirm" type="password" required minLength={10} autoComplete="new-password" className={inputCls} />
      </Field>
      {error && <p className="rounded-xl bg-red-soft px-3 py-2 text-sm text-red-dark">{error}</p>}
      <button
        type="submit"
        disabled={state === "saving"}
        className="rounded-full bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
      >
        {state === "saving" ? "Salvataggio…" : "Salva password"}
      </button>
    </form>
  );
}
