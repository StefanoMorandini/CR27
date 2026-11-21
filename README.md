# CR27 — Campionati Regionali di Atletica 2027 · Bellinzona

Sito ufficiale dei Campionati Regionali di Atletica, **19–20 giugno 2027**, Stadio Comunale di Bellinzona.

| Componente | Servizio | Ruolo |
| --- | --- | --- |
| Codice | GitHub `StefanoMorandini/CR27` | `main` = produzione |
| Hosting | Vercel progetto `cr-27` → https://cr-27.vercel.app | deploy automatico a ogni push (preview per i branch), funzioni a Francoforte (`fra1`) |
| Dati | Supabase progetto `CR27` (Zurigo) | programma, risultati, sponsor, pernottamento, comitato, F&B |

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
  proxy.ts               reindirizza ogni URL senza lingua → /it/...
  i18n/
    config.ts            lingue attive (oggi solo "it"), lingua predefinita
    dictionaries/it.ts   tutti i testi dell'interfaccia in italiano
    dictionaries/index.ts getDictionary() / getLocale() (lato server)
  app/
    globals.css          design tokens e animazioni
    icon.svg             favicon (marchio)
    [lang]/              tutte le pagine, con prefisso lingua
      layout.tsx         layout radice (html lang, font, header, footer)
      page.tsx           home: logo animato, countdown, corsie, giorni, Bellinzona
      programma/ risultati/ info/ food/ pernottamento/ sponsor/ comitato/
      not-found.tsx      404 localizzata
  components/
    map/                 VenueBase (mappa vettoriale dello stadio), InteractiveMap, markers
    brand/               LogoMark (SVG del logo, animato), Logo, Skyline (Bellinzona)
    layout/              Header, MobileMenu, MobileTabBar, Footer, LanguageSwitcher
    home/Countdown.tsx   countdown a "pettorali"
  app/admin/             area admin (layout separato, senza prefisso lingua)
  lib/
    admin/auth.ts        requireAdmin(): sessione + verifica tabella admins
    supabase/            client pubblico (cache), server (sessione), browser
    data.ts              accesso ai dati (cache + tag per l'invalidazione)
    event.ts             date e dati fissi dell'evento
supabase/migrations/     schema SQL versionato
```

## Area admin

`/admin` — accesso con email e password (Supabase Auth). Admin: `stefano@mfd.ch`.

- **Sponsor**: aggiungi / modifica / elimina, logo (PNG, JPG, WEBP, SVG — max 5 MB), pubblicato o bozza
- **Tier**: livelli sponsor con nome, ordine e visualizzazione (in evidenza, grande, medio, piccolo)
- **Mappa**: punti della mappa interattiva (`/it/mappa`): clic sulla mappa per posizionarli, categoria, descrizione, "posizione verificata" o indicativa
- **Link e risultati**: risultati live, pagina da incorporare, iscrizioni, email di contatto, link a risultati / liste di partenza / documenti
- **Password**: cambio password; "Password dimenticata" dalla pagina di accesso

Le modifiche sono visibili subito sul sito (invalidazione della cache con `updateTag`).

Sicurezza:
- registrazioni pubbliche disattivate in Supabase: gli account si creano solo dal pannello Supabase
- un utente è admin solo se presente nella tabella `admins`; le scritture passano dalle regole RLS
- `src/proxy.ts` protegge tutte le pagine `/admin` (tranne accesso e password)

Per aggiungere un altro admin: creare l'utente in Supabase → Authentication → Users, poi
`insert into public.admins (user_id, email) values ('<uuid>', '<email>');`

## Multilingua

Il sito è già strutturato per più lingue (URL `/it/...`, `/de/...`), ma oggi è attivo solo l'italiano.
Per aggiungere una lingua:

1. aggiungere il codice in `src/i18n/config.ts` (`locales`)
2. creare `src/i18n/dictionaries/<codice>.ts` con lo stesso tipo di `it.ts` (TypeScript segnala le traduzioni mancanti)
3. registrarlo in `src/i18n/dictionaries/index.ts`

Il selettore lingua nell'header compare automaticamente quando le lingue sono più di una.
I contenuti del database (programma, sponsor, ecc.) sono per ora solo in italiano.

## Brand

- Logo: `public/logo-cr27.jpg` (originale) e `src/components/brand/paths.ts` (vettoriale, tracciato dall'originale).
- Colori: rosso `#DF2123` (logo), blu Ticino `#0B4F9C` come accento, bianco.
- Font: Archivo (titoli larghi, come il logo) + Inter (testo).
- Animazioni: corsie che si disegnano, castelli che emergono, "corridori" sulle corsie, comparsa allo scroll.
  Tutte disattivate se l'utente ha impostato "riduci movimento".

## Dati e cache

Ogni funzione in `src/lib/data.ts` usa `"use cache"` con un `cacheTag`:
programma, risultati e comunicazioni si aggiornano entro ~1 minuto, il resto entro ~1 ora.
Le pagine sono prerenderizzate staticamente, quindi il sito resta veloce anche con tanto traffico nei giorni di gara.

## Database (Supabase)

Progetto Supabase **CR27** (`facfytnighffttxipubb`, regione Zurigo `eu-central-2`).

Lo schema è in `supabase/migrations/` (i nomi dei file corrispondono alle versioni
registrate in `supabase_migrations.schema_migrations`). Nuove modifiche: aggiungere un file
`AAAAMMGGhhmmss_nome.sql` e applicarlo (Supabase CLI `supabase db push`, oppure Management API).

Tabelle principali:

`schedule_items` · `result_links` · `announcements` · `sponsors` · `sponsor_tiers` · `accommodations` ·
`committee_members` · `map_points` · `fb_points` · `fb_menu_items` · `faqs` · `site_settings` · `admins`

Sicurezza (RLS): chiunque legge solo i record `published`; solo gli utenti presenti in `admins` possono scrivere.
I loghi sono nel bucket Storage pubblico `media` (scrittura solo admin).

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
