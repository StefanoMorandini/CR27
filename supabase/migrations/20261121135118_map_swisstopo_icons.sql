-- Mappa ridisegnata su base swisstopo: nuovo sistema di coordinate (1354 × 920)
-- e simbolo (pittogramma) per ogni punto.

alter table public.map_points add column icon text not null default 'punto';

alter table public.map_points drop constraint map_points_x_check;
alter table public.map_points drop constraint map_points_y_check;
alter table public.map_points add constraint map_points_x_check check (x between 0 and 1354);
alter table public.map_points add constraint map_points_y_check check (y between 0 and 920);

-- Posizioni rilevate su SWISSIMAGE / planimetria (nessun punto era stato modificato dall'admin)
update public.map_points as p set x = v.x, y = v.y, icon = v.icon, verified = v.verified, description = coalesce(v.descr, p.description)
from (values
  ('Partenza 100 m', 640, 338, 'partenza', false, 'Partenza dei 100 m e degli ostacoli corti, nel prolungamento del rettilineo davanti alla tribuna.'),
  ('Arrivo', 817, 503, 'arrivo', false, 'Linea d''arrivo delle gare in pista, alla fine del rettilineo della tribuna.'),
  ('Salto in lungo e triplo', 814, 452, 'lungo', true, 'Pedana lungo la tribuna, con una fossa di sabbia a ciascuna estremità.'),
  ('Salto in alto', 598, 392, 'alto', false, 'Pedana nella curva nord-ovest, all''interno della pista.'),
  ('Salto con l''asta', 765, 655, 'asta', false, 'Pedana nella curva sud-est, all''interno della pista.'),
  ('Disco e martello', 550, 415, 'disco', false, 'Gabbia di lancio nella curva nord-ovest. Da confermare se utilizzata: il prato interno è chiuso.'),
  ('Getto del peso', 478, 566, 'peso', true, null),
  ('Crocette (conferma partecipazione)', 796, 360, 'crocette', true, null),
  ('Ritiro pettorali', 846, 430, 'pettorali', true, null),
  ('Campo di riscaldamento', 1026, 700, 'riscaldamento', true, null),
  ('Buvette', 736, 748, 'buvette', true, null),
  ('Partenza navetta', 778, 296, 'navetta', true, null),
  ('Parcheggio ovest', 356, 494, 'parcheggio', true, null),
  ('Parcheggio nord-ovest', 510, 326, 'parcheggio', true, null),
  ('Parcheggio sud', 720, 895, 'parcheggio', true, 'Più a sud, lungo Via Luigi Lavizzari.'),
  ('Parcheggi chiusi', 895, 295, 'parcheggio', true, 'Non accessibili al pubblico.')
) as v(name, x, y, icon, verified, descr)
where p.name = v.name;
