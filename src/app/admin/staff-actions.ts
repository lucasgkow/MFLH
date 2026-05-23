"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { serviceRoleConfigured } from "@/lib/supabase/safe";
import { requireAdmin } from "@/lib/auth";
import { REPORT_COOKIE, reportPin } from "@/lib/staff-report";

type ClockResult = {
  ok: boolean;
  action?: "in" | "out";
  name?: string;
  error?: string;
};

// Toggle a staff member's shift from the kiosk. Identity is proven by the PIN;
// the surrounding page is already behind admin auth (the shared gym computer).
export async function clockToggle(
  staffId: string,
  pin: string
): Promise<ClockResult> {
  await requireAdmin();
  if (!serviceRoleConfigured()) {
    return { ok: false, error: "Backend not configured." };
  }
  const db = createAdminClient();

  const { data: staff } = await db
    .from("staff")
    .select("id, full_name, pin, active")
    .eq("id", staffId)
    .maybeSingle();

  if (!staff || !staff.active) return { ok: false, error: "Unknown staff." };
  if (!staff.pin) return { ok: false, error: "No PIN set — ask an admin." };
  if (String(pin).trim() !== String(staff.pin)) {
    return { ok: false, error: "Incorrect PIN." };
  }

  const { data: open } = await db
    .from("time_entries")
    .select("id")
    .eq("staff_id", staffId)
    .is("clock_out", null)
    .maybeSingle();

  if (open) {
    await db
      .from("time_entries")
      .update({ clock_out: new Date().toISOString() })
      .eq("id", open.id);
    revalidatePath("/admin/staff");
    return { ok: true, action: "out", name: staff.full_name };
  }

  await db.from("time_entries").insert({ staff_id: staffId });
  revalidatePath("/admin/staff");
  return { ok: true, action: "in", name: staff.full_name };
}

export async function saveStaff(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  const id = formData.get("id") as string | null;
  const rawRate = formData.get("hourly_rate");
  const row = {
    full_name: String(formData.get("full_name")).trim(),
    role: String(formData.get("role") || "coach"),
    pin: (formData.get("pin") as string)?.trim() || null,
    hourly_rate: rawRate ? Number(rawRate) : null,
    active: formData.get("active") === "on"
  };
  if (id) {
    await db.from("staff").update(row).eq("id", id);
  } else {
    await db.from("staff").insert(row);
  }
  revalidatePath("/admin/staff");
  revalidatePath("/admin/staff/manage");
  redirect("/admin/staff/manage");
}

export async function deleteStaff(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("staff").delete().eq("id", id);
  revalidatePath("/admin/staff/manage");
}

export async function verifyReportPin(formData: FormData) {
  await requireAdmin();
  const entered = String(formData.get("pin") || "").trim();
  if (entered && entered === reportPin()) {
    cookies().set(REPORT_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 8 // 8 hours
    });
    redirect("/admin/staff/hours");
  }
  redirect("/admin/staff/hours?bad=1");
}

export async function lockReport() {
  await requireAdmin();
  cookies().delete(REPORT_COOKIE);
  redirect("/admin/staff");
}
