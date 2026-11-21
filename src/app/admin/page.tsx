import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { Loading, PageTitle } from "./ui";

export const metadata = { title: "Dashboard" };

const sections = [
  { href: "/admin/sponsor", title: "Sponsor", text: "Aggiungi, modifica e pubblica gli sponsor con il loro logo." },
  { href: "/admin/tier", title: "Tier", text: "Livelli di sponsorizzazione e come vengono mostrati." },
  { href: "/admin/mappa", title: "Mappa", text: "Pedane, servizi e parcheggi sulla mappa interattiva dell'impianto." },
  { href: "/admin/link", title: "Link e risultati", text: "Risultati live, pagina incorporata, iscrizioni, contatti e link." },
];

async function Overview() {
  const { sb, user } = await requireAdmin();
  const [sponsors, tiers, points, links] = await Promise.all([
    sb.from("sponsors").select("id", { count: "exact", head: true }),
    sb.from("sponsor_tiers").select("id", { count: "exact", head: true }),
    sb.from("map_points").select("id", { count: "exact", head: true }),
    sb.from("result_links").select("id", { count: "exact", head: true }),
  ]);
  const counts = [sponsors.count ?? 0, tiers.count ?? 0, points.count ?? 0, links.count ?? 0];
  return (
    <>
      <p className="-mt-4 mb-6 text-sm text-muted">Collegato come {user.email}</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((s, i) => (
          <li key={s.href}>
            <Link href={s.href} className="block h-full rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-red hover:shadow-lg">
              <span className="font-display block text-4xl font-black text-red">{counts[i]}</span>
              <span className="font-display mt-1 block text-xl font-black uppercase">{s.title}</span>
              <span className="mt-1 block text-sm text-muted">{s.text}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted">
        Le modifiche sono visibili subito sul{" "}
        <a href="/it" target="_blank" className="font-semibold text-blue underline">
          sito pubblico ↗
        </a>
        .
      </p>
    </>
  );
}

export default function AdminHome() {
  return (
    <>
      <PageTitle title="Dashboard" />
      <Suspense fallback={<Loading />}>
        <Overview />
      </Suspense>
    </>
  );
}
