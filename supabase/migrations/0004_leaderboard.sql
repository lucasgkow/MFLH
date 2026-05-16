-- MFLH Collective — leaderboard aggregate
--
-- Members may see each other's *aggregate totals* (for ranking) but NOT
-- each other's raw workout logs / benchmark rows (those stay RLS-private).
-- This security-definer function returns only counts per profile, so it
-- can aggregate across members without exposing private detail.

create or replace function public.leaderboard()
returns table (
  id uuid,
  display_name text,
  avatar_url text,
  checkins bigint,
  workouts bigint,
  benchmarks bigint,
  classes_attended bigint
)
language sql
security definer
set search_path = public
stable
as $$
  select
    p.id,
    coalesce(nullif(p.display_name, ''), nullif(p.first_name, ''), 'Athlete')
      as display_name,
    p.avatar_url,
    (select count(*) from member_checkins mc where mc.member_id = p.id)
      as checkins,
    (select count(*) from workout_logs wl where wl.member_id = p.id)
      as workouts,
    (select count(*) from benchmark_results br where br.member_id = p.id)
      as benchmarks,
    (select count(*) from class_registrations cr
       where cr.member_id = p.id and cr.status = 'attended')
      as classes_attended
  from profiles p;
$$;

grant execute on function public.leaderboard() to authenticated;
