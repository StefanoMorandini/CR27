import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CantonBars, KeyFigures } from "@/components/stats/Figures2025";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).pages["chi-siamo"].title };
}

export default async function ChiSiamoPage() {
  const [dict, lang] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.pages["chi-siamo"];
  const s = dict.pages.sponsor;
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
      <div className="mx-auto max-w-5xl space-y-16 px-4 py-12">
        <section className="grid gap-10 md:grid-cols-2">
          {[
            { title: t.whatTitle, text: t.whatText },
            { title: t.whoTitle, text: t.whoText },
          ].map((b) => (
            <div key={b.title} className="reveal">
              <h2 className="font-display text-3xl font-black uppercase">{b.title}</h2>
              {b.text.map((p) => (
                <p key={p} className="mt-3 text-lg leading-relaxed text-ink/80">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </section>

        <section aria-labelledby="mission">
          <h2 id="mission" className="reveal font-display text-3xl font-black uppercase">
            {t.missionTitle}
          </h2>
          <ul className="track mt-6 overflow-hidden rounded-2xl bg-red py-3">
            {t.mission.map((m, i) => (
              <li key={m.title} className="reveal border-t-[3px] border-white px-6 py-5 text-white last:border-b-[3px] sm:px-8">
                <div className="flex gap-5">
                  <span className="font-display text-4xl font-black">{i + 1}</span>
                  <span>
                    <span className="font-display block text-xl font-black uppercase">{m.title}</span>
                    <span className="mt-1 block text-white/85">{m.text}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="figures" className="space-y-6">
          <h2 id="figures" className="reveal font-display text-3xl font-black uppercase">
            {s.figuresTitle}
          </h2>
          <KeyFigures t={s} />
          <div className="grid gap-6 md:grid-cols-2">
            <CantonBars t={s} />
            <div className="reveal rounded-3xl bg-blue-soft p-6">
              <h3 className="font-display text-xl font-black uppercase">{t.regionTitle}</h3>
              <p className="mt-3 text-ink/80">{t.regionText}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="partners">
          <h2 id="partners" className="reveal font-display text-3xl font-black uppercase">
            {t.partnersTitle}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {t.partners.map((p) => {
              const body = (
                <>
                  <span className="font-display block text-2xl font-black uppercase">{p.name}</span>
                  <span className="mt-1 block text-sm text-muted">{p.role}</span>
                </>
              );
              return (
                <li key={p.name} className="reveal">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener" className="block h-full rounded-3xl border border-line p-6 transition hover:border-red">
                      {body}
                    </a>
                  ) : (
                    <div className="h-full rounded-3xl border border-line p-6">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <Link href={`/${lang}/comitato`} className="lane-row flex items-center justify-between rounded-3xl bg-ink px-6 py-6 text-white sm:px-8">
          <span className="font-display text-xl font-black uppercase sm:text-2xl">{t.committeeCta}</span>
          <span aria-hidden className="lane-arrow text-2xl">
            →
          </span>
        </Link>
      </div>
    </>
  );
}
