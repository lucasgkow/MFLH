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
