alter table public.profiles
add column if not exists email text,
add column if not exists email_confirmed_at timestamptz,
add column if not exists last_sign_in_at timestamptz;

create or replace function public.sync_user_profile_auth_fields()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email,
    email_confirmed_at,
    last_sign_in_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.email_confirmed_at,
    new.last_sign_in_at
  )
  on conflict (id) do update
  set
    email = excluded.email,
    email_confirmed_at = excluded.email_confirmed_at,
    last_sign_in_at = excluded.last_sign_in_at,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;

create trigger on_auth_user_updated
after update of email, email_confirmed_at, last_sign_in_at on auth.users
for each row execute function public.sync_user_profile_auth_fields();

update public.profiles
set
  email = users.email,
  email_confirmed_at = users.email_confirmed_at,
  last_sign_in_at = users.last_sign_in_at,
  updated_at = now()
from auth.users
where profiles.id = users.id;
