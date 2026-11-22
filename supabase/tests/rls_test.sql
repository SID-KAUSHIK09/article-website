-- Checks the row level security policies by acting as different users.
-- Run after supabase_stub.sql and the migrations; any failed check raises.
\set ON_ERROR_STOP 1
\pset tuples_only on

-- Supabase grants these by default; the policies decide what is allowed.
grant select, insert, update, delete on all tables in schema public to anon, authenticated;

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'writer-a@example.com'),
  ('00000000-0000-0000-0000-00000000000b', 'writer-b@example.com'),
  ('00000000-0000-0000-0000-00000000000c', 'reader@example.com');
insert into public.admins (user_id) values
  ('00000000-0000-0000-0000-00000000000a'),
  ('00000000-0000-0000-0000-00000000000b');

create function pg_temp.act_as(uid text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', coalesce(uid, ''), false);
  execute format('set role %I', case when uid is null then 'anon' else 'authenticated' end);
end $$;

create function pg_temp.expect_denied(stmt text, what text) returns void language plpgsql as $$
begin
  execute stmt;
  raise exception 'FAIL: % was allowed', what;
exception when insufficient_privilege then
  raise notice 'ok: % is denied', what;
end $$;

create function pg_temp.expect_rows(stmt text, expected int, what text) returns void language plpgsql as $$
declare n int;
begin
  execute stmt;
  get diagnostics n = row_count;
  if n <> expected then
    raise exception 'FAIL: % touched % rows, expected %', what, n, expected;
  end if;
  raise notice 'ok: %', what;
end $$;

-- Writer A creates a category and an article.
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
select pg_temp.expect_rows($$insert into categories (id, name) values ('poems', 'Poems')$$, 1,
  'an admin can add a category');
select pg_temp.expect_rows($$insert into articles (title, content, category) values ('A', 'text', 'poems')$$, 1,
  'an admin can publish an article');
do $$ begin
  if (select author_id from articles where title = 'A') <> '00000000-0000-0000-0000-00000000000a' then
    raise exception 'FAIL: author_id was not set from the signed-in user';
  end if;
  raise notice 'ok: author_id defaults to the signed-in user';
end $$;

-- Writer B, also an admin, cannot touch A's article.
select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');
select pg_temp.expect_rows($$update articles set title = 'changed' where title = 'A'$$, 0,
  'another writer cannot edit someone else''s article');
select pg_temp.expect_rows($$delete from articles where title = 'A'$$, 0,
  'another writer cannot delete someone else''s article');
select pg_temp.expect_denied(
  $$insert into articles (title, content, category, author_id)
    values ('fake', 'text', 'poems', '00000000-0000-0000-0000-00000000000a')$$,
  'publishing under another writer''s name');

-- Writer A can edit their own article but cannot hand it to someone else.
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
select pg_temp.expect_rows($$update articles set title = 'A edited' where title = 'A'$$, 1,
  'an author can edit their own article');
select pg_temp.expect_denied(
  $$update articles set author_id = '00000000-0000-0000-0000-00000000000b' where title = 'A edited'$$,
  'changing an article''s author');

-- A signed-in user who is not an admin can read but not write.
select pg_temp.act_as('00000000-0000-0000-0000-00000000000c');
select pg_temp.expect_denied($$insert into articles (title, content, category) values ('C', 'text', 'poems')$$,
  'a non-admin publishing');
select pg_temp.expect_denied($$insert into categories (id, name) values ('spam', 'Spam')$$,
  'a non-admin adding a category');
select pg_temp.expect_rows($$select * from admins$$, 0, 'the admins list is not readable');

-- Visitors who are not signed in can read everything public and change nothing.
select pg_temp.act_as(null);
select pg_temp.expect_rows($$select * from articles$$, 1, 'visitors can read articles');
select pg_temp.expect_rows($$select * from categories$$, 1, 'visitors can read categories');
select pg_temp.expect_rows($$update articles set title = 'x'$$, 0, 'visitors cannot edit articles');
select pg_temp.expect_rows($$delete from categories$$, 0, 'visitors cannot delete categories');

reset role;
\echo 'All RLS checks passed'
