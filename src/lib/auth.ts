import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/safe";

export type Profile = {
  id: string;
  role: "member" | "admin";
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  membership_status: string | null;
};

async function loadSessionProfile() {
  if (!supabaseConfigured()) return { user: null, profile: null };
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return { user, profile: (profile as Profile) ?? null };
}

// Admin pages/actions. Middleware gates routing; this is the authoritative
// role check (defense in depth) — a non-admin user cannot reach admin.
export async function requireAdmin() {
  const { user, profile } = await loadSessionProfile();
  if (!user) redirect("/admin/login");
  if (profile?.role !== "admin") redirect("/admin/login");
  return { user, profile: profile as Profile };
}

export async function getOptionalProfile() {
  return loadSessionProfile();
}
