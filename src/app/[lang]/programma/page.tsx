import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { ScheduleView } from "@/components/ScheduleView";
import { getSchedule } from "@/lib/data";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).pages.programma.title };
}

export default async function ProgrammaPage() {
  const [dict, items] = await Promise.all([getDictionary(), getSchedule()]);
  const t = dict.pages.programma;
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
      <div className="mx-auto max-w-3xl px-4">
        {items.length === 0 ? (
          <div className="py-10">
            <EmptyState>{t.empty}</EmptyState>
          </div>
        ) : (
          <ScheduleView items={items} labels={dict.schedule} />
        )}
      </div>
    </>
  );
}
