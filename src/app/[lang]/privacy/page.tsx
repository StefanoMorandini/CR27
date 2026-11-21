import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getSettings } from "@/lib/data";
import { getDictionary } from "@/i18n/dictionaries";
import { privacy } from "@/i18n/legal/it";

export const metadata: Metadata = { title: privacy.title };

export default async function Page() {
  const [dict, settings] = await Promise.all([getDictionary(), getSettings()]);
  return <LegalPage doc={privacy} email={settings.contact_email} updatedLabel={dict.footer.updated} />;
}
