import Link from "next/link";
import { getStaff } from "@/lib/staff-data";
import { StaffForm } from "@/components/admin/StaffForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteStaff } from "@/app/admin/staff-actions";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ManageStaffPage() {
  const staff = await getStaff();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-3">
        <h1 className="text-5xl uppercase">Manage Staff</h1>
        <Link
          href="/admin/staff"
          className="font-body text-xs font-bold uppercase tracking-widest text-bone/60 hover:text-flame"
        >
          ← Back to Clock
        </Link>
      </div>

      <div className="overflow-x-auto border border-concrete bg-[#0d0d0d]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-concrete font-body text-[11px] uppercase tracking-widest text-bone/40">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">PIN</th>
              <th className="px-5 py-3">Rate</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete">
            {staff.map((s) => (
              <tr key={s.id} className="font-body text-sm">
                <td className="px-5 py-4 font-display text-xl uppercase">
                  {s.full_name}
                </td>
                <td className="px-5 py-4 text-bone/60">{s.role}</td>
                <td className="px-5 py-4">
                  {s.pin ? (
                    <span className="text-bone/60">Set</span>
                  ) : (
                    <span className="text-flame">Not set</span>
                  )}
                </td>
                <td className="px-5 py-4 text-bone/60">
                  {s.hourly_rate != null ? money(s.hourly_rate) : "—"}
                </td>
                <td className="px-5 py-4">
                  {s.active ? (
                    <span className="text-bone/60">Active</span>
                  ) : (
                    <span className="text-bone/30">Inactive</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/staff/manage/${s.id}`}
                      className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/50 hover:text-flame"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={s.id} action={deleteStaff} />
                  </div>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center font-body text-bone/50"
                >
                  No staff yet. Add your first below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-3xl uppercase">Add Staff</h2>
      <div className="mt-5">
        <StaffForm />
      </div>
    </div>
  );
}
