"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function updateRegistrationStatus(id: string, status: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("registrations").update({ status }).eq("id", id);
  revalidatePath("/admin/registrations");
}

export async function updateContactStatus(id: string, status: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("contact_submissions").update({ status }).eq("id", id);
  revalidatePath("/admin/contact");
}

export async function saveEvent(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  const id = formData.get("id") as string | null;
  const title = String(formData.get("title"));
  const slug =
    (formData.get("slug") as string)?.trim() || slugify(title);

  const row = {
    title,
    slug,
    description: (formData.get("description") as string) || null,
    category: String(formData.get("category")),
    event_date: String(formData.get("event_date")),
    event_time: (formData.get("event_time") as string) || null,
    location: (formData.get("location") as string) || null,
    max_capacity: formData.get("max_capacity")
      ? Number(formData.get("max_capacity"))
      : null,
    registration_open: formData.get("registration_open") === "on",
    featured_image_url: (formData.get("featured_image_url") as string) || null
  };

  if (id) {
    await db.from("events").update(row).eq("id", id);
  } else {
    await db.from("events").insert(row);
  }
  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("events").delete().eq("id", id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  const id = formData.get("id") as string | null;
  const name = String(formData.get("name"));
  const slug =
    (formData.get("slug") as string)?.trim() || slugify(name);
  const sizes = formData.getAll("sizes").map(String);

  const row = {
    name,
    slug,
    description: (formData.get("description") as string) || null,
    price: Number(formData.get("price")),
    sizes,
    image_url: (formData.get("image_url") as string) || null,
    in_stock: formData.get("in_stock") === "on",
    featured: formData.get("featured") === "on"
  };

  if (id) {
    await db.from("products").update(row).eq("id", id);
  } else {
    await db.from("products").insert(row);
  }
  revalidatePath("/admin/shop");
  revalidatePath("/shop");
  redirect("/admin/shop");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("products").delete().eq("id", id);
  revalidatePath("/admin/shop");
  revalidatePath("/shop");
}

export async function saveFaq(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  const id = formData.get("id") as string | null;
  const row = {
    question: String(formData.get("question")),
    answer: String(formData.get("answer")),
    display_order: Number(formData.get("display_order") || 0)
  };
  if (id) {
    await db.from("faqs").update(row).eq("id", id);
  } else {
    await db.from("faqs").insert(row);
  }
  revalidatePath("/admin/faqs");
  revalidatePath("/get-started");
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("faqs").delete().eq("id", id);
  revalidatePath("/admin/faqs");
  revalidatePath("/get-started");
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  const updates = Array.from(formData.entries()).map(([key, value]) => ({
    key,
    value: String(value)
  }));
  for (const u of updates) {
    await db.from("site_settings").upsert(u);
  }
  revalidatePath("/admin/settings");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---- Member portal management ----

export async function saveClass(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  const id = formData.get("id") as string | null;
  const row = {
    title: String(formData.get("title")),
    class_type: (formData.get("class_type") as string) || null,
    description: (formData.get("description") as string) || null,
    coach_name: (formData.get("coach_name") as string) || null,
    starts_at: new Date(
      String(formData.get("starts_at"))
    ).toISOString(),
    duration_min: Number(formData.get("duration_min") || 60),
    capacity: Number(formData.get("capacity") || 20),
    location: (formData.get("location") as string) || "MFLH Collective"
  };
  if (id) {
    await db.from("classes").update(row).eq("id", id);
  } else {
    await db.from("classes").insert(row);
  }
  revalidatePath("/admin/classes");
  revalidatePath("/member/schedule");
  redirect("/admin/classes");
}

export async function deleteClass(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("classes").delete().eq("id", id);
  revalidatePath("/admin/classes");
  revalidatePath("/member/schedule");
}

export async function saveRoutine(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  const id = formData.get("id") as string | null;
  const row = {
    title: String(formData.get("title")),
    body: String(formData.get("body")),
    routine_date: String(formData.get("routine_date")),
    class_type: (formData.get("class_type") as string) || null,
    published: formData.get("published") === "on"
  };
  if (id) {
    await db.from("routines").update(row).eq("id", id);
  } else {
    await db.from("routines").insert(row);
  }
  revalidatePath("/admin/routines");
  revalidatePath("/member/routines");
  redirect("/admin/routines");
}

export async function deleteRoutine(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("routines").delete().eq("id", id);
  revalidatePath("/admin/routines");
  revalidatePath("/member/routines");
}

export async function setMemberRole(id: string, role: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/members");
}

export async function adminDeletePost(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("posts").delete().eq("id", id);
  revalidatePath("/admin/feed");
  revalidatePath("/member/social");
}

export async function saveProgram(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  const id = formData.get("id") as string | null;
  const title = String(formData.get("title"));
  const row = {
    title,
    slug:
      (formData.get("slug") as string)?.trim() || slugify(title),
    description: (formData.get("description") as string) || null,
    weeks: Number(formData.get("weeks") || 4),
    published: formData.get("published") === "on"
  };
  if (id) {
    await db.from("programs").update(row).eq("id", id);
  } else {
    await db.from("programs").insert(row);
  }
  revalidatePath("/admin/programs");
  revalidatePath("/member/programs");
  redirect("/admin/programs");
}

export async function deleteProgram(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("programs").delete().eq("id", id);
  revalidatePath("/admin/programs");
  revalidatePath("/member/programs");
}

export async function saveProgramWorkout(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("program_workouts").insert({
    program_id: String(formData.get("program_id")),
    week: Number(formData.get("week") || 1),
    day: Number(formData.get("day") || 1),
    title: String(formData.get("title")),
    body: String(formData.get("body")),
    position: Number(formData.get("position") || 0)
  });
  revalidatePath(`/admin/programs/${formData.get("program_id")}`);
  revalidatePath("/member/programs");
}

export async function deleteProgramWorkout(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("program_workouts").delete().eq("id", id);
  revalidatePath("/admin/programs");
  revalidatePath("/member/programs");
}
