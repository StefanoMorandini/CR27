import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import type { SponsorTier } from "@/lib/types";
import { deleteTier, saveTier } from "../actions";
import { ConfirmButton } from "../ConfirmButton";
import { Field, Flash, Loading, PageTitle, Panel, Submit, inputCls } from "../ui";

export const metadata = { title: "Tier" };

const displays = [
  { value: "featured", label: "In evidenza (card grande)" },
  { value: "large", label: "Grande (2 per riga)" },
  { value: "medium", label: "Medio (3 per riga)" },
  { value: "small", label: "Piccolo (4 per riga)" },
];

function TierFields({ tier }: { tier?: SponsorTier & { count?: number } }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[2fr_2fr_1fr]">
      <Field label="Nome *">
        <input name="name" required defaultValue={tier?.name} className={inputCls} />
      </Field>
      <Field label="Visualizzazione">
        <select name="display" defaultValue={tier?.display ?? "medium"} className={inputCls}>
          {displays.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Ordine">
        <input name="sort_order" type="number" defaultValue={tier?.sort_order ?? 100} className={inputCls} />
      </Field>
    </div>
  );
}

async function TierAdmin() {
  const { sb } = await requireAdmin();
  const [{ data: tiers }, { data: sponsors }] = await Promise.all([
    sb.from("sponsor_tiers").select("*").order("sort_order"),
    sb.from("sponsors").select("tier_id"),
  ]);
  const count = (id: string) => (sponsors ?? []).filter((s) => s.tier_id === id).length;

  return (
    <div className="space-y-6">
      <Panel title="Tier esistenti">
        <p className="-mt-2 mb-5 text-sm text-muted">
          I tier compaiono sul sito in ordine crescente. Un tier senza sponsor pubblicati non viene mostrato.
        </p>
        <ul className="space-y-4">
          {((tiers ?? []) as SponsorTier[]).map((t) => (
            <li key={t.id} className="rounded-2xl border border-line p-4">
              <form action={saveTier} className="space-y-3">
                <input type="hidden" name="id" value={t.id} />
                <TierFields tier={t} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-muted">{count(t.id)} sponsor</span>
                  <Submit variant="ghost">Salva</Submit>
                </div>
              </form>
              <form action={deleteTier} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={t.id} />
                <ConfirmButton message={`Eliminare il tier "${t.name}"?`}>Elimina</ConfirmButton>
              </form>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Nuovo tier">
        <form action={saveTier} className="space-y-4">
          <TierFields />
          <Submit>Aggiungi tier</Submit>
        </form>
      </Panel>
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
        <TierAdmin />
      </Suspense>
    </>
  );
}
