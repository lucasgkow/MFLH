-- MFLH Collective — staff referral tracking with commissions
-- Service-role only (admin portal). No anon RLS policies.

create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references staff(id) on delete set null,
  referred_name text not null,
  referred_email text,
  referred_phone text,
  status text not null default 'Lead',  -- Lead | Trial | Joined | Lost
  commission_amount numeric(10,2),
  commission_paid boolean default false,
  note text,
  created_at timestamptz default now()
);

create index if not exists referrals_staff_idx on referrals (staff_id);
create index if not exists referrals_status_idx on referrals (status);

alter table referrals enable row level security;
-- No anon policies: reachable only via the service role (admin portal).
