-- Keep Supabase Auth signup from failing when a stale profile row already
-- exists with the same email address.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (
    id,
    name,
    business_name,
    email,
    phone
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    new.raw_user_meta_data->>'business_name',
    new.email,
    new.phone
  )
  on conflict (email) do update set
    name = excluded.name,
    business_name = excluded.business_name,
    phone = excluded.phone;

  return new;
end;
$$;
