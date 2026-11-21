import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getFood } from "@/lib/data";
import type { FbMenuItem } from "@/lib/types";

export const metadata: Metadata = { title: "Food & Drink" };

const categoryLabel: Record<FbMenuItem["category"], string> = {
  food: "Piatti",
  snack: "Snack",
  dessert: "Dolci",
  drink: "Bevande",
};

const chf = new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF" });

export default async function FoodPage() {
  const { points, items } = await getFood();
  const cats = (Object.keys(categoryLabel) as FbMenuItem["category"][])
    .map((c) => ({ c, list: items.filter((i) => i.category === c) }))
    .filter((g) => g.list.length > 0);

  return (
    <>
      <PageHeader eyebrow="Ristoro" title="Food & Drink" intro="Punti di ristoro allo stadio, menu e prezzi per atleti, accompagnatori e pubblico." />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        {points.length > 0 && (
          <section aria-labelledby="points">
            <h2 id="points" className="font-display text-3xl font-bold uppercase">Dove trovarci</h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-3">
              {points.map((p) => (
                <li key={p.id} className="rounded-2xl border border-line p-6">
                  <p className="font-display text-xl font-bold uppercase">{p.name}</p>
                  {p.location && <p className="text-sm text-muted">{p.location}</p>}
                  {p.opening_info && <p className="mt-2 text-sm">{p.opening_info}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {cats.map(({ c, list }) => (
          <section key={c} aria-labelledby={`c-${c}`}>
            <h2 id={`c-${c}`} className="font-display text-3xl font-bold uppercase">{categoryLabel[c]}</h2>
            <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
              {list.map((i) => (
                <li key={i.id} className={`flex items-baseline justify-between gap-4 p-4 ${i.available ? "" : "opacity-50"}`}>
                  <span>
                    <span className="font-semibold">{i.name}</span>
                    {i.vegan ? (
                      <span className="ml-2 rounded bg-ok/10 px-1.5 py-0.5 text-xs font-semibold text-ok">vegano</span>
                    ) : i.vegetarian ? (
                      <span className="ml-2 rounded bg-ok/10 px-1.5 py-0.5 text-xs font-semibold text-ok">vegetariano</span>
                    ) : null}
                    {!i.available && <span className="ml-2 text-xs font-semibold text-brand">esaurito</span>}
                    {i.allergens.length > 0 && (
                      <span className="block text-xs text-muted">Allergeni: {i.allergens.join(", ")}</span>
                    )}
                  </span>
                  {i.price_chf != null && (
                    <span className="shrink-0 font-semibold tabular-nums">{chf.format(i.price_chf)}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {points.length === 0 && cats.length === 0 && (
          <EmptyState>Menu e punti di ristoro saranno pubblicati prossimamente.</EmptyState>
        )}
      </div>
    </>
  );
}
