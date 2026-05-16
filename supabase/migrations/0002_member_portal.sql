-- MFLH Collective — member portal (Phase 1)
-- Members authenticate with their own session and operate under RLS.
-- Admin continues to use the service-role key (bypasses RLS).

-- ---------------------------------------------------------------------------
-- profiles — one row per auth user, created automatically on signup
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'admin')),
  full_name text,
  display_name text,
  avatar_url text,
  bio text,
  phone text,
  membership_status text default 'active',
  created_at timestamptz default now()
);

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- classes (native scheduling — decoupled from PushPress)
-- ---------------------------------------------------------------------------
create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  class_type text,
  description text,
  coach_name text,
  starts_at timestamptz not null,
  duration_min int default 60,
  capacity int default 20,
  location text default 'MFLH Collective',
  created_at timestamptz default now()
);

create table if not exists class_registrations (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  member_id uuid references profiles(id) on delete cascade,
  status text not null default 'registered'
    check (status in ('registered', 'waitlisted', 'cancelled', 'attended')),
  created_at timestamptz default now(),
  unique (class_id, member_id)
);

-- ---------------------------------------------------------------------------
-- check-ins
-- ---------------------------------------------------------------------------
create table if not exists member_checkins (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references profiles(id) on delete cascade,
  class_id uuid references classes(id) on delete set null,
  source text default 'qr',
  checked_in_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- coach-posted routines / WODs
-- ---------------------------------------------------------------------------
create table if not exists routines (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  routine_date date not null default current_date,
  class_type text,
  published boolean default true,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- workout logging
-- ---------------------------------------------------------------------------
create table if not exists workout_logs (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references profiles(id) on delete cascade,
  log_date date not null default current_date,
  title text not null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists workout_entries (
  id uuid primary key default gen_random_uuid(),
  log_id uuid references workout_logs(id) on delete cascade,
  exercise text not null,
  reps int,
  weight_kg numeric(6,2),
  distance_m numeric(8,2),
  duration_sec int,
  position int default 0
);

-- ---------------------------------------------------------------------------
-- Hyrox benchmarks
-- ---------------------------------------------------------------------------
create table if not exists hyrox_benchmarks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  metric text not null default 'time' check (metric in ('time', 'reps', 'weight')),
  display_order int default 0
);

create table if not exists benchmark_results (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references profiles(id) on delete cascade,
  benchmark_id uuid references hyrox_benchmarks(id) on delete cascade,
  value numeric(10,2) not null,
  recorded_on date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- social feed
-- ---------------------------------------------------------------------------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade,
  body text not null,
  image_url text,
  pinned boolean default false,
  created_at timestamptz default now()
);

create table if not exists post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  member_id uuid references profiles(id) on delete cascade,
  emoji text not null default '❤️',
  created_at timestamptz default now(),
  unique (post_id, member_id, emoji)
);

create table if not exists post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists classes_starts_idx on classes (starts_at);
create index if not exists class_regs_class_idx on class_registrations (class_id);
create index if not exists class_regs_member_idx on class_registrations (member_id);
create index if not exists checkins_member_idx on member_checkins (member_id);
create index if not exists routines_date_idx on routines (routine_date desc);
create index if not exists workout_logs_member_idx on workout_logs (member_id);
create index if not exists bench_results_member_idx on benchmark_results (member_id);
create index if not exists posts_created_idx on posts (created_at desc);
create index if not exists comments_post_idx on post_comments (post_id);

-- ---------------------------------------------------------------------------
-- helper: is the current auth user an admin?
-- ---------------------------------------------------------------------------
create or replace function is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table profiles            enable row level security;
alter table classes             enable row level security;
alter table class_registrations enable row level security;
alter table member_checkins     enable row level security;
alter table routines            enable row level security;
alter table workout_logs        enable row level security;
alter table workout_entries     enable row level security;
alter table hyrox_benchmarks    enable row level security;
alter table benchmark_results   enable row level security;
alter table posts               enable row level security;
alter table post_reactions      enable row level security;
alter table post_comments       enable row level security;

-- profiles: any authenticated user can read (needed for social author names);
-- a user may update only their own row; admins may update anyone.
create policy "profiles read (auth)" on profiles
  for select to authenticated using (true);
create policy "profiles update own" on profiles
  for update to authenticated using (id = auth.uid());
create policy "profiles admin update" on profiles
  for update to authenticated using (is_admin());
create policy "profiles self insert" on profiles
  for insert to authenticated with check (id = auth.uid());

-- classes / routines / benchmarks: read for authenticated, write for admins
create policy "classes read" on classes
  for select to authenticated using (true);
create policy "classes admin write" on classes
  for all to authenticated using (is_admin()) with check (is_admin());

create policy "routines read" on routines
  for select to authenticated using (published or is_admin());
create policy "routines admin write" on routines
  for all to authenticated using (is_admin()) with check (is_admin());

create policy "benchmarks read" on hyrox_benchmarks
  for select to authenticated using (true);
create policy "benchmarks admin write" on hyrox_benchmarks
  for all to authenticated using (is_admin()) with check (is_admin());

-- class registrations: everyone (auth) can see the roster; members manage own
create policy "regs read" on class_registrations
  for select to authenticated using (true);
create policy "regs insert own" on class_registrations
  for insert to authenticated with check (member_id = auth.uid());
create policy "regs update own" on class_registrations
  for update to authenticated using (member_id = auth.uid() or is_admin());
create policy "regs delete own" on class_registrations
  for delete to authenticated using (member_id = auth.uid() or is_admin());

-- check-ins: members see own; admins see all; members create own
create policy "checkins read own" on member_checkins
  for select to authenticated using (member_id = auth.uid() or is_admin());
create policy "checkins insert own" on member_checkins
  for insert to authenticated with check (member_id = auth.uid() or is_admin());

-- workout logs/entries: fully private to the owning member
create policy "logs own" on workout_logs
  for all to authenticated using (member_id = auth.uid())
  with check (member_id = auth.uid());
create policy "entries own" on workout_entries
  for all to authenticated
  using (exists (select 1 from workout_logs l
                 where l.id = log_id and l.member_id = auth.uid()))
  with check (exists (select 1 from workout_logs l
                      where l.id = log_id and l.member_id = auth.uid()));

-- benchmark results: private to owner
create policy "bench results own" on benchmark_results
  for all to authenticated using (member_id = auth.uid())
  with check (member_id = auth.uid());

-- social: read for all auth; authors manage own; admins moderate
create policy "posts read" on posts
  for select to authenticated using (true);
create policy "posts insert own" on posts
  for insert to authenticated with check (author_id = auth.uid());
create policy "posts update own" on posts
  for update to authenticated using (author_id = auth.uid() or is_admin());
create policy "posts delete own" on posts
  for delete to authenticated using (author_id = auth.uid() or is_admin());

create policy "reactions read" on post_reactions
  for select to authenticated using (true);
create policy "reactions insert own" on post_reactions
  for insert to authenticated with check (member_id = auth.uid());
create policy "reactions delete own" on post_reactions
  for delete to authenticated using (member_id = auth.uid());

create policy "comments read" on post_comments
  for select to authenticated using (true);
create policy "comments insert own" on post_comments
  for insert to authenticated with check (author_id = auth.uid());
create policy "comments update own" on post_comments
  for update to authenticated using (author_id = auth.uid());
create policy "comments delete own" on post_comments
  for delete to authenticated using (author_id = auth.uid() or is_admin());
