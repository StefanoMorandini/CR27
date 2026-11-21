import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import type { SponsorTier } from "@/lib/types";
import { deleteTier, saveTier } from "../actions";
import { ConfirmButton } from "../ConfirmButton";
import { Field, Flash, Loading, PageTitle, Submit, inputCls } from "../ui";

export const metadata = { title: "Tier" };

const displays = [
  { value: "featured", label: "In evidenza", hint: "card grande a tutta larghezza" },
  { value: "large", label: "Grande", hint: "2 per riga" },
  { value: "medium", label: "Medio", hint: "3 per riga" },
  { value: "small", label: "Piccolo", hint: "4 per riga" },
];
const displayLabel = Object.fromEntries(displays.map((d) => [d.value, d]));

/** Schemino della resa grafica del tier. */
function DisplayIcon({ display }: { display: string }) {
  const n = { featured: 1, large: 2, medium: 3, small: 4 }[display] ?? 1;
  return (
    <span className="inline-grid w-14 gap-0.5" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }} aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className={`h-4 rounded-sm ${display === "featured" ? "bg-red" : "bg-red/40"}`} />
      ))}
    </span>
  );
}

type SP = Promise<Record<string, string | string[] | undefined>>;

async function TierAdmin({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const selectedId = typeof sp.id === "string" ? sp.id : undefined;
  const { sb } = await requireAdmin();
  const [{ data: tiers }, { data: sponsors }] = await Promise.all([
    sb.from("sponsor_tiers").select("*").order("sort_order"),
    sb.from("sponsors").select("tier_id, published"),
  ]);
  const list = (tiers ?? []) as SponsorTier[];
  const count = (id: string) => (sponsors ?? []).filter((s) => s.tier_id === id);
  const selected = selectedId ? list.find((t) => t.id === selectedId) : undefined;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section className="overflow-hidden rounded-3xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-xl font-black uppercase">Tier</h2>
            <p className="text-xs text-muted">Mostrati sul sito in ordine crescente; un tier senza sponsor pubblicati non compare.</p>
          </div>
          <Link href="/admin/tier" className="rounded-full bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark">
            + Nuovo tier
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-stone/60 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-2.5 text-center font-bold">Ordine</th>
                <th className="px-3 py-2.5 font-bold">Nome</th>
                <th className="px-3 py-2.5 font-bold">Visualizzazione</th>
                <th className="px-3 py-2.5 text-center font-bold">Sponsor</th>
                <th className="px-5 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((t) => {
                const sp = count(t.id);
                const d = displayLabel[t.display];
                return (
                  <tr key={t.id} className={t.id === selectedId ? "bg-red-soft/60" : "hover:bg-stone/40"}>
                    <td className="px-5 py-3 text-center tabular-nums text-muted">{t.sort_order}</td>
                    <td className="px-3 py-3 font-semibold">
                      <Link href={`/admin/tier?id=${t.id}`} className="hover:text-red">
                        {t.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-3">
                        <DisplayIcon display={t.display} />
                        <span>
                          {d?.label}
                          <span className="block text-xs text-muted">{d?.hint}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Link href={`/admin/sponsor?tier=${t.id}`} className="font-semibold text-blue hover:underline">
                        {sp.length}
                      </Link>
                      {sp.length > 0 && (
                        <span className="block text-[11px] text-muted">{sp.filter((x) => x.published).length} pubblicati</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/tier?id=${t.id}`} className="font-semibold text-blue hover:underline">
                        Modifica
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="rounded-3xl border border-line bg-white p-5 lg:sticky lg:top-6">
        <h2 className="font-display mb-4 text-lg font-black uppercase">{selected ? `Modifica: ${selected.name}` : "Nuovo tier"}</h2>
        <form key={selected?.id ?? "new"} action={saveTier} className="space-y-4">
          {selected && <input type="hidden" name="id" value={selected.id} />}
          <Field label="Nome *">
            <input name="name" required defaultValue={selected?.name} placeholder="es. Bronze" className={inputCls} />
          </Field>
          <fieldset>
            <legend className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">Visualizzazione</legend>
            <div className="grid grid-cols-2 gap-2">
              {displays.map((d) => (
                <label
                  key={d.value}
                  className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-line p-3 text-sm has-[:checked]:border-red has-[:checked]:bg-red-soft/50"
                >
                  <input
                    type="radio"
                    name="display"
                    value={d.value}
                    defaultChecked={(selected?.display ?? "medium") === d.value}
                    className="sr-only"
                  />
                  <DisplayIcon display={d.value} />
                  <span className="font-semibold">{d.label}</span>
                  <span className="-mt-1.5 text-xs text-muted">{d.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <Field label="Ordine" hint="Numero più basso = mostrato prima.">
            <input name="sort_order" type="number" defaultValue={selected?.sort_order ?? (list.at(-1)?.sort_order ?? 0) + 10} className={inputCls} />
          </Field>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Submit>{selected ? "Salva modifiche" : "Aggiungi tier"}</Submit>
            {selected && (
              <Link href="/admin/tier" className="text-sm font-semibold text-muted hover:text-ink">
                Annulla
              </Link>
            )}
          </div>
        </form>
        {selected && (
          <form action={deleteTier} className="mt-4 border-t border-line pt-4">
            <input type="hidden" name="id" value={selected.id} />
            {count(selected.id).length > 0 ? (
              <p className="text-xs text-muted">
                Per eliminare questo tier sposta prima{" "}
                {count(selected.id).length === 1 ? "il suo sponsor" : `i suoi ${count(selected.id).length} sponsor`} in un altro tier.
              </p>
            ) : (
              <ConfirmButton message={`Eliminare il tier "${selected.name}"?`}>Elimina tier</ConfirmButton>
            )}
          </form>
        )}
      </aside>
    </div>
  );
}

export default function TierAdminPage({ searchParams }: PageProps<"/admin/tier">) {
  return (
    <>
      <PageTitle title="Tier sponsor" back={{ href: "/admin", label: "Dashboard" }} />
      <Suspense>
        <Flash searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <TierAdmin searchParams={searchParams} />
      </Suspense>
    </>
  );
}
