@AGENTS.md

# Progetto CR27

Sito dei Campionati Regionali di Atletica 2027 (Bellinzona, 19–20 giugno 2027).
Organizzato da un comitato separato (NON è un progetto ASPO). Lingua del sito: italiano.

- Mobile-first: nei giorni di gara il pubblico usa soprattutto lo smartphone (tab bar in basso).
- Dati letti via `src/lib/data.ts` (Supabase, `"use cache"` + `cacheTag`). Non leggere Supabase direttamente nelle pagine.
- Ogni modifica allo schema = nuova migrazione in `supabase/migrations/`, con RLS.
- Non inventare informazioni pratiche (indirizzi, orari, prezzi): usare testi segnaposto.
- Prima di consegnare: `npm run lint && npm run build`.
