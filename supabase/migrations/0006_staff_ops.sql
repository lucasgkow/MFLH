-- MFLH Collective — staff operations: roster + time clock
-- Service-role only (admin portal). No anon RLS policies are created, so the
-- public anon key can never read staff PINs or time entries.

create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null default 'coach',
  pin text,                       -- 4-6 digit clock-in PIN, set by an admin
  hourly_rate numeric(10,2),      -- optional, used to value hours in the report
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists time_entries (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references staff(id) on delete cascade,
  clock_in timestamptz not null default now(),
  clock_out timestamptz,
  note text,
  created_at timestamptz default now()
);

create index if not exists time_entries_staff_idx on time_entries (staff_id);
-- At most one open shift per staff member.
create unique index if not exists time_entries_one_open_idx
  on time_entries (staff_id) where clock_out is null;

alter table staff        enable row level security;
alter table time_entries enable row level security;
-- Intentionally no anon policies: these tables are reachable only via the
-- service role used server-side by the admin portal.

-- Seed the roster only when the table is empty (idempotent on re-run).
insert into staff (full_name, role)
select v.full_name, v.role
from (values
  ('Christian Harris', 'owner/coach'),
  ('Anthony Baranta',  'owner/coach'),
  ('Santiago Valero',  'coach'),
  ('Eden Christie',    'coach'),
  ('Pat Wingler',      'coach'),
  ('Taylor Raimo',     'coach'),
  ('Nicole Mallot',    'coach'),
  ('Dayron Wellington','trainer'),
  ('Abigail Perez',    'front desk'),
  ('Diana Ogando',     'front desk'),
  ('Marla Ray',        'front desk'),
  ('Amanda Spera',     'admin')
) as v(full_name, role)
where not exists (select 1 from staff);
