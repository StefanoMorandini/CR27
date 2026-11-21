-- Hardening segnalato dal Security Advisor di Supabase.

-- 1) is_admin() fuori dallo schema esposto dalle API (non più chiamabile via /rest/v1/rpc).
--    Le policy esistenti fanno riferimento alla funzione per OID e continuano a funzionare.
create schema if not exists private;
grant usage on schema private to anon, authenticated;
alter function public.is_admin() set schema private;

-- 2) Funzione dell'event trigger "ensure_rls" del progetto: non deve essere chiamabile dalle API.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- 3) site_settings: una sola policy permissiva per SELECT (performance advisor).
drop policy "admin write" on public.site_settings;
create policy "admin insert" on public.site_settings for insert to authenticated
  with check ((select private.is_admin()));
create policy "admin update" on public.site_settings for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin delete" on public.site_settings for delete to authenticated
  using ((select private.is_admin()));
