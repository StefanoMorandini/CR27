-- Sponsor: contatti e accordi (solo admin), pacchetti sui tier, impostazioni private,
-- comitato con responsabilità.

-- 1) Contatti e dati dell'accordo: tabella separata, NON leggibile dal pubblico
create table public.sponsor_contacts (
  sponsor_id     uuid primary key references public.sponsors (id) on delete cascade,
  legal_name     text,              -- ragione sociale per la lettera (se diversa dal nome)
  contact_name   text,
  salutation     text,              -- es. "Gentile Signora", "Gentile Signore", "Spettabili"
  email          text,
  phone          text,
  street         text,
  postal_code    text,
  city           text,
  country        text not null default 'Svizzera',
  amount_chf     numeric(10, 2),
  agreement_date date,
  status         text not null default 'contatto'
                 check (status in ('contatto', 'proposta', 'confermato', 'fatturato', 'pagato', 'annullato')),
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
alter table public.sponsor_contacts enable row level security;
create trigger sponsor_contacts_updated_at before update on public.sponsor_contacts
  for each row execute function public.set_updated_at();
create policy "admin all" on public.sponsor_contacts for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- 2) Pacchetti: prezzo, prestazioni, numero massimo
alter table public.sponsor_tiers
  add column price_chf numeric(10, 2),
  add column price_public boolean not null default false,
  add column max_sponsors integer,
  add column benefits text[] not null default '{}';

-- Tier allineati ai pacchetti dell'edizione 2025 (prezzi da confermare per il 2027)
update public.sponsor_tiers set name = 'Sponsor Principale', price_chf = 2000, max_sponsors = 2, benefits = array[
  '4 striscioni e uno stand all''impianto',
  'Logo sul sito e sul videowall',
  'Spot pubblicitario di 30" sul videowall',
  'Possibilità di distribuire gadget, premi o flyer',
  'Logo sui pettorali, sul programma e sui materiali informativi'] where name = 'Main sponsor';
update public.sponsor_tiers set name = 'Sponsor Ufficiale', price_chf = 1000, benefits = array[
  '4 striscioni all''impianto',
  'Logo sul sito e sul videowall',
  'Spot pubblicitario di 15" sul videowall',
  'Possibilità di distribuire gadget, premi o flyer'] where name = 'Gold';
update public.sponsor_tiers set name = 'Sponsor Generale', price_chf = 500, benefits = array[
  '2 striscioni all''impianto',
  'Logo sul sito e sul videowall'] where name = 'Silver';
update public.sponsor_tiers set name = 'Sostenitore', price_chf = 300, benefits = array[
  '1 striscione all''impianto',
  'Logo sul sito'] where name = 'Sostenitori';

-- 3) Impostazioni private (mittente delle lettere, coordinate bancarie): solo admin
create table public.private_settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.private_settings enable row level security;
create trigger private_settings_updated_at before update on public.private_settings
  for each row execute function public.set_updated_at();
create policy "admin all" on public.private_settings for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- Valori iniziali (mittente, firmatario, contatti, IBAN) inseriti a parte e gestiti
-- da /admin/impostazioni: non vengono versionati perché contengono dati personali.
insert into public.private_settings (key, value) values
  ('sender_name', 'Federazione Ticinese di Atletica Leggera'),
  ('letter_place', 'Bellinzona'),
  ('payment_days', '30')
on conflict (key) do nothing;

-- 4) Comitato: responsabilità e appartenenza al comitato
alter table public.committee_members
  add column responsibilities text[] not null default '{}',
  add column is_committee boolean not null default false;
