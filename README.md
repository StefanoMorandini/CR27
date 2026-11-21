# CR27 — Campionati Regionali di Atletica 2027 · Bellinzona

Sito ufficiale dei Campionati Regionali di Atletica, **19–20 giugno 2027**, Stadio Comunale di Bellinzona.

| Componente | Servizio | Ruolo |
| --- | --- | --- |
| Codice | GitHub `StefanoMorandini/CR27` | `main` = produzione |
| Hosting | Vercel | deploy automatico a ogni push (preview per i branch) |
| Dati | Supabase (progetto dedicato) | programma, risultati, sponsor, pernottamento, comitato, F&B |

## Stack

- **Next.js 16** (App Router, Cache Components) + **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (`@supabase/supabase-js`) — lettura pubblica con RLS

## Avvio in locale

```bash
npm install
cp .env.example .env.local   # inserire URL e publishable key di Supabase
npm run dev
```

Senza `.env.local` il sito funziona comunque con un programma di esempio (`src/lib/fallback.ts`).

## Struttura

```
src/
  app/                 pagine (una cartella = una rotta)
    page.tsx           home: countdown, comunicazioni, accesso rapido, sponsor
    programma/         orari per giorno, filtri categoria/disciplina, stato live
    risultati/         link live + embed iframe (Swiss Athletics / timing)
    info/              stadio, trasporti, parcheggi, FAQ
    food/              punti di ristoro e menu F&B
    pernottamento/     alloggi e convenzioni
    sponsor/           sponsor per livello
    comitato/          comitato e contatti
    menu/              menu completo su mobile
  components/          Header, MobileTabBar (mobile), Footer, ScheduleView…
  lib/
    data.ts            accesso ai dati (cache + tag per l'invalidazione)
    site.ts            dati fissi dell'evento e navigazione
    types.ts           tipi delle tabelle
supabase/migrations/   schema SQL versionato
```

## Dati e cache

Ogni funzione in `src/lib/data.ts` usa `"use cache"` con un `cacheTag`:
programma, risultati e comunicazioni si aggiornano entro ~1 minuto, il resto entro ~1 ora.
Le pagine sono prerenderizzate staticamente, quindi il sito resta veloce anche con tanto traffico nei giorni di gara.

## Database (Supabase)

Lo schema è in `supabase/migrations/`. Tabelle principali:

`schedule_items` · `result_links` · `announcements` · `sponsors` · `accommodations` ·
`committee_members` · `fb_points` · `fb_menu_items` · `faqs` · `site_settings` · `admins`

Sicurezza (RLS): chiunque legge solo i record `published`; solo gli utenti presenti in `admins` possono scrivere.

Impostazioni in `site_settings` (chiave → valore JSON):

| key | uso |
| --- | --- |
| `results_live_url` | pulsante "Risultati live" |
| `results_embed_url` | pagina incorporata in iframe in /risultati |
| `registration_url` | pulsante "Iscrizioni" |
| `contact_email` | contatto del comitato |

## Roadmap

1. ✅ Setup GitHub · Vercel · Supabase, struttura e primo design
2. Logo ufficiale e identità visiva definitiva
3. Area admin (login Supabase) per gestire programma, risultati, comunicazioni, sponsor, ecc.
4. Contenuti definitivi (info stadio, trasporti, comitato)
5. Eventuale traduzione DE/FR
