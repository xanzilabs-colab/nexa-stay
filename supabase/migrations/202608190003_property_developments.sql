alter table public.properties add column if not exists development_name text;
alter table public.properties add column if not exists development_slug text;
create index if not exists properties_development_idx on public.properties(development_slug, status);