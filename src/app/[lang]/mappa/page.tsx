import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { getMapPoints } from "@/lib/data";
import { getDictionary } from "@/i18n/dictionaries";
import { event } from "@/lib/event";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).pages.mappa.title };
}

export default async function MappaPage() {
  const [dict, points] = await Promise.all([getDictionary(), getMapPoints()]);
  const t = dict.pages.mappa;
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
      <div className="mx-auto max-w-7xl px-4 py-8">
        {points.length === 0 ? (
          <EmptyState>{t.empty}</EmptyState>
        ) : (
          <InteractiveMap points={points} labels={t} />
        )}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <p>{t.note}</p>
          <a href={event.mapsUrl} target="_blank" rel="noopener" className="font-semibold text-blue hover:underline">
            {t.openMaps} ↗
          </a>
        </div>
      </div>
    </>
  );
}
