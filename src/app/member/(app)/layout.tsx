import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { signOutMember } from "@/app/member/actions";
import { BottomNav } from "@/components/member/BottomNav";

export default async function MemberAppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireMember();
  const name =
    profile?.display_name || profile?.full_name || "Athlete";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-ink">
      <header className="sticky top-0 z-30 border-b border-concrete bg-ink/95 backdrop-blur">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <Link
            href="/member"
            className="font-display text-2xl uppercase tracking-wide"
          >
            MFLH<span className="text-flame">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/member/profile"
              className="flex items-center gap-2"
              aria-label="Your profile"
            >
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="h-8 w-8 object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center bg-flame font-display text-sm text-ink">
                  {initials}
                </span>
              )}
            </Link>
            <form action={signOutMember}>
              <button
                className="font-body text-[11px] font-bold uppercase tracking-[0.15em] text-bone/40 hover:text-flame"
                aria-label="Sign out"
              >
                Exit
              </button>
            </form>
          </div>
        </div>

        {/* Bridge back into the marketing site so the app and site feel
            like one system, not a walled-off portal. */}
        <nav className="flex items-center gap-4 overflow-x-auto px-5 pb-3">
          <Link
            href="/"
            className="whitespace-nowrap font-body text-[11px] font-bold uppercase tracking-[0.15em] text-bone/50 hover:text-flame"
          >
            ← Main Site
          </Link>
          <Link
            href="/training"
            className="whitespace-nowrap font-body text-[11px] font-bold uppercase tracking-[0.15em] text-bone/50 hover:text-flame"
          >
            Training
          </Link>
          <Link
            href="/events"
            className="whitespace-nowrap font-body text-[11px] font-bold uppercase tracking-[0.15em] text-bone/50 hover:text-flame"
          >
            Events
          </Link>
          <Link
            href="/shop"
            className="whitespace-nowrap font-body text-[11px] font-bold uppercase tracking-[0.15em] text-bone/50 hover:text-flame"
          >
            Shop
          </Link>
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="ml-auto whitespace-nowrap border border-flame px-3 py-1 font-body text-[11px] font-bold uppercase tracking-[0.15em] text-flame hover:bg-flame hover:text-ink"
            >
              Admin
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1 px-5 py-6">{children}</main>

      <BottomNav />
    </div>
  );
}
