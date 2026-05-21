import type { CartItem, Product } from "@/lib/types";

// Square REST client (no SDK dependency — thin fetch wrapper). Everything
// degrades gracefully: when SQUARE_* env vars are absent, callers fall back to
// the Supabase product table so the storefront keeps working pre-credentials.
//
// Required env (server-only):
//   SQUARE_ACCESS_TOKEN   — access token from the Square Developer dashboard
//   SQUARE_LOCATION_ID    — the location whose catalog/orders to use
//   SQUARE_ENVIRONMENT    — "production" (default) or "sandbox"
//   SQUARE_VERSION        — optional API version override

const VERSION = process.env.SQUARE_VERSION || "2025-01-23";

export function squareConfigured(): boolean {
  return !!(process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_LOCATION_ID);
}

function baseUrl(): string {
  return process.env.SQUARE_ENVIRONMENT === "sandbox"
    ? "https://connect.squareupsandbox.com"
    : "https://connect.squareup.com";
}

async function squareFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T | null> {
  if (!squareConfigured()) return null;
  try {
    const res = await fetch(`${baseUrl()}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        "Square-Version": VERSION,
        "Content-Type": "application/json",
        ...(init?.headers || {})
      },
      // Catalog is cached briefly; checkout/orders are always fresh.
      cache: "no-store"
    });
    if (!res.ok) {
      console.error("Square API error", path, res.status, await res.text());
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("Square API request failed", path, err);
    return null;
  }
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type CatalogMoney = { amount?: number; currency?: string };
type CatalogObject = {
  id: string;
  type: string;
  updated_at?: string;
  image_data?: { url?: string };
  item_data?: {
    name?: string;
    description?: string;
    image_ids?: string[];
    variations?: {
      id: string;
      item_variation_data?: { name?: string; price_money?: CatalogMoney };
    }[];
  };
};

// Map Square catalog ITEMs into the app's existing Product shape so the
// storefront UI is source-agnostic.
export async function listSquareProducts(): Promise<Product[]> {
  const data = await squareFetch<{
    objects?: CatalogObject[];
    related_objects?: CatalogObject[];
  }>("/v2/catalog/search-catalog-objects", {
    method: "POST",
    body: JSON.stringify({
      object_types: ["ITEM"],
      include_related_objects: true
    })
  });
  if (!data?.objects) return [];

  const images = new Map<string, string>();
  (data.related_objects ?? []).forEach((o) => {
    if (o.type === "IMAGE" && o.image_data?.url) images.set(o.id, o.image_data.url);
  });

  return data.objects
    .filter((o) => o.type === "ITEM" && o.item_data?.name)
    .map((o) => {
      const item = o.item_data!;
      const variations = item.variations ?? [];
      const prices = variations
        .map((v) => v.item_variation_data?.price_money?.amount)
        .filter((a): a is number => typeof a === "number");
      const price = prices.length ? Math.min(...prices) / 100 : 0;
      const sizes =
        variations.length > 1
          ? variations
              .map((v) => v.item_variation_data?.name)
              .filter((n): n is string => !!n)
          : [];
      const imageUrl = item.image_ids?.length
        ? images.get(item.image_ids[0]) ?? null
        : null;

      return {
        id: o.id,
        name: item.name!,
        slug: slugify(item.name!),
        description: item.description ?? null,
        price,
        sizes,
        image_url: imageUrl,
        in_stock: true,
        featured: false,
        stripe_price_id: null,
        created_at: o.updated_at ?? ""
      } satisfies Product;
    });
}

export async function getSquareProduct(slug: string): Promise<Product | null> {
  const all = await listSquareProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

// Create a Square-hosted checkout (Payment Link) for the cart. Returns the URL
// to redirect the customer to. Orders land in the Square dashboard.
export async function createSquareCheckout(
  items: CartItem[],
  redirectUrl: string
): Promise<{ url: string } | null> {
  if (!items.length) return null;
  const data = await squareFetch<{ payment_link?: { url?: string } }>(
    "/v2/online-checkout/payment-links",
    {
      method: "POST",
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        order: {
          location_id: process.env.SQUARE_LOCATION_ID,
          line_items: items.map((i) => ({
            name: i.size && i.size !== "OS" ? `${i.name} (${i.size})` : i.name,
            quantity: String(i.quantity),
            base_price_money: {
              amount: Math.round(i.price * 100),
              currency: "USD"
            }
          }))
        },
        checkout_options: {
          redirect_url: redirectUrl,
          ask_for_shipping_address: true
        }
      })
    }
  );
  const url = data?.payment_link?.url;
  return url ? { url } : null;
}

export type SquareOrder = {
  id: string;
  createdAt: string;
  total: number;
  state: string;
  itemCount: number;
};

export async function listSquareOrders(): Promise<SquareOrder[]> {
  const data = await squareFetch<{
    orders?: {
      id: string;
      created_at: string;
      state: string;
      total_money?: CatalogMoney;
      line_items?: { quantity?: string }[];
    }[];
  }>("/v2/orders/search", {
    method: "POST",
    body: JSON.stringify({
      location_ids: [process.env.SQUARE_LOCATION_ID],
      query: { sort: { sort_field: "CREATED_AT", sort_order: "DESC" } },
      limit: 50
    })
  });
  if (!data?.orders) return [];
  return data.orders.map((o) => ({
    id: o.id,
    createdAt: o.created_at,
    total: (o.total_money?.amount ?? 0) / 100,
    state: o.state,
    itemCount: (o.line_items ?? []).reduce(
      (n, li) => n + Number(li.quantity ?? 0),
      0
    )
  }));
}
