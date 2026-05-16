import { createAdminClient } from "@/lib/supabase/admin";
import { serviceRoleConfigured } from "@/lib/supabase/safe";
import type {
  Registration,
  ContactSubmission,
  EventRow,
  EventRegistration,
  Product,
  Faq,
  Order,
  GymClass,
  Routine,
  MemberProfile,
  Post,
  Program,
  ProgramWorkout
} from "@/lib/types";

// Service-role reads for the admin portal. Returns empty data when the
// backend is not yet provisioned so the portal still renders.

export async function adminGetRegistrations(): Promise<Registration[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data } = await db
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Registration[]) ?? [];
}

export async function adminGetContacts(): Promise<ContactSubmission[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data } = await db
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as ContactSubmission[]) ?? [];
}

export async function adminGetEvents(): Promise<EventRow[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data } = await db
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });
  return (data as EventRow[]) ?? [];
}

export async function adminGetEvent(id: string): Promise<EventRow | null> {
  if (!serviceRoleConfigured()) return null;
  const db = createAdminClient();
  const { data } = await db
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as EventRow) ?? null;
}

export async function adminGetEventRegistrations(): Promise<
  (EventRegistration & { events: { title: string } | null })[]
> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data } = await db
    .from("event_registrations")
    .select("*, events(title)")
    .order("created_at", { ascending: false });
  return (data as any) ?? [];
}

export async function adminGetProducts(): Promise<Product[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data } = await db
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  return (data as Product[]) ?? [];
}

export async function adminGetProduct(id: string): Promise<Product | null> {
  if (!serviceRoleConfigured()) return null;
  const db = createAdminClient();
  const { data } = await db
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Product) ?? null;
}

export async function adminGetOrders(): Promise<Order[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data } = await db
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Order[]) ?? [];
}

export async function adminGetFaqs(): Promise<Faq[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data } = await db
    .from("faqs")
    .select("*")
    .order("display_order", { ascending: true });
  return (data as Faq[]) ?? [];
}

export async function adminGetSettings(): Promise<Record<string, string>> {
  if (!serviceRoleConfigured()) return {};
  const db = createAdminClient();
  const { data } = await db.from("site_settings").select("*");
  const out: Record<string, string> = {};
  (data ?? []).forEach((r: any) => (out[r.key] = r.value ?? ""));
  return out;
}

export async function adminDashboardStats() {
  if (!serviceRoleConfigured()) {
    return {
      newRegistrations: 0,
      pendingContacts: 0,
      upcomingEvents: 0,
      totalProducts: 0,
      configured: false
    };
  }
  const db = createAdminClient();
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
  const today = new Date().toISOString().slice(0, 10);

  const [regs, contacts, events, products] = await Promise.all([
    db
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekAgo),
    db
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("status", "Unread"),
    db
      .from("events")
      .select("id", { count: "exact", head: true })
      .gte("event_date", today),
    db.from("products").select("id", { count: "exact", head: true })
  ]);

  return {
    newRegistrations: regs.count ?? 0,
    pendingContacts: contacts.count ?? 0,
    upcomingEvents: events.count ?? 0,
    totalProducts: products.count ?? 0,
    configured: true
  };
}

// ---- Member portal management (service role) ----

export async function adminGetClasses(): Promise<GymClass[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data } = await db
    .from("classes")
    .select("*")
    .order("starts_at", { ascending: false });
  return (data as GymClass[]) ?? [];
}

export async function adminGetClass(id: string): Promise<GymClass | null> {
  if (!serviceRoleConfigured()) return null;
  const db = createAdminClient();
  const { data } = await db
    .from("classes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as GymClass) ?? null;
}

export async function adminGetClassRoster(id: string) {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data } = await db
    .from("class_registrations")
    .select("*, profiles(display_name)")
    .eq("class_id", id)
    .neq("status", "cancelled");
  return data ?? [];
}

export async function adminGetRoutines(): Promise<Routine[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data } = await db
    .from("routines")
    .select("*")
    .order("routine_date", { ascending: false });
  return (data as Routine[]) ?? [];
}

