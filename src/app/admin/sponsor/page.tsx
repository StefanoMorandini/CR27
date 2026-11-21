import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import type { Sponsor, SponsorTier } from "@/lib/types";
import { toggleSponsor } from "../actions";
import { Flash, Loading, PageTitle } from "../ui";
import { SponsorForm } from "./SponsorForm";

export const metadata = { title: "Sponsor" };

type SP = Promise<Record<string, string | string[] | undefined>>;

async function SponsorAdmin({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const selectedId = typeof sp.id === "string" ? sp.id : undefined;
  const tierFilter = typeof sp.tier === "string" ? sp.tier : undefined;

  const { sb } = await requireAdmin();
  const [{ data: sponsors }, { data: tiers }] = await Promise.all([
    sb.from("sponsors").select("*").order("sort_order").order("name"),
    sb.from("sponsor_tiers").select("*").order("sort_order"),
  ]);
  const tierList = (tiers ?? []) as SponsorTier[];
  const tierOrder = new Map(tierList.map((t, i) => [t.id, i]));
  const tierName = new Map(tierList.map((t) => [t.id, t.name]));
  const all = ((sponsors ?? []) as Sponsor[]).sort(
    (a, b) => (tierOrder.get(a.tier_id) ?? 99) - (tierOrder.get(b.tier_id) ?? 99) || a.sort_order - b.sort_order,
  );
  const list = tierFilter ? all.filter((s) => s.tier_id === tierFilter) : all;
  const selected = selectedId ? all.find((s) => s.id === selectedId) : undefined;
  const published = all.filter((s) => s.published).length;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      {/* ------------------------------------------------ scheda con tabella */}
      <section className="overflow-hidden rounded-3xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-xl font-black uppercase">Sponsor</h2>
            <p className="text-xs text-muted">
              {all.length} totali · {published} pubblicati · {all.length - published} bozze
            </p>
          </div>
          <Link href="/admin/sponsor" className="rounded-full bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark">
            + Nuovo sponsor
          </Link>
        </div>

        {/* filtro per tier */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-line px-5 py-3 text-xs font-semibold">
          <Link
            href="/admin/sponsor"
            className={`shrink-0 rounded-full px-3 py-1.5 ${!tierFilter ? "bg-ink text-white" : "bg-stone text-ink/70 hover:text-ink"}`}
          >
            Tutti ({all.length})
          </Link>
          {tierList.map((t) => (
            <Link
              key={t.id}
              href={`/admin/sponsor?tier=${t.id}`}
              className={`shrink-0 rounded-full px-3 py-1.5 ${tierFilter === t.id ? "bg-ink text-white" : "bg-stone text-ink/70 hover:text-ink"}`}
            >
              {t.name} ({all.filter((s) => s.tier_id === t.id).length})
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted">
            Nessuno sponsor{tierFilter ? " in questo tier" : ""}. Aggiungine uno dalla scheda a destra.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-stone/60 text-[11px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-2.5 font-bold">Logo</th>
                  <th className="px-3 py-2.5 font-bold">Nome</th>
                  <th className="px-3 py-2.5 font-bold">Tier</th>
                  <th className="px-3 py-2.5 font-bold">Sito</th>
                  <th className="px-3 py-2.5 text-center font-bold">Ordine</th>
                  <th className="px-3 py-2.5 font-bold">Stato</th>
                  <th className="px-5 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.map((s) => {
                  const active = s.id === selectedId;
                  return (
                    <tr key={s.id} className={active ? "bg-red-soft/60" : "hover:bg-stone/40"}>
                      <td className="px-5 py-3">
                        <span className="grid h-10 w-20 place-items-center rounded-lg border border-line bg-white">
                          {s.logo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={s.logo_url} alt="" className="max-h-8 max-w-16 object-contain" />
                          ) : (
                            <span className="text-[10px] font-semibold text-amber-700">manca logo</span>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-semibold">
                        <Link href={`/admin/sponsor?id=${s.id}`} className="hover:text-red">
                          {s.name}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-muted">{tierName.get(s.tier_id) ?? "—"}</td>
                      <td className="max-w-40 truncate px-3 py-3">
                        {s.website_url ? (
                          <a href={s.website_url} target="_blank" rel="noopener" className="text-blue hover:underline">
                            {s.website_url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                          </a>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center tabular-nums text-muted">{s.sort_order}</td>
                      <td className="px-3 py-3">
                        <form action={toggleSponsor}>
                          <input type="hidden" name="id" value={s.id} />
                          <input type="hidden" name="published" value={String(s.published)} />
                          <button
                            title={s.published ? "Clicca per nascondere" : "Clicca per pubblicare"}
                            className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
                              s.published ? "bg-blue-soft text-blue hover:bg-blue/15" : "bg-stone text-muted hover:bg-line"
                            }`}
                          >
                            {s.published ? "● Pubblicato" : "○ Bozza"}
                          </button>
                        </form>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/admin/sponsor?id=${s.id}`} className="font-semibold text-blue hover:underline">
                          Modifica
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ------------------------------------------------ sidebar */}
      <aside className="rounded-3xl border border-line bg-white p-5 lg:sticky lg:top-6">
        <h2 className="font-display mb-4 text-lg font-black uppercase">
          {selected ? `Modifica: ${selected.name}` : "Nuovo sponsor"}
        </h2>
        {tierList.length === 0 ? (
          <p className="text-sm text-muted">
            Crea prima almeno un{" "}
            <Link href="/admin/tier" className="text-blue underline">
              tier
            </Link>
            .
          </p>
        ) : (
          <SponsorForm sponsor={selected} tiers={tierList} />
        )}
      </aside>
    </div>
  );
}

export default function SponsorAdminPage({ searchParams }: PageProps<"/admin/sponsor">) {
  return (
    <>
      <PageTitle title="Sponsor" back={{ href: "/admin", label: "Dashboard" }} />
      <Suspense>
        <Flash searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <SponsorAdmin searchParams={searchParams} />
      </Suspense>
    </>
  );
}
