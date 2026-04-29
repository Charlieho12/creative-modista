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

5. Start the app:

```bash
npm run dev
```

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
