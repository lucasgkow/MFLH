import { createClient } from "@/lib/supabase/server";
import type {
  GymClass,
  ClassRegistration,
  MemberCheckin,
  Routine,
  WorkoutLog,
  WorkoutEntry,
  HyroxBenchmark,
  BenchmarkResult,
  Post,
  PostComment,
  PostReaction
} from "@/lib/types";

// All reads use the session-bound server client, so RLS scopes every query
// to the logged-in member automatically.

export async function getUpcomingClasses(): Promise<
  (GymClass & { registered: number; mine: boolean })[]
> {
  const supabase = createClient();
  const nowIso = new Date().toISOString();
  const { data: classes } = await supabase
    .from("classes")
    .select("*")
    .gte("starts_at", nowIso)
    .order("starts_at", { ascending: true });
  const { data: regs } = await supabase
    .from("class_registrations")
    .select("class_id, member_id, status");
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return ((classes as GymClass[]) ?? []).map((c) => {
    const active = (regs ?? []).filter(
      (r: any) => r.class_id === c.id && r.status !== "cancelled"
    );
    return {
      ...c,
      registered: active.length,
      mine: active.some((r: any) => r.member_id === user?.id)
    };
  });
}

export async function getClassWithRoster(id: string) {
  const supabase = createClient();
  const { data: gymClass } = await supabase
    .from("classes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!gymClass) return null;
  const { data: roster } = await supabase
    .from("class_registrations")
    .select("*, profiles(display_name, avatar_url)")
    .eq("class_id", id)
    .neq("status", "cancelled")
    .order("created_at", { ascending: true });
  return { gymClass: gymClass as GymClass, roster: roster ?? [] };
}

export async function getMyCheckins(): Promise<
  (MemberCheckin & { classes: { title: string } | null })[]
> {
  const supabase = createClient();
  const { data } = await supabase
    .from("member_checkins")
    .select("*, classes(title)")
    .order("checked_in_at", { ascending: false });
  return (data as any) ?? [];
}

export async function getCheckinStats() {
  const supabase = createClient();
  const { data } = await supabase
    .from("member_checkins")
    .select("checked_in_at");
  const list = (data ?? []).map((r: any) => new Date(r.checked_in_at));
  const now = new Date();
  const since = (d: number) => new Date(now.getTime() - d * 864e5);
  const startYear = new Date(now.getFullYear(), 0, 1);
  return {
    week: list.filter((d) => d >= since(7)).length,
    month: list.filter((d) => d >= since(30)).length,
    year: list.filter((d) => d >= startYear).length,
    all: list.length
  };
}

export async function getRoutines(): Promise<Routine[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("routines")
    .select("*")
    .order("routine_date", { ascending: false })
    .limit(60);
  return (data as Routine[]) ?? [];
}

export async function getRoutine(id: string): Promise<Routine | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("routines")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Routine) ?? null;
}

export async function getTodayRoutine(): Promise<Routine | null> {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("routines")
    .select("*")
    .lte("routine_date", today)
    .eq("published", true)
    .order("routine_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as Routine) ?? null;
}

export async function getMyWorkoutLogs(): Promise<
  (WorkoutLog & { workout_entries: WorkoutEntry[] })[]
> {
  const supabase = createClient();
  const { data } = await supabase
    .from("workout_logs")
    .select("*, workout_entries(*)")
    .order("log_date", { ascending: false });
  return (data as any) ?? [];
}

export async function getBenchmarks(): Promise<HyroxBenchmark[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("hyrox_benchmarks")
    .select("*")
    .order("display_order", { ascending: true });
  return (data as HyroxBenchmark[]) ?? [];
}

export async function getMyBenchmarkResults(): Promise<BenchmarkResult[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("benchmark_results")
    .select("*")
    .order("recorded_on", { ascending: false });
  return (data as BenchmarkResult[]) ?? [];
}

export type LeaderboardRow = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  checkins: number;
  workouts: number;
  benchmarks: number;
  classes_attended: number;
  points: number;
  rank: number;
};

export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  const supabase = createClient();
  const { data } = await supabase.rpc("leaderboard");
  const { mflhPoints } = await import("@/lib/constants");
  const rows = ((data as any[]) ?? []).map((r) => {
    const counts = {
      checkins: Number(r.checkins),
      workouts: Number(r.workouts),
      benchmarks: Number(r.benchmarks),
      classes_attended: Number(r.classes_attended)
    };
    return {
      id: r.id as string,
      display_name: r.display_name as string,
      avatar_url: (r.avatar_url as string) ?? null,
      ...counts,
      points: mflhPoints(counts),
      rank: 0
    };
  });
  rows.sort((a, b) => b.points - a.points);
  rows.forEach((r, i) => (r.rank = i + 1));
  return rows;
}

export async function getFeed() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(display_name, avatar_url)")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);
  const { data: reactions } = await supabase
    .from("post_reactions")
    .select("*");
  const { data: comments } = await supabase
    .from("post_comments")
    .select("*, profiles(display_name)")
    .order("created_at", { ascending: true });

  return ((posts as Post[]) ?? []).map((p) => {
    const rx = ((reactions as PostReaction[]) ?? []).filter(
      (r) => r.post_id === p.id
    );
    return {
      ...p,
      reactionCount: rx.length,
      reacted: rx.some((r) => r.member_id === user?.id),
      comments: ((comments as PostComment[]) ?? []).filter(
        (c) => c.post_id === p.id
      )
    };
  });
}
