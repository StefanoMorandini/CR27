-- Mappa interattiva dell'impianto: punti (pedane, servizi, parcheggi...)
-- Coordinate nel sistema della mappa vettoriale: x 0–1000, y 0–570 (nord in alto).

create table public.map_points (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null default 'servizi' check (category in ('gare', 'atleti', 'servizi', 'parcheggi')),
  description text,
  x           numeric(6, 1) not null check (x between 0 and 1000),
  y           numeric(6, 1) not null check (y between 0 and 570),
  verified    boolean not null default false,   -- false = "posizione indicativa"
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.map_points enable row level security;
create trigger map_points_updated_at before update on public.map_points
  for each row execute function public.set_updated_at();
create policy "public read published" on public.map_points for select to anon, authenticated
  using (published or (select private.is_admin()));
create policy "admin insert" on public.map_points for insert to authenticated with check ((select private.is_admin()));
create policy "admin update" on public.map_points for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin delete" on public.map_points for delete to authenticated using ((select private.is_admin()));

-- Punti iniziali: dalla planimetria dell'ultima edizione (verificati) e
-- dalla foto aerea (posizione indicativa, da confermare con il comitato).
insert into public.map_points (name, category, description, x, y, verified, sort_order) values
  ('Partenza 100 m', 'gare', 'Partenza dei 100 m e degli ostacoli corti, sul rettilineo davanti alla tribuna.', 465, 133, false, 10),
  ('Arrivo', 'gare', 'Linea d''arrivo delle gare in pista, davanti alla tribuna.', 631, 283, false, 20),
  ('Salto in lungo e triplo', 'gare', 'Pedana e fossa di sabbia lungo la tribuna.', 593, 226, false, 30),
  ('Salto in alto', 'gare', 'Pedana nella zona nord-ovest del campo.', 392, 175, false, 40),
  ('Salto con l''asta', 'gare', 'Pedana nella zona sud-est del campo.', 548, 412, false, 50),
  ('Disco e martello', 'gare', 'Gabbia di lancio nella curva nord-ovest.', 350, 205, false, 60),
  ('Getto del peso', 'gare', 'Pedana fuori dallo stadio, sul campo a ovest vicino agli alberi.', 266, 300, true, 70),
  ('Crocette (conferma partecipazione)', 'atleti', 'Conferma della partecipazione alle gare, presso la tribuna.', 597, 175, true, 110),
  ('Ritiro pettorali', 'atleti', 'Ritiro dei pettorali, presso la tribuna.', 628, 212, true, 120),
  ('Campo di riscaldamento', 'atleti', 'Campo sintetico a est dello stadio, riservato al riscaldamento.', 775, 430, true, 130),
  ('Buvette', 'servizi', 'Bar e ristoro, a sud dello stadio.', 540, 488, true, 210),
  ('Partenza navetta', 'servizi', 'Fermata della navetta, sulla strada dietro la tribuna.', 618, 148, true, 220),
  ('Parcheggio ovest', 'parcheggi', null, 168, 272, true, 310),
  ('Parcheggio nord-ovest', 'parcheggi', null, 313, 118, true, 320),
  ('Parcheggio sud', 'parcheggi', 'Più a sud, oltre la buvette.', 600, 555, true, 330),
  ('Parcheggi chiusi', 'parcheggi', 'Non accessibili al pubblico.', 654, 92, true, 340);
