import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getFood } from "@/lib/data";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { intlLocale } from "@/i18n/config";
import type { FbMenuItem } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).pages.food.title };
}

export default async function FoodPage() {
  const [dict, lang, { points, items }] = await Promise.all([getDictionary(), getLocale(), getFood()]);
  const t = dict.pages.food;
  const chf = new Intl.NumberFormat(intlLocale[lang], { style: "currency", currency: "CHF" });
  const cats = (Object.keys(t.categories) as FbMenuItem["category"][])
    .map((c) => ({ c, list: items.filter((i) => i.category === c) }))
    .filter((g) => g.list.length > 0);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
        {points.length > 0 && (
          <section aria-labelledby="points">
            <h2 id="points" className="font-display text-3xl font-black uppercase">{t.pointsTitle}</h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-3">
              {points.map((p) => (
                <li key={p.id} className="reveal rounded-3xl border border-line border-t-4 border-t-red p-6">
                  <p className="font-display text-xl font-black uppercase">{p.name}</p>
                  {p.location && <p className="text-sm text-muted">{p.location}</p>}
                  {p.opening_info && <p className="mt-2 text-sm">{p.opening_info}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {cats.map(({ c, list }) => (
          <section key={c} aria-labelledby={`c-${c}`} className="reveal">
            <h2 id={`c-${c}`} className="font-display text-3xl font-black uppercase">{t.categories[c]}</h2>
            <ul className="mt-4 divide-y divide-line rounded-3xl border border-line">
              {list.map((i) => (
                <li key={i.id} className={`flex items-baseline justify-between gap-4 p-5 ${i.available ? "" : "opacity-50"}`}>
                  <span>
                    <span className="font-semibold">{i.name}</span>
                    {i.vegan ? (
                      <span className="ml-2 rounded bg-blue-soft px-1.5 py-0.5 text-xs font-semibold text-blue">{t.vegan}</span>
                    ) : i.vegetarian ? (
                      <span className="ml-2 rounded bg-blue-soft px-1.5 py-0.5 text-xs font-semibold text-blue">{t.vegetarian}</span>
                    ) : null}
                    {!i.available && <span className="ml-2 text-xs font-semibold text-red">{t.soldOut}</span>}
                    {i.allergens.length > 0 && (
                      <span className="block text-xs text-muted">
                        {t.allergens}: {i.allergens.join(", ")}
                      </span>
                    )}
                  </span>
                  {i.price_chf != null && <span className="font-display shrink-0 font-black tabular-nums">{chf.format(i.price_chf)}</span>}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {points.length === 0 && cats.length === 0 && <EmptyState>{t.empty}</EmptyState>}
      </div>
    </>
  );
}
