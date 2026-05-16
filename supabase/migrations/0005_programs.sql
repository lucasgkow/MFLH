-- MFLH Collective — multi-week training programs

create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  weeks int not null default 4,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists program_workouts (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references programs(id) on delete cascade,
  week int not null default 1,
  day int not null default 1,
  title text not null,
  body text not null,
  position int default 0,
  created_at timestamptz default now()
);

create index if not exists program_workouts_program_idx
  on program_workouts (program_id, week, day);

alter table programs          enable row level security;
alter table program_workouts  enable row level security;

create policy "programs read" on programs
  for select to authenticated using (published or is_admin());
create policy "programs admin write" on programs
  for all to authenticated using (is_admin()) with check (is_admin());

create policy "program_workouts read" on program_workouts
  for select to authenticated using (
    exists (
      select 1 from programs p
      where p.id = program_id and (p.published or is_admin())
    )
  );
create policy "program_workouts admin write" on program_workouts
  for all to authenticated using (is_admin()) with check (is_admin());
