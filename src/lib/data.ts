import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/safe";
import {
  squareConfigured,
  listSquareProducts,
  getSquareProduct
} from "@/lib/square";
import type { EventRow, Product, Faq } from "@/lib/types";

// Public read helpers. All degrade to empty results when Supabase is not yet
// configured, so the marketing site renders before the project is provisioned.

export async function getUpcomingEvents(limit?: number): Promise<EventRow[]> {
  if (!supabaseConfigured()) return [];
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);
  let query = supabase
    .from("events")
    .select("*")
    .gte("event_date", today)
    .order("event_date", { ascending: true });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data as EventRow[]) ?? [];
}

export async function getPastEvents(): Promise<EventRow[]> {
  if (!supabaseConfigured()) return [];
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("events")
    .select("*")
    .lt("event_date", today)
    .order("event_date", { ascending: false });
  return (data as EventRow[]) ?? [];
}

export async function getEventBySlug(
  slug: string
): Promise<EventRow | null> {
  if (!supabaseConfigured()) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as EventRow) ?? null;
}

export async function getProducts(): Promise<Product[]> {
  if (!supabaseConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: true });
  return (data as Product[]) ?? [];
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const products = await getShopProducts();
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, limit);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  if (!supabaseConfigured()) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Product) ?? null;
}

// Source-agnostic storefront reads: Square catalog when configured (so coffee +
// merch share one Square dashboard), otherwise the Supabase products table.
export async function getShopProducts(): Promise<Product[]> {
  if (squareConfigured()) return listSquareProducts();
  return getProducts();
}

export async function getShopProduct(slug: string): Promise<Product | null> {
  if (squareConfigured()) return getSquareProduct(slug);
  return getProductBySlug(slug);
}

export async function getFaqs(): Promise<Faq[]> {
  if (!supabaseConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order", { ascending: true });
  return (data as Faq[]) ?? [];
}
