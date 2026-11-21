import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getResultLinks, getSettings } from "@/lib/data";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).pages.risultati.title };
}

export default async function RisultatiPage() {
  const [dict, links, settings] = await Promise.all([getDictionary(), getResultLinks(), getSettings()]);
  const t = dict.pages.risultati;
  const groups = (Object.keys(t.kinds) as (keyof typeof t.kinds)[])
    .map((k) => ({ kind: k, items: links.filter((l) => l.kind === k) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} />
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
        {settings.results_live_url && (
          <a
            href={settings.results_live_url}
            target="_blank"
            rel="noopener"
            className="lane-row flex items-center justify-between rounded-3xl bg-red p-6 text-white sm:p-8"
          >
            <span>
              <span className="font-display flex items-center gap-3 text-2xl font-black uppercase sm:text-3xl">
                <span className="live-dot size-3 rounded-full bg-white" aria-hidden />
                {dict.common.resultsLive}
              </span>
              <span className="text-white/85">{t.liveCta}</span>
            </span>
            <span aria-hidden className="lane-arrow text-3xl">↗</span>
          </a>
        )}

        {settings.results_embed_url && (
          <section aria-label={t.title}>
            <div className="overflow-hidden rounded-3xl border border-line">
              <iframe src={settings.results_embed_url} title={t.title} className="h-[75vh] w-full" loading="lazy" />
            </div>
            <p className="mt-2 text-sm text-muted">
              {t.embedFallback}{" "}
              <a href={settings.results_embed_url} target="_blank" rel="noopener" className="font-semibold text-blue underline">
                {t.embedOpen}
              </a>
            </p>
          </section>
        )}

        {groups.map((g) => (
          <section key={g.kind} aria-labelledby={`k-${g.kind}`} className="reveal">
            <h2 id={`k-${g.kind}`} className="font-display text-2xl font-black uppercase">
              {t.kinds[g.kind]}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {g.items.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center justify-between rounded-2xl border border-line p-5 transition hover:border-red hover:shadow-md"
                  >
                    <span className="font-semibold">{l.label}</span>
                    <span aria-hidden className="text-red">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {!settings.results_live_url && !settings.results_embed_url && groups.length === 0 && <EmptyState>{t.empty}</EmptyState>}
      </div>
    </>
  );
}
