import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import type { Sponsor, SponsorContact, SponsorTier } from "@/lib/types";
import { Loading } from "../../../ui";
import { PrintButton } from "./PrintButton";
import { LetterSheet } from "./LetterSheet";

export const metadata = { title: "Conferma di sponsorizzazione" };


async function Letter({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const [{ data: sponsor }, { data: contact }, { data: settingsRows }] = await Promise.all([
    sb.from("sponsors").select("*").eq("id", id).maybeSingle(),
    sb.from("sponsor_contacts").select("*").eq("sponsor_id", id).maybeSingle(),
    sb.from("private_settings").select("key, value"),
  ]);
  if (!sponsor) notFound();
  const s = sponsor as Sponsor;
  const c = (contact ?? null) as SponsorContact | null;
  const { data: tierRow } = await sb.from("sponsor_tiers").select("*").eq("id", s.tier_id).maybeSingle();
  const tier = tierRow as SponsorTier | null;
  const set = Object.fromEntries((settingsRows ?? []).map((r) => [r.key, r.value as string]));

  const amount = c?.amount_chf != null ? Number(c.amount_chf) : tier?.price_chf != null ? Number(tier.price_chf) : null;
  const date = c?.agreement_date ? new Date(`${c.agreement_date}T12:00:00`) : new Date();
  const missing = [
    !c?.street && "indirizzo dello sponsor",
    amount == null && "importo",
    !set.iban && "IBAN (Impostazioni)",
    !set.contact_email && "email di contatto (Impostazioni)",
  ].filter(Boolean) as string[];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <Link href={`/admin/sponsor?id=${s.id}`} className="text-sm font-semibold text-blue hover:underline">
            ← {s.name}
          </Link>
          <h1 className="font-display mt-1 text-3xl font-black uppercase">Conferma di sponsorizzazione</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/impostazioni" className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold">
            Mittente e pagamento
          </Link>
          <PrintButton />
        </div>
      </div>
      {missing.length > 0 && (
        <p className="mb-4 rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-900 print:hidden">
          Dati mancanti nella lettera: {missing.join(", ")}.
        </p>
      )}

      <LetterSheet sponsor={s} contact={c} tier={tier} set={set} amount={amount} date={date} />
    </>
  );
}

export default function LetterPage({ params }: PageProps<"/admin/sponsor/[id]/lettera">) {
  return (
    <Suspense fallback={<Loading />}>
      <Letter params={params} />
    </Suspense>
  );
}
