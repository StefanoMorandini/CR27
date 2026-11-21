import { PageHeader } from "@/components/PageHeader";
import type { LegalDoc } from "@/i18n/legal/it";

/** Pagina legale: sostituisce `{email}` con l'indirizzo di contatto (link mailto). */
export function LegalPage({ doc, email, updatedLabel }: { doc: LegalDoc; email: string; updatedLabel: string }) {
  const render = (text: string) => {
    const parts = text.split("{email}");
    return parts.map((p, i) => (
      <span key={i}>
        {p}
        {i < parts.length - 1 &&
          (email ? (
            <a href={`mailto:${email}`} className="font-semibold text-blue underline underline-offset-4">
              {email}
            </a>
          ) : (
            <span>l&apos;indirizzo indicato nella pagina Contatti</span>
          ))}
      </span>
    ));
  };
  return (
    <>
      <PageHeader eyebrow={doc.eyebrow} title={doc.title} intro={doc.intro} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-9">
          {doc.sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-xl font-black uppercase">{s.title}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-ink/80">
                  {render(p)}
                </p>
              ))}
              {s.list && (
                <ul className="mt-3 list-disc space-y-1.5 pl-6 leading-relaxed text-ink/80">
                  {s.list.map((l) => (
                    <li key={l}>{render(l)}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        <p className="mt-12 border-t border-line pt-4 text-sm text-muted">
          {updatedLabel}: {doc.updated}
        </p>
      </div>
    </>
  );
}
