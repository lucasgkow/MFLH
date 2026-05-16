-- MFLH Collective — initial schema
-- Run via Supabase SQL editor or `supabase db push`.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  goal text,
  referral_source text,
  message text,
  status text default 'New',
  created_at timestamptz default now()
);

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text default 'Unread',
  created_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  category text not null,
  event_date date not null,
  event_time time,
  location text,
  max_capacity int,
  registration_open boolean default true,
  featured_image_url text,
  created_at timestamptz default now()
);

create table if not exists event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null,
  sizes text[] default '{}',
  image_url text,
  in_stock boolean default true,
  featured boolean default false,
  stripe_price_id text, -- TODO: populate when Stripe is wired
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text,
  customer_email text not null,
  items jsonb not null,
  total numeric(10,2),
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

create table if not exists site_settings (
  key text primary key,
  value text
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists events_date_idx on events (event_date);
create index if not exists event_registrations_event_idx
  on event_registrations (event_id);
create index if not exists products_featured_idx on products (featured);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Public site uses the anon key. Visitors may only:
--   * READ events, products, faqs, site_settings (public content)
--   * INSERT into registrations, contact_submissions, event_registrations
--     (form submissions — no read back)
-- Admin portal uses the service-role key server-side, which bypasses RLS
-- entirely, so no admin-specific policies are required.
-- ---------------------------------------------------------------------------

alter table registrations        enable row level security;
alter table contact_submissions  enable row level security;
alter table events               enable row level security;
alter table event_registrations  enable row level security;
alter table products             enable row level security;
alter table orders               enable row level security;
alter table faqs                 enable row level security;
alter table site_settings        enable row level security;

-- Public read of published content
create policy "public read events"
  on events for select using (true);

create policy "public read products"
  on products for select using (true);

create policy "public read faqs"
  on faqs for select using (true);

create policy "public read site_settings"
  on site_settings for select using (true);

-- Public insert of form submissions (insert only, never select)
create policy "public insert registrations"
  on registrations for insert with check (true);

create policy "public insert contact_submissions"
  on contact_submissions for insert with check (true);

create policy "public insert event_registrations"
  on event_registrations for insert with check (true);

-- registrations / contact_submissions / event_registrations / orders have
-- NO select / update / delete policy for anon — only the service role
-- (admin) can read or mutate them.
