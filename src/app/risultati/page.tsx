import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getResultLinks, getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Risultati" };

const kindLabel = {
  live: "Live",
  results: "Risultati",
  startlist: "Liste di partenza",
  document: "Documenti",
} as const;

export default async function RisultatiPage() {
  const [links, settings] = await Promise.all([getResultLinks(), getSettings()]);
  const groups = (Object.keys(kindLabel) as (keyof typeof kindLabel)[])
    .map((k) => ({ kind: k, items: links.filter((l) => l.kind === k) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Live"
        title="Risultati"
        intro="Risultati in tempo reale, liste di partenza e classifiche ufficiali."
      />
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        {settings.results_live_url && (
          <a
            href={settings.results_live_url}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between rounded-2xl bg-brand p-6 text-white hover:bg-brand-dark"
          >
            <span>
              <span className="block font-display text-2xl font-bold uppercase">Risultati live</span>
              <span className="text-white/80">Apri la pagina ufficiale dei risultati</span>
            </span>
            <span aria-hidden className="text-3xl">↗</span>
          </a>
        )}

        {settings.results_embed_url && (
          <section aria-label="Risultati incorporati">
            <div className="overflow-hidden rounded-2xl border border-line">
              <iframe
                src={settings.results_embed_url}
                title="Risultati live"
                className="h-[75vh] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-2 text-sm text-muted">
              La finestra non si carica?{" "}
              <a href={settings.results_embed_url} target="_blank" rel="noopener" className="underline">
                Apri i risultati in una nuova scheda
              </a>
              .
            </p>
          </section>
        )}

        {groups.map((g) => (
          <section key={g.kind} aria-labelledby={`k-${g.kind}`}>
            <h2 id={`k-${g.kind}`} className="font-display text-2xl font-bold uppercase">
              {kindLabel[g.kind]}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {g.items.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center justify-between rounded-xl border border-line p-4 hover:border-brand"
                  >
                    <span className="font-semibold">{l.label}</span>
                    <span aria-hidden className="text-muted">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {!settings.results_live_url && !settings.results_embed_url && groups.length === 0 && (
          <EmptyState>
            I risultati saranno disponibili qui durante le gare del 19 e 20 giugno 2027.
          </EmptyState>
        )}
      </div>
    </>
  );
}
