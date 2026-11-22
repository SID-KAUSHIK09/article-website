# Article Publishing Website

![CI](https://github.com/SID-KAUSHIK09/article-website/actions/workflows/ci.yml/badge.svg)

Website for a Hindi writer to publish articles. Readers can browse articles by category, and the writer logs into an admin panel to add, edit and delete articles and categories. Built with React and Supabase (auth + Postgres), deployed on Vercel.

## Tech stack

- React 18, React Router, Vite, Tailwind CSS
- Supabase for auth and the Postgres database
- Vitest + React Testing Library for tests
- GitHub Actions for CI

## Security (RLS)

The frontend uses the Supabase anon key, so anyone could hit the API directly. Row Level Security policies in `supabase/migrations` handle access:

- everyone can read articles and categories
- only users in the `admins` table can create articles or change categories
- a user can only edit/delete articles where `author_id` is their own id

`author_id` defaults to `auth.uid()` so the app doesn't need to send it. The policies are tested in `supabase/tests/rls_test.sql`, which logs in as different users and checks what each one can and can't do. This runs in CI against a Postgres container.

## Running locally

```bash
npm install
cp .env.example .env.local   # add Supabase URL and anon key
npm run dev
```

Database setup:

1. Run `supabase/migrations/20261122000000_schema_and_rls.sql` in the Supabase SQL editor (or `supabase db push`).
2. Create the writer's user in Supabase Auth, then add them as admin:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'writer@example.com';
   ```
3. If there are old articles without an `author_id`, assign them to the writer (query at the bottom of the migration file).
4. Turn off public sign ups in Supabase Auth settings.

## Scripts

- `npm run dev` - dev server
- `npm test` - run tests
- `npm run coverage` - tests with coverage
- `npm run lint` - eslint
- `npm run build` - production build

## CI

`.github/workflows/ci.yml` runs on every push to main and every PR. One job runs lint, tests and the build. The other starts Postgres, applies the migration and runs the RLS tests.

## Deployment

Hosted on Vercel with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set as environment variables. `vercel.json` rewrites all routes to `index.html` so direct links to article pages work. Don't put the service_role key in the frontend.
