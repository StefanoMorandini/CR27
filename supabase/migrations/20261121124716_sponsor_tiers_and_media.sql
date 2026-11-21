-- Tier sponsor gestibili dall'area admin + archivio file (loghi).

-- 1) Livelli sponsor in tabella
create table public.sponsor_tiers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  -- come viene mostrato il livello: featured = card grande in evidenza
  display    text not null default 'medium' check (display in ('featured', 'large', 'medium', 'small')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sponsor_tiers enable row level security;
create trigger sponsor_tiers_updated_at before update on public.sponsor_tiers
  for each row execute function public.set_updated_at();
create policy "public read" on public.sponsor_tiers for select to anon, authenticated using (true);
create policy "admin insert" on public.sponsor_tiers for insert to authenticated with check ((select private.is_admin()));
create policy "admin update" on public.sponsor_tiers for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin delete" on public.sponsor_tiers for delete to authenticated using ((select private.is_admin()));

insert into public.sponsor_tiers (name, display, sort_order) values
  ('Main sponsor', 'featured', 10),
  ('Gold', 'large', 20),
  ('Silver', 'medium', 30),
  ('Sostenitori', 'small', 40),
  ('Partner istituzionali', 'small', 50),
  ('Media partner', 'small', 60);

-- 2) Gli sponsor puntano al tier (gli sponsor di prova sono già stati rimossi)
delete from public.sponsors;
alter table public.sponsors drop column tier;
alter table public.sponsors add column tier_id uuid not null references public.sponsor_tiers (id) on delete restrict;
create index sponsors_tier_idx on public.sponsors (tier_id);

-- 3) Archivio pubblico per loghi e immagini (scrittura solo admin)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

create policy "media: admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select private.is_admin()));
create policy "media: admin update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
create policy "media: admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
