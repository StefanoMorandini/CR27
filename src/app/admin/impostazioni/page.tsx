import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { savePrivateSettings } from "../actions";
import { Field, Flash, Loading, PageTitle, Panel, Submit, inputCls } from "../ui";

export const metadata = { title: "Impostazioni" };

const fields: { key: string; label: string; hint?: string; multiline?: boolean }[] = [
  { key: "sender_name", label: "Mittente", hint: "Intestazione della lettera." },
  { key: "sender_address", label: "Indirizzo del mittente", multiline: true },
  { key: "letter_place", label: "Luogo della lettera", hint: "Es. Bellinzona" },
  { key: "signer_name", label: "Firmatario" },
  { key: "signer_role", label: "Funzione del firmatario" },
  { key: "contact_name", label: "Persona di contatto per gli sponsor" },
  { key: "contact_email", label: "Email di contatto" },
  { key: "contact_phone", label: "Telefono di contatto" },
  { key: "iban", label: "IBAN", hint: "Se vuoto, la lettera indica che le coordinate seguiranno con la fattura." },
  { key: "account_holder", label: "Titolare del conto", multiline: true },
  { key: "payment_days", label: "Termine di pagamento (giorni)" },
];

async function Settings() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("private_settings").select("key, value");
  const v = Object.fromEntries((data ?? []).map((r) => [r.key, r.value as string]));
  return (
    <Panel title="Lettere agli sponsor">
      <p className="-mt-2 mb-5 text-sm text-muted">
        Dati usati nella conferma di sponsorizzazione. Visibili solo agli admin. I valori iniziali vengono dalla lettera del 2025: verificali per il 2027.
      </p>
      <form action={savePrivateSettings} className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className={f.multiline ? "sm:row-span-2" : ""}>
            <Field label={f.label} hint={f.hint}>
              {f.multiline ? (
                <textarea name={f.key} rows={4} defaultValue={v[f.key] ?? ""} className={inputCls} />
              ) : (
                <input name={f.key} defaultValue={v[f.key] ?? ""} className={inputCls} />
              )}
            </Field>
          </div>
        ))}
        <div className="sm:col-span-2">
          <Submit>Salva impostazioni</Submit>
        </div>
      </form>
    </Panel>
  );
}

export default function SettingsPage({ searchParams }: PageProps<"/admin/impostazioni">) {
  return (
    <>
      <PageTitle title="Impostazioni" back={{ href: "/admin", label: "Dashboard" }} />
      <Suspense>
        <Flash searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <Settings />
      </Suspense>
    </>
  );
}
