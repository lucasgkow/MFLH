// Returns true only when Supabase env vars are present. Lets public pages
// render (with empty data) before the Supabase project is provisioned.
export function supabaseConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function serviceRoleConfigured() {
  return supabaseConfigured() && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}
