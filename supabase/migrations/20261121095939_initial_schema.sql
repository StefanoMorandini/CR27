-- Campionati Regionali di Atletica 2027 — Bellinzona
-- Schema iniziale: contenuti pubblici del sito + amministrazione.
--
-- Regola generale di sicurezza (RLS):
--   * lettura pubblica (anon) solo dei record pubblicati
--   * scrittura solo per utenti autenticati presenti nella tabella `admins`

-- ---------------------------------------------------------------------------
-- Amministratori
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

create policy "admins: read own row or admin" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Trigger generico updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Impostazioni del sito (chiave/valore): link iscrizioni, URL embed risultati...
-- ---------------------------------------------------------------------------
create table public.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Annunci / news (es. "Ritardo di 15' sul programma dei 100m")
-- ---------------------------------------------------------------------------
create table public.announcements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  body         text,
  level        text not null default 'info' check (level in ('info', 'important', 'urgent')),
  pinned       boolean not null default false,
  published    boolean not null default false,
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Orario gare
-- ---------------------------------------------------------------------------
create table public.schedule_items (
  id          uuid primary key default gen_random_uuid(),
  event_date  date not null check (event_date between '2027-06-19' and '2027-06-20'),
  start_time  time not null,
  discipline  text not null,                 -- es. "100 m", "Salto in lungo"
  category    text not null,                 -- es. "U16", "Attivi"
  gender      text not null check (gender in ('F', 'M', 'X')),
  round       text,                          -- es. "Batterie", "Finale"
  venue_area  text,                          -- es. "Pista", "Pedana lungo", "Gabbia"
  status      text not null default 'scheduled'
              check (status in ('scheduled', 'call_room', 'in_progress', 'finished', 'delayed', 'cancelled')),
  delay_min   integer not null default 0,
  results_url text,
  startlist_url text,
  notes       text,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index schedule_items_day_time_idx on public.schedule_items (event_date, start_time);

-- ---------------------------------------------------------------------------
-- Link ai risultati / liste di partenza / live (Swiss Athletics, ecc.)
-- ---------------------------------------------------------------------------
create table public.result_links (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  url         text not null,
  kind        text not null default 'results' check (kind in ('live', 'results', 'startlist', 'document')),
  event_date  date,
  embeddable  boolean not null default false,  -- se true, mostrato in iframe
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Sponsor e partner
-- ---------------------------------------------------------------------------
create table public.sponsors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  tier        text not null default 'supporter'
              check (tier in ('main', 'gold', 'silver', 'supporter', 'institutional', 'media')),
  logo_url    text,
  website_url text,
  description text,
  sort_order  integer not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Pernottamento
-- ---------------------------------------------------------------------------
create table public.accommodations (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  kind         text not null default 'hotel'
               check (kind in ('hotel', 'b&b', 'hostel', 'camping', 'apartment', 'other')),
  address      text,
  locality     text,
  distance_km  numeric(5, 1),
  price_range  text,                          -- es. "CHF 90–140"
  website_url  text,
  phone        text,
  email        text,
  booking_code text,                          -- codice convenzione
  notes        text,
  is_partner   boolean not null default false,
  sort_order   integer not null default 0,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Comitato d'organizzazione
-- ---------------------------------------------------------------------------
create table public.committee_members (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  role        text not null,                  -- es. "Presidente", "Responsabile F&B"
  area        text,                           -- es. "Direzione", "Logistica"
  email       text,
  photo_url   text,
  sort_order  integer not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Food & Beverage: punti di ristoro e menu
-- ---------------------------------------------------------------------------
create table public.fb_points (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,                 -- es. "Grill tribuna", "Bar centrale"
  location     text,
  opening_info text,                          -- es. "Sa 8:00–19:00 · Do 8:00–17:00"
  sort_order   integer not null default 0,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.fb_menu_items (
  id          uuid primary key default gen_random_uuid(),
  point_id    uuid references public.fb_points (id) on delete set null,
  name        text not null,
  category    text not null default 'food' check (category in ('food', 'drink', 'snack', 'dessert')),
  price_chf   numeric(6, 2),
  allergens   text[] not null default '{}',
  vegetarian  boolean not null default false,
  vegan       boolean not null default false,
  available   boolean not null default true,
  sort_order  integer not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index fb_menu_items_point_idx on public.fb_menu_items (point_id);

-- ---------------------------------------------------------------------------
-- FAQ / informazioni pratiche
-- ---------------------------------------------------------------------------
create table public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  topic       text not null default 'general',
  sort_order  integer not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS + trigger su tutte le tabelle di contenuto
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
  content_tables text[] := array[
    'announcements', 'schedule_items', 'result_links', 'sponsors',
    'accommodations', 'committee_members', 'fb_points', 'fb_menu_items', 'faqs'
  ];
begin
  foreach t in array content_tables loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      t || '_updated_at', t
    );
    execute format(
      'create policy "public read published" on public.%I for select to anon, authenticated using (published or (select public.is_admin()))',
      t
    );
    execute format(
      'create policy "admin insert" on public.%I for insert to authenticated with check ((select public.is_admin()))', t
    );
    execute format(
      'create policy "admin update" on public.%I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t
    );
    execute format(
      'create policy "admin delete" on public.%I for delete to authenticated using ((select public.is_admin()))', t
    );
  end loop;
end
$$;

-- site_settings: lettura pubblica, scrittura admin
alter table public.site_settings enable row level security;
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();
create policy "public read" on public.site_settings for select to anon, authenticated using (true);
create policy "admin write" on public.site_settings for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Valori iniziali
-- ---------------------------------------------------------------------------
insert into public.site_settings (key, value) values
  ('registration_url', '""'::jsonb),
  ('results_live_url', '""'::jsonb),
  ('results_embed_url', '""'::jsonb),
  ('contact_email', '""'::jsonb);
