import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "@/app/admin/actions";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/contact", label: "Contact Forms" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/events/registrations", label: "Event Sign-ups" },
  { href: "/admin/shop", label: "Shop" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/referrals", label: "Referrals" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/settings", label: "Settings" }
];

export default async function AdminPanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-ink lg:flex-row">
      <aside className="border-b border-concrete bg-[#0b0b0b] lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-6">
          <Link href="/admin" className="font-display text-3xl uppercase">
            MFLH<span className="text-flame">.</span>
          </Link>
          <Link
            href="/"
            className="font-body text-[11px] uppercase tracking-widest text-bone/40 hover:text-flame"
          >
            View site →
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-6">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap px-4 py-2.5 font-body text-sm font-bold uppercase tracking-[0.12em] text-bone/60 hover:bg-concrete hover:text-flame"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-concrete p-6 lg:block">
          <p className="font-body text-[11px] text-bone/40">
            {user.email}
          </p>
          <form action={signOut}>
            <button className="mt-2 font-body text-xs font-bold uppercase tracking-widest text-flame hover:underline">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
