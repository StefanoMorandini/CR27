import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { Loading, PageTitle } from "./ui";

export const metadata = { title: "Dashboard" };

const sections = [
  { href: "/admin/sponsor", title: "Sponsor", text: "Aggiungi, modifica e pubblica gli sponsor con il loro logo." },
  { href: "/admin/tier", title: "Tier", text: "Livelli di sponsorizzazione e come vengono mostrati." },
  { href: "/admin/comitato", title: "Comitato", text: "Persone, ruoli, responsabilità e foto del comitato e dei collaboratori." },
  { href: "/admin/mappa", title: "Mappa", text: "Pedane, servizi e parcheggi sulla mappa interattiva dell'impianto." },
  { href: "/admin/link", title: "Link e risultati", text: "Risultati live, pagina incorporata, iscrizioni, contatti e link." },
];

async function Overview() {
  const { sb, user } = await requireAdmin();
  const [sponsors, tiers, members, points, links] = await Promise.all([
    sb.from("sponsors").select("id", { count: "exact", head: true }),
    sb.from("sponsor_tiers").select("id", { count: "exact", head: true }),
    sb.from("committee_members").select("id", { count: "exact", head: true }),
    sb.from("map_points").select("id", { count: "exact", head: true }),
    sb.from("result_links").select("id", { count: "exact", head: true }),
  ]);
  const counts = [sponsors.count ?? 0, tiers.count ?? 0, members.count ?? 0, points.count ?? 0, links.count ?? 0];
  return (
    <>
      <p className="-mt-4 mb-6 text-sm text-muted">Collegato come {user.email}</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/statistiche" className="rounded-3xl border border-line bg-white p-5 transition hover:border-red">
          <span className="font-display block text-lg font-black uppercase">Statistiche 2025</span>
          <span className="text-sm text-muted">Iscrizioni per disciplina, categoria e cantone; requisiti Swiss Athletics per il sito.</span>
        </Link>
        <Link href="/admin/impostazioni" className="rounded-3xl border border-line bg-white p-5 transition hover:border-red">
          <span className="font-display block text-lg font-black uppercase">Impostazioni</span>
          <span className="text-sm text-muted">Mittente, firmatario e coordinate di pagamento per le lettere agli sponsor.</span>
        </Link>
      </div>
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
