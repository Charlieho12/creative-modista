# Creative Modista

A full-stack women's fashion e-commerce website built with Next.js, TypeScript,
Tailwind CSS, and Supabase.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.local.example .env.local
```

3. Add Supabase credentials to `.env.local`.

4. Run the Supabase migration in `supabase/migrations/001_creative_modista_schema.sql`.

5. Run any later migrations, including
`supabase/migrations/002_sync_profile_email_confirmation.sql` and
`supabase/migrations/003_product_ai_review_notes.sql`.

6. In Supabase Auth URL Configuration, add this redirect URL for email
confirmation:

```text
http://localhost:3000/auth/callback
```

For production, also add your deployed URL:

```text
https://your-domain.com/auth/callback
```

7. Start the app:

```bash
npm run dev
```

## AI Product Notes

Set `OPENAI_API_KEY` in `.env.local` to generate product-specific AI style
notes from the admin products page. Existing products can be backfilled with
the "Generate AI notes" button, and newly added products generate notes after a
successful save.

## Admin Access

Admin routes use `profiles.role = 'admin'`. After creating an account, update the
matching profile row in Supabase:

```sql
update public.profiles
set role = 'admin'
where id = 'your-user-id';
```

## Verification

```bash
npm run lint
npm run build
```
