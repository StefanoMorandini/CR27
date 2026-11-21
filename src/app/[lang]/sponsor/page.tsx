import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getSponsors } from "@/lib/data";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import type { SponsorTier } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).pages.sponsor.title };
}

const tiers: { tier: SponsorTier; size: string }[] = [
  { tier: "main", size: "md:col-span-2 h-40" },
  { tier: "gold", size: "h-32" },
  { tier: "silver", size: "h-28" },
  { tier: "supporter", size: "h-24" },
  { tier: "institutional", size: "h-24" },
  { tier: "media", size: "h-24" },
];

export default async function SponsorPage() {
  const [dict, lang, sponsors] = await Promise.all([getDictionary(), getLocale(), getSponsors()]);
  const t = dict.pages.sponsor;
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
        {tiers.map(({ tier, size }) => {
          const list = sponsors.filter((s) => s.tier === tier);
          if (list.length === 0) return null;
          return (
            <section key={tier} aria-labelledby={`t-${tier}`} className="reveal">
              <h2 id={`t-${tier}`} className="text-xs font-bold uppercase tracking-[0.3em] text-muted">{t.tiers[tier]}</h2>
              <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {list.map((s) => {
                  const inner = s.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.logo_url} alt={s.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="font-display text-xl font-black">{s.name}</span>
                  );
                  const cls = "grid h-full place-items-center rounded-3xl border border-line p-4";
                  return (
                    <li key={s.id} className={size}>
                      {s.website_url ? (
                        <a href={s.website_url} target="_blank" rel="noopener sponsored" className={`${cls} transition hover:border-red hover:shadow-md`}>
                          {inner}
                        </a>
                      ) : (
                        <div className={cls}>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

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
