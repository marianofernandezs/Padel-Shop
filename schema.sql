-- Padel Shop - Supabase schema definition

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: products
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  stock integer not null default 0 check (stock >= 0),
  category text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: orders
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  total numeric(10, 2) not null,
  customer_name text not null,
  customer_email text not null,
  shipping_address text not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: order_items
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete restrict not null,
  quantity integer not null check (quantity > 0),
  price_at_time numeric(10, 2) not null
);

-- Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies
create policy "Public read access to products" on public.products for select using (true);
create policy "Public insert access to orders" on public.orders for insert with check (true);
create policy "Public insert access to order_items" on public.order_items for insert with check (true);

-- Insert Mock Data
insert into public.products (id, name, description, price, stock, category, image_url) values
  ('11111111-1111-1111-1111-111111111111', 'Pala Bullpadel Hack 03 2023', 'Pala de potencia concebida para jugadores profesionales o avanzados.', 295.50, 5, 'Palas', 'https://images.unsplash.com/photo-1622279457486-640c4343165d?auto=format&fit=crop&q=80&w=800'),
  ('22222222-2222-2222-2222-222222222222', 'Pelotas Head Padel Pro S (Bote x3)', 'Pelotas oficiales de alta velocidad y durabilidad.', 6.50, 12, 'Pelotas', 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800'),
  ('33333333-3333-3333-3333-333333333333', 'Paletero Adidas Multigame', 'Paletero de gran capacidad con compartimento térmico.', 65.00, 0, 'Bolsos', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'),
  ('44444444-4444-4444-4444-444444444444', 'Zapatillas ASICS Gel-Resolution 8', 'Zapatillas de máximo agarre, estabilidad y confort.', 135.00, 3, 'Calzado', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'),
  ('55555555-5555-5555-5555-555555555555', 'Overgrips Wilson Pro (Pack de 3)', 'El overgrip preferido por los profesionales.', 8.50, 20, 'Accesorios', 'https://images.unsplash.com/photo-1616056586616-e5b15dfc37f0?auto=format&fit=crop&q=80&w=800'),
  ('66666666-6666-6666-6666-666666666666', 'Pala Nox AT10 Genius 18K', 'Pala de Agustín Tapia. Control y potencia balanceados.', 275.00, 1, 'Palas', 'https://images.unsplash.com/photo-1622279457486-640c4343165d?auto=format&fit=crop&q=80&w=800');
