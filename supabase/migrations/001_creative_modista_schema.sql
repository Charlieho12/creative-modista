create extension if not exists "pgcrypto";

create type public.profile_role as enum ('customer', 'admin');
create type public.order_status as enum (
  'placed',
  'confirmed',
  'preparing',
  'ready_to_ship',
  'shipped',
  'delivered',
  'cancelled'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  email_confirmed_at timestamptz,
  last_sign_in_at timestamptz,
  contact_number text,
  shipping_address text,
  role public.profile_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  sale_price numeric(10, 2) check (sale_price is null or sale_price >= 0),
  category text not null,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  is_best_seller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  color text not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_id, size, color)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  contact_number text not null,
  shipping_address text not null,
  payment_method text not null,
  status public.order_status not null default 'placed',
  subtotal numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  size text not null,
  color text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null,
  line_total numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

create index products_category_idx on public.products(category);
create index products_slug_idx on public.products(slug);
create index product_images_product_id_idx on public.product_images(product_id);
create index orders_user_id_idx on public.orders(user_id);
create index order_items_order_id_idx on public.order_items(order_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

create trigger carts_updated_at before update on public.carts
for each row execute function public.set_updated_at();

create trigger cart_items_updated_at before update on public.cart_items
for each row execute function public.set_updated_at();

create trigger orders_updated_at before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
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
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
for select using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin" on public.profiles
for update using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "products_public_read" on public.products
for select using (true);

create policy "products_admin_write" on public.products
for all using (public.is_admin())
with check (public.is_admin());

create policy "product_images_public_read" on public.product_images
for select using (true);

create policy "product_images_admin_write" on public.product_images
for all using (public.is_admin())
with check (public.is_admin());

create policy "carts_own" on public.carts
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "cart_items_own_cart" on public.cart_items
for all using (
  exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
)
with check (
  exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
);

create policy "orders_own_or_admin_select" on public.orders
for select using (user_id = auth.uid() or public.is_admin());

create policy "orders_customer_insert" on public.orders
for insert with check (user_id = auth.uid());

create policy "orders_admin_update" on public.orders
for update using (public.is_admin())
with check (public.is_admin());

create policy "order_items_own_or_admin_select" on public.order_items
for select using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and (orders.user_id = auth.uid() or public.is_admin())
  )
);

create policy "order_items_customer_insert" on public.order_items
for insert with check (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

create policy "order_items_admin_write" on public.order_items
for update using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_bucket_public_read" on storage.objects
for select using (bucket_id = 'product-images');

create policy "product_images_bucket_admin_write" on storage.objects
for all using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());
