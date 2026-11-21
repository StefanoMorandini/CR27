import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import type { ResultLink } from "@/lib/types";
import { deleteResultLink, saveResultLink, saveSettings } from "../actions";
import { ConfirmButton } from "../ConfirmButton";
import { Check, Field, Flash, Loading, PageTitle, Panel, Submit, inputCls } from "../ui";

export const metadata = { title: "Link e risultati" };

const settingFields = [
  { key: "results_live_url", label: "Risultati live", hint: "Pulsante rosso \"Risultati live\" nella pagina Risultati." },
  { key: "results_embed_url", label: "Pagina risultati da incorporare", hint: "Mostrata dentro la pagina Risultati (se il sito esterno lo consente)." },
  { key: "registration_url", label: "Iscrizioni", hint: "Pulsante \"Iscrizioni\" nella pagina Info pratiche." },
  { key: "contact_email", label: "Email di contatto", hint: "Mostrata nella pagina Comitato." },
] as const;

const kinds = [
  { value: "results", label: "Risultati" },
  { value: "live", label: "Live" },
  { value: "startlist", label: "Lista di partenza" },
  { value: "document", label: "Documento" },
];

function LinkFields({ link }: { link?: ResultLink }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Titolo *">
        <input name="label" required defaultValue={link?.label} placeholder="es. Risultati sabato" className={inputCls} />
      </Field>
      <Field label="URL *">
        <input name="url" required defaultValue={link?.url} placeholder="https://…" className={inputCls} />
      </Field>
      <Field label="Tipo">
        <select name="kind" defaultValue={link?.kind ?? "results"} className={inputCls}>
          {kinds.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Giorno">
          <select name="event_date" defaultValue={link?.event_date ?? ""} className={inputCls}>
            <option value="">Entrambi</option>
            <option value="2027-06-19">Sabato 19</option>
            <option value="2027-06-20">Domenica 20</option>
          </select>
        </Field>
        <Field label="Ordine">
          <input name="sort_order" type="number" defaultValue={link?.sort_order ?? 0} className={inputCls} />
        </Field>
      </div>
      <div className="flex flex-wrap gap-5 sm:col-span-2">
        <Check name="published" label="Pubblicato" defaultChecked={link ? link.published : true} />
      </div>
    </div>
  );
}

async function LinkAdmin() {
  const { sb } = await requireAdmin();
  const [{ data: settings }, { data: links }] = await Promise.all([
    sb.from("site_settings").select("key, value"),
    sb.from("result_links").select("*").order("sort_order"),
  ]);
  const value = (k: string) => {
    const v = settings?.find((s) => s.key === k)?.value;
    return typeof v === "string" ? v : "";
  };

  return (
    <div className="space-y-6">
      <Panel title="Link principali">
        <form action={saveSettings} className="space-y-4">
          {settingFields.map((f) => (
            <Field key={f.key} label={f.label} hint={f.hint}>
              <input
                name={f.key}
                type={f.key === "contact_email" ? "email" : "text"}
                defaultValue={value(f.key)}
                placeholder={f.key === "contact_email" ? "info@…" : "https://…"}
                className={inputCls}
              />
            </Field>
          ))}
          <Submit>Salva link principali</Submit>
        </form>
      </Panel>

      <Panel title="Link risultati, liste di partenza e documenti">
        <p className="-mt-2 mb-5 text-sm text-muted">Mostrati nella pagina Risultati, raggruppati per tipo.</p>
        <ul className="space-y-4">
          {((links ?? []) as ResultLink[]).map((l) => (
            <li key={l.id} className="rounded-2xl border border-line p-4">
              <form action={saveResultLink} className="space-y-3">
                <input type="hidden" name="id" value={l.id} />
                <LinkFields link={l} />
                <div className="flex justify-end">
                  <Submit variant="ghost">Salva</Submit>
                </div>
              </form>
              <form action={deleteResultLink} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={l.id} />
                <ConfirmButton message={`Eliminare "${l.label}"?`}>Elimina</ConfirmButton>
              </form>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-2xl bg-stone p-4">
          <h3 className="mb-3 font-semibold">Nuovo link</h3>
          <form action={saveResultLink} className="space-y-3">
            <LinkFields />
            <Submit>Aggiungi link</Submit>
          </form>
        </div>
      </Panel>
    </div>
  );
}

export default function LinkAdminPage({ searchParams }: PageProps<"/admin/link">) {
  return (
    <>
      <PageTitle title="Link e risultati" back={{ href: "/admin", label: "Dashboard" }} />
      <Suspense>
        <Flash searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <LinkAdmin />
      </Suspense>
    </>
  );
}
