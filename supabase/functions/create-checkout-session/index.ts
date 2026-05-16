// Supabase Edge Function — Stripe checkout session.
//
// TODO: STRIPE NOT WIRED. Scaffold only. Payments are intentionally not
// implemented yet (UI + data model only). When Stripe is ready:
//
//   1. supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//   2. Populate products.stripe_price_id for each product.
//   3. Implement the session creation below and create an `orders` row.
//   4. Deploy: supabase functions deploy create-checkout-session
//   5. Wire the Cart drawer "Checkout" button to invoke this function.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response(
      JSON.stringify({
        error: "Stripe not configured",
        todo: "Set STRIPE_SECRET_KEY and implement session creation."
      }),
      { status: 501, headers: { "Content-Type": "application/json" } }
    );
  }

  // TODO: build line items from request body, create Stripe Checkout Session,
  // insert a pending `orders` row, return { url } for client redirect.

  return new Response(
    JSON.stringify({ error: "Not implemented" }),
    { status: 501, headers: { "Content-Type": "application/json" } }
  );
});
