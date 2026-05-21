"use server";

import { headers } from "next/headers";
import { getShopProducts } from "@/lib/data";
import { squareConfigured, createSquareCheckout } from "@/lib/square";
import type { CartItem } from "@/lib/types";

// Build a Square-hosted checkout for the cart. Prices are re-derived from the
// authoritative catalog server-side — never trusted from the client payload.
export async function createCheckout(
  cart: CartItem[]
): Promise<{ url?: string; error?: string }> {
  if (!squareConfigured()) {
    return { error: "Checkout isn't available yet." };
  }
  if (!cart.length) return { error: "Your cart is empty." };

  const catalog = await getShopProducts();
  const byId = new Map(catalog.map((p) => [p.id, p]));

  const priced: CartItem[] = [];
  for (const item of cart) {
    const product = byId.get(item.productId);
    if (!product || !product.in_stock) continue;
    priced.push({
      ...item,
      name: product.name,
      price: Number(product.price),
      quantity: Math.max(1, Math.floor(item.quantity))
    });
  }
  if (!priced.length) {
    return { error: "These items are no longer available." };
  }

  const origin =
    headers().get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://mflhcollective.com";

  const result = await createSquareCheckout(priced, `${origin}/shop/success`);
  if (!result) return { error: "Could not start checkout. Try again." };
  return { url: result.url };
}
