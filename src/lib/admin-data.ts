import { createAdminClient } from "@/lib/supabase/admin";
import { serviceRoleConfigured } from "@/lib/supabase/safe";
import type {
  Registration,
  ContactSubmission,
  EventRow,
  EventRegistration,
  Product,
  Faq,
  Order
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
