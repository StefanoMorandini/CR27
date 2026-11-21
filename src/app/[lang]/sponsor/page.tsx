import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { CantonBars, KeyFigures } from "@/components/stats/Figures2025";
import { getSponsors, getSponsorTiers } from "@/lib/data";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { intlLocale } from "@/i18n/config";
import { SponsorWall } from "@/components/SponsorWall";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).pages.sponsor.title };
}

export default async function SponsorPage() {
  const [dict, lang, sponsors, tiers] = await Promise.all([getDictionary(), getLocale(), getSponsors(), getSponsorTiers()]);
  const t = dict.pages.sponsor;
  const chf = new Intl.NumberFormat(intlLocale[lang], { style: "currency", currency: "CHF", maximumFractionDigits: 0 });
  const packages = tiers.filter((tier) => tier.benefits.length > 0);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} />
      <div className="mx-auto max-w-5xl space-y-16 px-4 py-10">
        {sponsors.length > 0 ? <SponsorWall sponsors={sponsors} tiers={tiers} /> : <EmptyState>{t.empty}</EmptyState>}

        {/* ------------------------------------------- perché sostenerci */}
        <section aria-labelledby="why" className="space-y-6">
          <div className="reveal max-w-3xl">
            <h2 id="why" className="font-display text-3xl font-black uppercase sm:text-4xl">
              {t.whyTitle}
            </h2>
            <p className="mt-3 text-lg text-ink/80">{t.whyText}</p>
          </div>
          <h3 className="reveal text-xs font-bold uppercase tracking-[0.25em] text-muted">{t.figuresTitle}</h3>
          <KeyFigures t={t} />
          <CantonBars t={t} />
        </section>

        {/* ------------------------------------------- pacchetti */}
        {packages.length > 0 && (
          <section aria-labelledby="packages">
            <h2 id="packages" className="reveal font-display text-3xl font-black uppercase sm:text-4xl">
              {t.packagesTitle}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {packages.map((p, i) => (
                <li
                  key={p.id}
                  className={`reveal flex flex-col rounded-3xl border p-6 ${i === 0 ? "border-red bg-red text-white" : "border-line bg-white"}`}
                >
                  <span className="font-display text-xl font-black uppercase leading-tight">{p.name}</span>
                  <span className={`mt-1 text-sm font-semibold ${i === 0 ? "text-white/80" : "text-red"}`}>
                    {p.price_public && p.price_chf != null ? chf.format(p.price_chf) : t.onRequest}
                    {p.max_sponsors ? ` · ${t.maxSponsors.replace("{n}", String(p.max_sponsors))}` : ""}
                  </span>
                  <ul className="mt-4 space-y-2 text-sm">
                    {p.benefits.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span aria-hidden className={i === 0 ? "text-white" : "text-red"}>
                          ✓
                        </span>
                        <span className={i === 0 ? "text-white/90" : "text-ink/80"}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">{t.packagesNote}</p>
          </section>
        )}

        <section className="reveal relative overflow-hidden rounded-3xl bg-red p-8 text-white sm:p-10">
          <h2 className="font-display text-3xl font-black uppercase">{t.becomeTitle}</h2>
          <p className="mt-2 max-w-2xl text-white/90">{t.becomeText}</p>
          <Link href={`/${lang}/comitato#contatti`} className="mt-5 inline-block rounded-full bg-white px-6 py-3 font-semibold text-red transition hover:-translate-y-0.5">
            {t.becomeCta}
          </Link>
        </section>
      </div>
    </>
  );
}
