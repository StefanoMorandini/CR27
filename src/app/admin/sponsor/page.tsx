import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import type { Sponsor, SponsorTier } from "@/lib/types";
import { Flash, Loading, PageTitle, Panel } from "../ui";
import { SponsorForm } from "./SponsorForm";

export const metadata = { title: "Sponsor" };

async function SponsorAdmin() {
  const { sb } = await requireAdmin();
  const [{ data: sponsors }, { data: tiers }] = await Promise.all([
    sb.from("sponsors").select("*").order("sort_order").order("name"),
    sb.from("sponsor_tiers").select("*").order("sort_order"),
  ]);
  const list = (sponsors ?? []) as Sponsor[];
  const tierList = (tiers ?? []) as SponsorTier[];

  return (
    <div className="space-y-6">
      <Panel title={`Sponsor (${list.length})`}>
        {list.length === 0 ? (
          <p className="text-sm text-muted">Nessuno sponsor. Aggiungine uno qui sotto.</p>
        ) : (
          <div className="space-y-6">
            {tierList.map((t) => {
              const inTier = list.filter((s) => s.tier_id === t.id);
              if (inTier.length === 0) return null;
              return (
                <div key={t.id}>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">{t.name}</h3>
                  <ul className="divide-y divide-line rounded-2xl border border-line">
                    {inTier.map((s) => (
                      <li key={s.id}>
                        <Link href={`/admin/sponsor/${s.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-stone/60">
                          <span className="grid h-10 w-20 shrink-0 place-items-center rounded-lg bg-stone">
                            {s.logo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={s.logo_url} alt="" className="max-h-8 max-w-16 object-contain" />
                            ) : (
                              <span className="text-[10px] text-muted">nessun logo</span>
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold">{s.name}</span>
                            <span className="block truncate text-xs text-muted">{s.website_url ?? "—"}</span>
                          </span>
                          {!s.published && (
                            <span className="rounded-full bg-stone px-2.5 py-1 text-xs font-semibold text-muted">Bozza</span>
                          )}
                          <span className="text-sm font-semibold text-blue">Modifica →</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel title="Nuovo sponsor">
        {tierList.length === 0 ? (
          <p className="text-sm text-muted">
            Crea prima almeno un <Link href="/admin/tier" className="text-blue underline">tier</Link>.
          </p>
        ) : (
          <SponsorForm tiers={tierList} />
        )}
      </Panel>
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
        <SponsorAdmin />
      </Suspense>
    </>
  );
}
