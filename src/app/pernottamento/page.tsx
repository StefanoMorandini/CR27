import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getAccommodations } from "@/lib/data";

export const metadata: Metadata = { title: "Pernottamento" };

export default async function PernottamentoPage() {
  const list = await getAccommodations();
  return (
    <>
      <PageHeader eyebrow="Bellinzona e dintorni" title="Pernottamento" intro="Strutture consigliate e convenzionate per atleti, società e accompagnatori." />
      <div className="mx-auto max-w-6xl px-4 py-10">
        {list.length === 0 ? (
          <EmptyState>Le offerte di pernottamento saranno pubblicate prossimamente.</EmptyState>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {list.map((a) => (
              <li key={a.id} className="flex flex-col rounded-2xl border border-line p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-2xl font-bold uppercase">{a.name}</h2>
                  {a.is_partner && (
                    <span className="shrink-0 rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-white">Partner</span>
                  )}
                </div>
                <p className="text-sm text-muted">
                  {[a.locality, a.distance_km != null && `${a.distance_km} km dallo stadio`, a.price_range]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {a.notes && <p className="mt-3">{a.notes}</p>}
                {a.booking_code && (
                  <p className="mt-3 text-sm">
                    Codice convenzione: <strong className="font-mono">{a.booking_code}</strong>
                  </p>
                )}
                <div className="mt-auto flex gap-4 pt-4 text-sm font-semibold">
                  {a.website_url && (
                    <a href={a.website_url} target="_blank" rel="noopener" className="text-sky underline underline-offset-4">
                      Prenota ↗
                    </a>
                  )}
                  {a.phone && (
                    <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="text-sky underline underline-offset-4">
                      {a.phone}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
