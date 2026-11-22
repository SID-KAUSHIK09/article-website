-- Just enough of Supabase for the migrations to run on plain Postgres in CI:
-- the anon/authenticated roles and auth.uid(), which reads the user id the
-- way PostgREST passes it (request.jwt.claim.sub).
create role anon nologin;
create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key, email text);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth, public to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
