import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getSettings } from "@/lib/data";
import { getDictionary } from "@/i18n/dictionaries";
import { legal } from "@/i18n/legal/it";

export const metadata: Metadata = { title: legal.title };

export default async function Page() {
  const [dict, settings] = await Promise.all([getDictionary(), getSettings()]);
  return <LegalPage doc={legal} email={settings.contact_email} updatedLabel={dict.footer.updated} />;
}
