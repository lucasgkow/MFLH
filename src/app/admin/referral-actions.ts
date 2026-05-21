"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

export async function saveReferral(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  const id = formData.get("id") as string | null;
  const rawAmount = formData.get("commission_amount");
  const staffId = formData.get("staff_id") as string;
  const row = {
    staff_id: staffId || null,
    referred_name: String(formData.get("referred_name")).trim(),
    referred_email: (formData.get("referred_email") as string)?.trim() || null,
    referred_phone: (formData.get("referred_phone") as string)?.trim() || null,
    status: String(formData.get("status") || "Lead"),
    commission_amount: rawAmount ? Number(rawAmount) : null,
    commission_paid: formData.get("commission_paid") === "on",
    note: (formData.get("note") as string)?.trim() || null
  };
  if (id) {
    await db.from("referrals").update(row).eq("id", id);
  } else {
    await db.from("referrals").insert(row);
  }
  revalidatePath("/admin/referrals");
  redirect("/admin/referrals");
}

export async function setReferralStatus(id: string, status: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("referrals").update({ status }).eq("id", id);
  revalidatePath("/admin/referrals");
}

export async function toggleReferralPaid(id: string, paid: boolean) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("referrals").update({ commission_paid: paid }).eq("id", id);
  revalidatePath("/admin/referrals");
}

export async function deleteReferral(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("referrals").delete().eq("id", id);
  revalidatePath("/admin/referrals");
}
