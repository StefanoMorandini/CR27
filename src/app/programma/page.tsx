import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { ScheduleView } from "@/components/ScheduleView";
import { getSchedule } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Programma e orari" };

export default async function ProgrammaPage() {
  const items = await getSchedule();
  return (
    <>
      <PageHeader
        eyebrow="19–20 giugno 2027"
        title="Programma"
        intro="Orario provvisorio delle gare. Nei giorni di gara gli orari vengono aggiornati in tempo reale."
      />
      <div className="mx-auto max-w-3xl px-4">
        {items.length === 0 ? (
          <div className="py-10">
            <EmptyState>Il programma orario è in preparazione e sarà pubblicato qui.</EmptyState>
          </div>
        ) : (
          <ScheduleView items={items} days={site.days} />
        )}
      </div>
    </>
  );
}
