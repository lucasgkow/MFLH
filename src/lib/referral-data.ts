import { createAdminClient } from "@/lib/supabase/admin";
import { serviceRoleConfigured } from "@/lib/supabase/safe";
import type { Referral } from "@/lib/types";

export const REFERRAL_STATUSES = ["Lead", "Trial", "Joined", "Lost"] as const;

export async function getReferrals(): Promise<Referral[]> {
  if (!serviceRoleConfigured()) return [];
  const db = createAdminClient();
  const { data } = await db
    .from("referrals")
    .select("*, staff(full_name)")
    .order("created_at", { ascending: false });
  return (data as Referral[]) ?? [];
}

export type ReferralSummaryRow = {
  staffId: string | null;
  name: string;
  total: number; // all referrals
  joined: number; // converted
  earned: number; // commission on all logged
  paid: number;
  outstanding: number;
};

export async function getReferralSummary(): Promise<ReferralSummaryRow[]> {
  const referrals = await getReferrals();
  const map = new Map<string, ReferralSummaryRow>();

  for (const r of referrals) {
    const key = r.staff_id ?? "unassigned";
    const name = r.staff?.full_name ?? "Unassigned";
    const row =
      map.get(key) ??
      ({
        staffId: r.staff_id,
        name,
        total: 0,
        joined: 0,
        earned: 0,
        paid: 0,
        outstanding: 0
      } satisfies ReferralSummaryRow);

    row.total += 1;
    if (r.status === "Joined") row.joined += 1;
    const amt = r.commission_amount ?? 0;
    row.earned += amt;
    if (r.commission_paid) row.paid += amt;
    else row.outstanding += amt;

    map.set(key, row);
  }

  return [...map.values()].sort((a, b) => b.outstanding - a.outstanding);
}
