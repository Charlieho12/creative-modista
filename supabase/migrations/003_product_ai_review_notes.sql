create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  reviewer_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  source text not null default 'customer' check (source in ('customer', 'ai_generated')),
  generated_by_model text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_reviews_product_id_idx on public.product_reviews(product_id);
create index if not exists product_reviews_source_idx on public.product_reviews(source);

create trigger product_reviews_updated_at before update on public.product_reviews
for each row execute function public.set_updated_at();

alter table public.product_reviews enable row level security;

create policy "product_reviews_public_read_published" on public.product_reviews
for select using (is_published = true);

create policy "product_reviews_admin_write" on public.product_reviews
for all using (public.is_admin())
with check (public.is_admin());
