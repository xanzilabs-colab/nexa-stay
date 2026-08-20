create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
create policy "admins manage site settings" on public.site_settings for all to authenticated using ((auth.jwt()->>'role')='admin') with check ((auth.jwt()->>'role')='admin');