import { createAdminClient } from "@/lib/supabase/admin";
import { serviceRoleConfigured } from "@/lib/supabase/safe";
import type { Staff, TimeEntry } from "@/lib/types";

const ROLE_ORDER: Record<string, number> = {
  "owner/coach": 0,
  coach: 1,
  trainer: 2,
  "front desk": 3,
  admin: 4
};

function byRoleThenName(a: Staff, b: Staff) {
  const ra = ROLE_ORDER[a.role] ?? 9;
  const rb = ROLE_ORDER[b.role] ?? 9;
  if (ra !== rb) return ra - rb;
  return a.full_name.localeCompare(b.full_name);
}

export async function getStaff(activeOnly = false): Promise<Staff[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  let query = db.from("staff").select("*");
  if (activeOnly) query = query.eq("active", true);
  const { data } = await query;
  return ((data as Staff[]) ?? []).sort(byRoleThenName);
}

export async function getOpenEntries(): Promise<Record<string, TimeEntry>> {
  if (!serviceRoleConfigured()) return {};
  const db = createAdminClient();
  const { data } = await db
    .from("time_entries")
    .select("*")
    .is("clock_out", null);
  const map: Record<string, TimeEntry> = {};
  ((data as TimeEntry[]) ?? []).forEach((e) => (map[e.staff_id] = e));
  return map;
}

// Active staff for the kiosk, each tagged with their open shift (if clocked in).
export async function getKioskRoster(): Promise<
  (Staff & { openSince: string | null })[]
> {
  const [staff, open] = await Promise.all([getStaff(true), getOpenEntries()]);
  return staff.map((s) => ({
    ...s,
    openSince: open[s.id]?.clock_in ?? null
  }));
}

export type StaffHours = {
  staff: Staff;
  entries: TimeEntry[];
  totalMs: number;
  openMs: number; // hours still on an open shift (informational)
};

// Completed-hours report for a date range. Open shifts are surfaced separately
// so payroll totals only count clocked-out time.
export async function getHoursReport(
  fromISO: string,
  toISO: string
): Promise<StaffHours[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const [{ data: staffRows }, { data: entryRows }] = await Promise.all([
    db.from("staff").select("*"),
    db
      .from("time_entries")
      .select("*")
      .gte("clock_in", fromISO)
      .lte("clock_in", toISO)
      .order("clock_in", { ascending: false })
  ]);

  const staff = ((staffRows as Staff[]) ?? []).sort(byRoleThenName);
  const entries = (entryRows as TimeEntry[]) ?? [];
  const now = Date.now();

  return staff
    .map((s) => {
      const mine = entries.filter((e) => e.staff_id === s.id);
      let totalMs = 0;
      let openMs = 0;
      for (const e of mine) {
        const start = new Date(e.clock_in).getTime();
        if (e.clock_out) {
          totalMs += new Date(e.clock_out).getTime() - start;
        } else {
          openMs += now - start;
        }
      }
      return { staff: s, entries: mine, totalMs, openMs };
    })
    .filter((r) => r.entries.length > 0);
}
