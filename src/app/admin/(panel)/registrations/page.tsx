import { adminGetRegistrations } from "@/lib/admin-data";
import { updateRegistrationStatus } from "@/app/admin/actions";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUSES = ["New", "Contacted", "Converted", "Archived"];

export default async function RegistrationsPage() {
  const rows = await adminGetRegistrations();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl uppercase">Registrations</h1>
        <ExportCsvButton
          rows={rows}
          columns={[
            "name",
            "email",
            "phone",
            "goal",
            "referral_source",
            "status",
            "created_at"
          ]}
          filename="mflh-registrations.csv"
        />
      </div>

      <div className="mt-8 overflow-x-auto border border-concrete">
        <table className="w-full min-w-[820px] text-left">
          <thead className="bg-[#0d0d0d] font-body text-xs uppercase tracking-[0.15em] text-bone/50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Goal</th>
              <th className="p-4">Submitted</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete font-body text-sm">
            {rows.length ? (
              rows.map((r) => (
                <tr key={r.id} className="align-top hover:bg-[#0d0d0d]">
                  <td className="p-4 font-bold">{r.name}</td>
                  <td className="p-4 text-bone/70">{r.email}</td>
                  <td className="p-4 text-bone/70">{r.phone || "—"}</td>
                  <td className="p-4 text-bone/70">{r.goal || "—"}</td>
                  <td className="p-4 text-bone/50">
                    {formatEventDate(r.created_at.slice(0, 10))}
                  </td>
                  <td className="p-4">
                    <StatusSelect
                      id={r.id}
                      current={r.status}
                      options={STATUSES}
                      action={updateRegistrationStatus}
                    />
                    {r.message && (
                      <p className="mt-2 max-w-xs text-xs text-bone/50">
                        {r.message}
                      </p>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-10 text-center text-bone/50">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
