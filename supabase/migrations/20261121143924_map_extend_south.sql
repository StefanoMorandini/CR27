-- Mappa estesa verso sud (fino al parcheggio sud): altezza 1159 unità.
alter table public.map_points drop constraint map_points_y_check;
alter table public.map_points add constraint map_points_y_check check (y between 0 and 1159);

update public.map_points
set x = 768, y = 905, description = 'A sud dello stadio, oltre Via Luigi Lavizzari (dietro la buvette).'
where name = 'Parcheggio sud' and updated_at <= created_at + interval '1 second';
