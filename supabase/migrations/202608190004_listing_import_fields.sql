alter table public.properties add column if not exists source_listing_id text;
alter table public.properties add column if not exists source_url text;
alter table public.properties add column if not exists price_period text not null default 'per_night';
alter table public.properties add column if not exists size_m2 integer;
create unique index if not exists properties_source_listing_id_idx on public.properties(source_listing_id) where source_listing_id is not null;
create unique index if not exists property_images_storage_path_idx on public.property_images(storage_path);