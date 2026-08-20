alter table public.bookings add column if not exists reference_code text;
update public.bookings set reference_code = 'NXS-LEGACY-' || upper(substr(replace(id::text, '-', ''), 1, 8)) where reference_code is null;
alter table public.bookings alter column reference_code set not null;
create unique index if not exists bookings_reference_code_idx on public.bookings(reference_code);
alter table public.bookings alter column whatsapp set not null;
alter table public.bookings drop constraint if exists bookings_check_out_check;
alter table public.bookings add constraint bookings_stay_length_check check (check_out > check_in and check_out <= check_in + 5);