import Link from "next/link";

export const inputCls =
  "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/15";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-[var(--red)]" />
      {label}
    </label>
  );
}

export function Submit({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "ghost" | "danger" }) {
  const cls = {
    primary: "bg-red text-white hover:bg-red-dark",
    ghost: "border border-line bg-white text-ink hover:border-ink/30",
    danger: "border border-red/30 bg-white text-red hover:bg-red-soft",
  }[variant];
  return (
    <button type="submit" className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${cls}`}>
      {children}
    </button>
  );
}

export function Panel({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-white p-5 sm:p-7">
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          {title && <h2 className="font-display text-xl font-black uppercase">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageTitle({ title, back }: { title: string; back?: { href: string; label: string } }) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="text-sm font-semibold text-blue hover:underline">
          ← {back.label}
        </Link>
      )}
      <h1 className="font-display mt-1 text-3xl font-black uppercase sm:text-4xl">{title}</h1>
    </div>
  );
}

const messages: Record<string, string> = {
  created: "Elemento creato. Il sito pubblico è già aggiornato.",
  updated: "Modifiche salvate. Il sito pubblico è già aggiornato.",
  deleted: "Elemento eliminato.",
  reset: "Se l'indirizzo è registrato, riceverai un'email con il link per reimpostare la password.",
  credentials: "Email o password non corretti.",
  noadmin: "Questo account non ha accesso all'area admin.",
  required: "Compila i campi obbligatori.",
  save: "Salvataggio non riuscito. Riprova.",
  delete: "Eliminazione non riuscita.",
  upload: "Caricamento del logo non riuscito (formati: PNG, JPG, WEBP, SVG — max 5 MB).",
  tier_in_use: "Questo tier ha ancora degli sponsor: spostali in un altro tier prima di eliminarlo.",
};

/** Messaggio di esito (?ok=… / ?error=…) dopo un'azione. */
export async function Flash({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const ok = typeof sp.ok === "string" ? sp.ok : undefined;
  const err = typeof sp.error === "string" ? sp.error : undefined;
  if (!ok && !err) return null;
  return (
    <p
      role="status"
      className={`mb-5 rounded-2xl px-4 py-3 text-sm font-medium ${err ? "bg-red-soft text-red-dark" : "bg-blue-soft text-blue"}`}
    >
      {messages[(err ?? ok)!] ?? (err ? "Si è verificato un errore." : "Fatto.")}
    </p>
  );
}

export function Loading() {
  return <p className="py-10 text-center text-sm text-muted">Caricamento…</p>;
}
