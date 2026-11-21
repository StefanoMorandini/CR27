import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import type { Sponsor, SponsorTier } from "@/lib/types";
import { deleteSponsor } from "../../actions";
import { ConfirmButton } from "../../ConfirmButton";
import { Flash, Loading, PageTitle, Panel } from "../../ui";
import { SponsorForm } from "../SponsorForm";

export const metadata = { title: "Modifica sponsor" };

async function EditSponsor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const [{ data: sponsor }, { data: tiers }] = await Promise.all([
    sb.from("sponsors").select("*").eq("id", id).maybeSingle(),
    sb.from("sponsor_tiers").select("*").order("sort_order"),
  ]);
  if (!sponsor) notFound();
  const s = sponsor as Sponsor;
  return (
    <div className="space-y-6">
      <Panel title={s.name}>
        <SponsorForm sponsor={s} tiers={(tiers ?? []) as SponsorTier[]} />
      </Panel>
      <Panel>
        <form action={deleteSponsor} className="flex flex-wrap items-center justify-between gap-3">
          <input type="hidden" name="id" value={s.id} />
          <p className="text-sm text-muted">Elimina definitivamente questo sponsor.</p>
          <ConfirmButton message={`Eliminare "${s.name}"?`}>Elimina sponsor</ConfirmButton>
        </form>
      </Panel>
    </div>
  );
}

export default function EditSponsorPage({ params, searchParams }: PageProps<"/admin/sponsor/[id]">) {
  return (
    <>
      <PageTitle title="Modifica sponsor" back={{ href: "/admin/sponsor", label: "Sponsor" }} />
      <Suspense>
        <Flash searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <EditSponsor params={params} />
      </Suspense>
    </>
  );
}
