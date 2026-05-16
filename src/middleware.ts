import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Refreshes the Supabase session and gates /admin and /member behind auth.
// Role enforcement (member vs admin) happens server-side in requireAdmin().
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const path = request.nextUrl.pathname;

  const isAdmin = path.startsWith("/admin");
  const isMember = path.startsWith("/member");
  const isAdminLogin = path === "/admin/login";
  const isMemberAuth = path === "/member/login" || path === "/member/signup";

  // Supabase not configured — allow auth pages, block the rest.
  if (!url || !anon) {
    if (isAdmin && !isAdminLogin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (isMember && !isMemberAuth) {
      return NextResponse.redirect(new URL("/member/login", request.url));
    }
    return response;
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }[]
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (isAdmin && !isAdminLogin && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (isAdminLogin && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (isMember && !isMemberAuth && !user) {
    return NextResponse.redirect(new URL("/member/login", request.url));
  }
  if (isMemberAuth && user) {
    return NextResponse.redirect(new URL("/member", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*"]
};
