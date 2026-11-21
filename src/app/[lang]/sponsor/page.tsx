import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getSponsors, getSponsorTiers } from "@/lib/data";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { SponsorWall } from "@/components/SponsorWall";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).pages.sponsor.title };
}

export default async function SponsorPage() {
  const [dict, lang, sponsors, tiers] = await Promise.all([getDictionary(), getLocale(), getSponsors(), getSponsorTiers()]);
  const t = dict.pages.sponsor;
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} />
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
        {sponsors.length > 0 && <SponsorWall sponsors={sponsors} tiers={tiers} />}

        {sponsors.length === 0 && <EmptyState>{t.empty}</EmptyState>}

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
