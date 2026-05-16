// Supabase Edge Function — registration confirmation email.
//
// TODO: SMTP CONFIG REQUIRED. This function is scaffolded but will not send
// real email until an SMTP provider (e.g. Resend, Postmark, SendGrid) is
// configured and the secrets below are set:
//
//   supabase secrets set SMTP_HOST=... SMTP_PORT=... SMTP_USER=... \
//     SMTP_PASS=... FROM_EMAIL=info@mflhcollective.com
//
// Deploy: supabase functions deploy send-registration-email
//
// Invoke from the registration API route after a successful insert.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { name, email } = await req.json().catch(() => ({}));

  if (!email) {
    return new Response(JSON.stringify({ error: "email required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const smtpHost = Deno.env.get("SMTP_HOST");

  // TODO: replace this stub with a real SMTP / provider send once configured.
  if (!smtpHost) {
    console.log(
      `[send-registration-email] SMTP not configured — would email ${email}`
    );
    return new Response(
      JSON.stringify({ ok: true, sent: false, reason: "SMTP not configured" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // TODO: implement actual send here, e.g.:
  //   await sendViaResend({
  //     to: email,
  //     subject: "Welcome to MFLH Collective",
  //     html: `<p>${name}, we got your inquiry. A coach will reach out soon.</p>`
  //   });

  return new Response(JSON.stringify({ ok: true, sent: true }), {
    headers: { "Content-Type": "application/json" }
  });
});
