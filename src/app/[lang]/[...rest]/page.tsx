import { notFound } from "next/navigation";

/** Qualsiasi percorso sconosciuto sotto /[lang] mostra la 404 localizzata. */
export default function CatchAll() {
  notFound();
}
