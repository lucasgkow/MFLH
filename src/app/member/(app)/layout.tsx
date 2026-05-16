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
  const name = profile?.display_name || profile?.full_name || "Athlete";

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-ink">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-concrete bg-ink/95 px-5 py-4 backdrop-blur">
        <Link href="/member" className="font-display text-2xl uppercase">
          MFLH<span className="text-flame">.</span>
        </Link>
        <div className="flex items-center gap-4">
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="font-body text-[11px] font-bold uppercase tracking-[0.15em] text-bone/50 hover:text-flame"
            >
              Admin
            </Link>
          )}
          <Link
            href="/member/profile"
            className="font-body text-[11px] font-bold uppercase tracking-[0.15em] text-bone/70 hover:text-flame"
          >
            {name}
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
      </header>

      <main className="flex-1 px-5 py-6">{children}</main>

      <BottomNav />
    </div>
  );
}
