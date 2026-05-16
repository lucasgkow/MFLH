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
  if (!body?.event_id || !body?.name || !body?.email) {
    return NextResponse.json(
      { error: "Event, name and email are required." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("event_registrations").insert({
    event_id: body.event_id,
    name: body.name,
    email: body.email,
    phone: body.phone || null
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
