import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
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
        <ScheduleView items={items} days={site.days} />
      </div>
    </>
  );
}
