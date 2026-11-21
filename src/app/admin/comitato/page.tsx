import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import type { CommitteeMember } from "@/lib/types";
import { deleteMember, saveMember } from "../actions";
import { ConfirmButton } from "../ConfirmButton";
import { Check, Field, Flash, Loading, PageTitle, Submit, inputCls } from "../ui";

export const metadata = { title: "Comitato" };

type SP = Promise<Record<string, string | string[] | undefined>>;
type Member = CommitteeMember & { sort_order: number; published: boolean };

async function MembersAdmin({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const selectedId = typeof sp.id === "string" ? sp.id : undefined;
  const { sb } = await requireAdmin();
  const { data } = await sb.from("committee_members").select("*").order("sort_order");
  const list = (data ?? []) as Member[];
  const sel = selectedId ? list.find((m) => m.id === selectedId) : undefined;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <section className="overflow-hidden rounded-3xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-xl font-black uppercase">Persone</h2>
            <p className="text-xs text-muted">
              {list.filter((m) => m.is_committee).length} nel comitato · {list.filter((m) => !m.photo_url).length} senza foto ·{" "}
              {list.filter((m) => !m.published).length} in bozza
            </p>
          </div>
          <Link href="/admin/comitato" className="rounded-full bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark">
            + Nuova persona
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-stone/60 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-2.5 font-bold">Nome</th>
                <th className="px-3 py-2.5 font-bold">Ruolo</th>
                <th className="px-3 py-2.5 font-bold">Responsabilità</th>
                <th className="px-3 py-2.5 font-bold">Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((m) => (
                <tr key={m.id} className={m.id === sel?.id ? "bg-red-soft/60" : "hover:bg-stone/40"}>
                  <td className="px-5 py-2.5">
                    <Link href={`/admin/comitato?id=${m.id}`} className="flex items-center gap-3 font-semibold hover:text-red">
                      {m.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.photo_url} alt="" className="size-9 rounded-full object-cover" />
                      ) : (
                        <span className="grid size-9 place-items-center rounded-full bg-stone text-[10px] text-muted">foto</span>
                      )}
                      {m.full_name}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">
                    {m.role}
                    {m.is_committee && <span className="ml-2 rounded-full bg-red-soft px-2 py-0.5 text-[10px] font-bold text-red">CO</span>}
                  </td>
                  <td className="max-w-64 px-3 py-2.5 text-xs text-muted">{m.responsibilities.join(" · ")}</td>
                  <td className="px-3 py-2.5 text-xs font-semibold text-muted">{m.published ? "Pubblicato" : "Bozza"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="rounded-3xl border border-line bg-white p-5 lg:sticky lg:top-6">
        <h2 className="font-display mb-4 text-lg font-black uppercase">{sel ? `Modifica: ${sel.full_name}` : "Nuova persona"}</h2>
        <form key={sel?.id ?? "new"} action={saveMember} className="space-y-4">
          {sel && <input type="hidden" name="id" value={sel.id} />}
          <Field label="Nome e cognome *">
            <input name="full_name" required defaultValue={sel?.full_name} className={inputCls} />
          </Field>
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <Field label="Ruolo *" hint="Es. Presidente">
              <input name="role" required defaultValue={sel?.role} className={inputCls} />
            </Field>
            <Field label="Ordine">
              <input name="sort_order" type="number" defaultValue={sel?.sort_order ?? (list.at(-1)?.sort_order ?? 0) + 10} className={inputCls} />
            </Field>
          </div>
          <Field label="Responsabilità" hint="Una per riga.">
            <textarea name="responsibilities" rows={3} defaultValue={sel?.responsibilities.join("\n") ?? ""} className={inputCls} />
          </Field>
          <Field label="Email pubblica" hint="Facoltativa, mostrata sul sito.">
            <input name="email" type="email" defaultValue={sel?.email ?? ""} className={inputCls} />
          </Field>
          <Field label="Foto" hint="JPG, PNG o WEBP, max 5 MB. Meglio quadrata.">
            <div className="flex items-center gap-3">
              {sel?.photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sel.photo_url} alt="" className="size-14 rounded-full object-cover" />
              )}
              <input name="photo" type="file" accept="image/png,image/jpeg,image/webp" className="text-sm" />
            </div>
          </Field>
          {sel?.photo_url && <Check name="remove_photo" label="Rimuovi la foto" />}
          <input type="hidden" name="area" value={sel?.area ?? ""} />
          <div className="flex flex-wrap gap-5">
            <Check name="is_committee" label="Membro del comitato" defaultChecked={sel?.is_committee ?? false} />
            <Check name="published" label="Pubblicato" defaultChecked={sel?.published ?? true} />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Submit>{sel ? "Salva modifiche" : "Aggiungi"}</Submit>
            {sel && (
              <Link href="/admin/comitato" className="text-sm font-semibold text-muted hover:text-ink">
                Annulla
              </Link>
            )}
          </div>
        </form>
        {sel && (
          <form action={deleteMember} className="mt-4 border-t border-line pt-4">
            <input type="hidden" name="id" value={sel.id} />
            <ConfirmButton message={`Eliminare "${sel.full_name}"?`}>Elimina</ConfirmButton>
          </form>
        )}
      </aside>
    </div>
  );
}

export default function MembersPage({ searchParams }: PageProps<"/admin/comitato">) {
  return (
    <>
      <PageTitle title="Comitato e collaboratori" back={{ href: "/admin", label: "Dashboard" }} />
      <Suspense>
        <Flash searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <MembersAdmin searchParams={searchParams} />
      </Suspense>
    </>
  );
}
