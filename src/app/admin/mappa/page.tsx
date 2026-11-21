import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { categoryColor } from "@/components/map/markers";
import type { MapCategory, MapPoint } from "@/lib/types";
import { deleteMapPoint, saveMapPoint } from "../actions";
import { ConfirmButton } from "../ConfirmButton";
import { Check, Field, Flash, Loading, PageTitle, Submit, inputCls } from "../ui";
import { MapPicker } from "./MapPicker";

export const metadata = { title: "Mappa" };

const categories: { value: MapCategory; label: string }[] = [
  { value: "gare", label: "Gare e pedane" },
  { value: "atleti", label: "Atleti" },
  { value: "servizi", label: "Servizi" },
  { value: "parcheggi", label: "Parcheggi" },
];
const catLabel = Object.fromEntries(categories.map((c) => [c.value, c.label]));

type SP = Promise<Record<string, string | string[] | undefined>>;

async function MapAdmin({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const selectedId = typeof sp.id === "string" ? sp.id : undefined;
  const { sb } = await requireAdmin();
  const { data } = await sb.from("map_points").select("*").order("sort_order");
  const list = ((data ?? []) as MapPoint[]).map((p) => ({ ...p, x: Number(p.x), y: Number(p.y) }));
  const selected = selectedId ? list.find((p) => p.id === selectedId) : undefined;
  const toVerify = list.filter((p) => !p.verified).length;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
      <section className="overflow-hidden rounded-3xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-xl font-black uppercase">Punti della mappa</h2>
            <p className="text-xs text-muted">
              {list.length} punti · {toVerify > 0 ? `${toVerify} con posizione indicativa da verificare` : "tutti verificati"}
            </p>
          </div>
          <div className="flex gap-2">
            <a href="/it/mappa" target="_blank" className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-ink/30">
              Vedi mappa ↗
            </a>
            <Link href="/admin/mappa" className="rounded-full bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark">
              + Nuovo punto
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-stone/60 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-2.5 font-bold">Nome</th>
                <th className="px-3 py-2.5 font-bold">Categoria</th>
                <th className="px-3 py-2.5 font-bold">Posizione</th>
                <th className="px-3 py-2.5 font-bold">Stato</th>
                <th className="px-5 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((p) => (
                <tr key={p.id} className={p.id === selectedId ? "bg-red-soft/60" : "hover:bg-stone/40"}>
                  <td className="px-5 py-3 font-semibold">
                    <Link href={`/admin/mappa?id=${p.id}`} className="hover:text-red">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-2 text-muted">
                      <span className="size-2.5 rounded-full" style={{ background: categoryColor[p.category] }} />
                      {catLabel[p.category]}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {p.verified ? (
                      <span className="rounded-full bg-blue-soft px-2.5 py-1 text-xs font-bold text-blue">Verificata</span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">Indicativa</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs font-semibold text-muted">{p.published ? "Pubblicato" : "Bozza"}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/mappa?id=${p.id}`} className="font-semibold text-blue hover:underline">
                      Modifica
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="rounded-3xl border border-line bg-white p-5 lg:sticky lg:top-6">
        <h2 className="font-display mb-4 text-lg font-black uppercase">{selected ? `Modifica: ${selected.name}` : "Nuovo punto"}</h2>
        <form key={selected?.id ?? "new"} action={saveMapPoint} className="space-y-4">
          {selected && <input type="hidden" name="id" value={selected.id} />}
          <MapPicker point={selected} others={list.filter((p) => p.id !== selected?.id)} />
          <Field label="Nome *">
            <input name="name" required defaultValue={selected?.name} placeholder="es. Camera d'appello" className={inputCls} />
          </Field>
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <Field label="Categoria">
              <select name="category" defaultValue={selected?.category ?? "gare"} className={inputCls}>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ordine">
              <input name="sort_order" type="number" defaultValue={selected?.sort_order ?? (list.at(-1)?.sort_order ?? 0) + 10} className={inputCls} />
            </Field>
          </div>
          <Field label="Descrizione">
            <textarea name="description" rows={2} defaultValue={selected?.description ?? ""} className={inputCls} />
          </Field>
          <div className="flex flex-wrap gap-5">
            <Check name="verified" label="Posizione verificata" defaultChecked={selected?.verified ?? true} />
            <Check name="published" label="Pubblicato" defaultChecked={selected?.published ?? true} />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Submit>{selected ? "Salva modifiche" : "Aggiungi punto"}</Submit>
            {selected && (
              <Link href="/admin/mappa" className="text-sm font-semibold text-muted hover:text-ink">
                Annulla
              </Link>
            )}
          </div>
        </form>
        {selected && (
          <form action={deleteMapPoint} className="mt-4 border-t border-line pt-4">
            <input type="hidden" name="id" value={selected.id} />
            <ConfirmButton message={`Eliminare "${selected.name}"?`}>Elimina punto</ConfirmButton>
          </form>
        )}
      </aside>
    </div>
  );
}

export default function MapAdminPage({ searchParams }: PageProps<"/admin/mappa">) {
  return (
    <>
      <PageTitle title="Mappa dell'impianto" back={{ href: "/admin", label: "Dashboard" }} />
      <Suspense>
        <Flash searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <MapAdmin searchParams={searchParams} />
      </Suspense>
    </>
  );
}