export async function adminGetRoutine(id: string): Promise<Routine | null> {
  if (!serviceRoleConfigured()) return null;
  const db = createAdminClient();
  const { data } = await db
    .from("routines")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Routine) ?? null;
}

export async function adminGetMembers(): Promise<
  (MemberProfile & { checkins: number })[]
> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data: profiles } = await db
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: checkins } = await db
    .from("member_checkins")
    .select("member_id");
  return ((profiles as MemberProfile[]) ?? []).map((p) => ({
    ...p,
    checkins: (checkins ?? []).filter((c: any) => c.member_id === p.id).length
  }));
}

export async function adminGetPosts(): Promise<Post[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data } = await db
    .from("posts")
    .select("*, profiles(display_name)")
    .order("created_at", { ascending: false });
  return (data as Post[]) ?? [];
}

export async function adminGetPrograms(): Promise<
  (Program & { count: number })[]
> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data: programs } = await db
    .from("programs")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: pw } = await db
    .from("program_workouts")
    .select("program_id");
  return ((programs as Program[]) ?? []).map((p) => ({
    ...p,
    count: (pw ?? []).filter((w: any) => w.program_id === p.id).length
  }));
}

export async function adminGetProgram(id: string): Promise<{
  program: Program;
  workouts: ProgramWorkout[];
} | null> {
  if (!serviceRoleConfigured()) return null;
  const db = createAdminClient();
  const { data: program } = await db
    .from("programs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!program) return null;
  const { data: workouts } = await db
    .from("program_workouts")
    .select("*")
    .eq("program_id", id)
    .order("week", { ascending: true })
    .order("day", { ascending: true })
    .order("position", { ascending: true });
  return {
    program: program as Program,
    workouts: (workouts as ProgramWorkout[]) ?? []
  };
}

export type ActivityItem = {
  id: string;
  when: string;
  text: string;
  kind: string;
};

export async function adminGetActivity(): Promise<ActivityItem[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const [members, checkins, workouts, regs, posts] = await Promise.all([
    db
      .from("profiles")
      .select("id, display_name, full_name, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
    db
      .from("member_checkins")
      .select("id, member_id, checked_in_at, profiles(display_name)")
      .order("checked_in_at", { ascending: false })
      .limit(20),
    db
      .from("workout_logs")
      .select("id, title, created_at, profiles(display_name)")
      .order("created_at", { ascending: false })
      .limit(20),
    db
      .from("class_registrations")
      .select(
        "id, created_at, profiles(display_name), classes(title)"
      )
      .order("created_at", { ascending: false })
      .limit(20),
    db
      .from("posts")
      .select("id, created_at, profiles(display_name)")
      .order("created_at", { ascending: false })
      .limit(20)
  ]);

  const items: ActivityItem[] = [];
  (members.data ?? []).forEach((m: any) =>
    items.push({
      id: `m-${m.id}`,
      when: m.created_at,
      kind: "Member",
      text: `New member — ${m.display_name || m.full_name || "Athlete"}`
    })
  );
  (checkins.data ?? []).forEach((c: any) =>
    items.push({
      id: `c-${c.id}`,
      when: c.checked_in_at,
      kind: "Check-in",
      text: `${c.profiles?.display_name || "Athlete"} checked in`
    })
  );
  (workouts.data ?? []).forEach((w: any) =>
    items.push({
      id: `w-${w.id}`,
      when: w.created_at,
      kind: "Workout",
      text: `${w.profiles?.display_name || "Athlete"} logged "${w.title}"`
    })
  );
  (regs.data ?? []).forEach((r: any) =>
    items.push({
      id: `r-${r.id}`,
      when: r.created_at,
      kind: "Class",
      text: `${r.profiles?.display_name || "Athlete"} registered for ${
        r.classes?.title || "a class"
      }`
    })
  );
  (posts.data ?? []).forEach((p: any) =>
    items.push({
      id: `p-${p.id}`,
      when: p.created_at,
      kind: "Post",
      text: `${p.profiles?.display_name || "Athlete"} posted in the feed`
    })
  );

  return items
    .sort((a, b) => +new Date(b.when) - +new Date(a.when))
    .slice(0, 40);
}
