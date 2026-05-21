import Link from "next/link";
import { getKioskRoster } from "@/lib/staff-data";
import { StaffClock } from "@/components/admin/StaffClock";

export const dynamic = "force-dynamic";

export default async function StaffKioskPage() {
  const roster = await getKioskRoster();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-5xl uppercase">Staff</h1>
        <div className="flex gap-4">
          <Link
            href="/admin/staff/manage"
            className="font-body text-xs font-bold uppercase tracking-widest text-bone/60 hover:text-flame"
          >
            Manage Staff →
          </Link>
          <Link
            href="/admin/staff/hours"
            className="font-body text-xs font-bold uppercase tracking-widest text-bone/60 hover:text-flame"
          >
            Hours & Payroll →
          </Link>
        </div>
      </div>

      <StaffClock roster={roster} />
    </div>
  );
}
