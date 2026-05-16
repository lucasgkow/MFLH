import Link from "next/link";
import {
  adminDashboardStats,
  adminGetRegistrations,
  adminGetContacts
} from "@/lib/admin-data";
import { StatCard } from "@/components/admin/StatCard";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, regs, contacts] = await Promise.all([
    adminDashboardStats(),
    adminGetRegistrations(),
    adminGetContacts()
  ]);

  const activity = [
    ...regs.slice(0, 5).map((r) => ({
      id: r.id,
      when: r.created_at,
      text: `New registration — ${r.name}`,
      href: "/admin/registrations"
    })),
    ...contacts.slice(0, 5).map((c) => ({
      id: c.id,
      when: c.created_at,
      text: `Contact form — ${c.name} (${c.subject || "General"})`,
      href: "/admin/contact"
    }))
  ]
    .sort((a, b) => +new Date(b.when) - +new Date(a.when))
    .slice(0, 8);

  return (
    <div>
      <h1 className="text-5xl uppercase">Dashboard</h1>
      {!stats.configured && (
        <p className="mt-4 border border-concrete bg-[#0d0d0d] p-4 font-body text-sm text-bone/60">
          Supabase service role not configured — showing zeros. Set the env
          vars and run the migration to go live.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New (7d)" value={stats.newRegistrations} />
        <StatCard label="Pending Contacts" value={stats.pendingContacts} />
        <StatCard label="Upcoming Events" value={stats.upcomingEvents} />
        <StatCard label="Products" value={stats.totalProducts} />
      </div>

      <h2 className="mt-12 text-3xl uppercase">Recent Activity</h2>
      <div className="mt-4 divide-y divide-concrete border border-concrete bg-[#0d0d0d]">
        {activity.length ? (
          activity.map((a) => (
            <Link
              key={a.id}
              href={a.href}
              className="flex items-center justify-between px-5 py-4 hover:bg-concrete"
            >
              <span className="font-body text-sm text-bone/80">
                {a.text}
              </span>
              <span className="font-body text-xs text-bone/40">
                {formatEventDate(a.when.slice(0, 10))}
              </span>
            </Link>
          ))
        ) : (
          <p className="px-5 py-6 font-body text-sm text-bone/50">
            No activity yet.
          </p>
        )}
      </div>
    </div>
  );
}
