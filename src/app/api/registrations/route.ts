import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { serviceRoleConfigured } from "@/lib/supabase/safe";

export async function POST(req: Request) {
  if (!serviceRoleConfigured()) {
    return NextResponse.json(
      { error: "Backend not yet configured. Please try again later." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("registrations").insert({
    name: body.name,
    email: body.email,
    phone: body.phone || null,
    goal: body.goal || null,
    referral_source: body.referral_source || null,
    message: body.message || null
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fire-and-forget confirmation email (no-op until SMTP configured).
  const fnUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-registration-email`;
  fetch(fnUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({ name: body.name, email: body.email })
  }).catch(() => {
    /* email is best-effort; insertion already succeeded */
  });

  return NextResponse.json({ ok: true });
}
