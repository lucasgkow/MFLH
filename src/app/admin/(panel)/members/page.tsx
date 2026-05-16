import { adminGetMembers } from "@/lib/admin-data";
import { setMemberRole } from "@/app/admin/actions";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { formatDay } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const members = await adminGetMembers();
  const csv = members.map((m) => ({
    name: m.full_name || m.display_name || "",
    display_name: m.display_name || "",
    role: m.role,
    membership_status: m.membership_status || "",
    checkins: m.checkins,
    joined: m.created_at
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl uppercase">Members</h1>
        <ExportCsvButton
          rows={csv}
          columns={[
            "name",
            "display_name",
            "role",
            "membership_status",
            "checkins",
            "joined"
          ]}
          filename="mflh-members.csv"
        />
      </div>

      <div className="mt-8 overflow-x-auto border border-concrete">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[#0d0d0d] font-body text-xs uppercase tracking-[0.15em] text-bone/50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Display</th>
              <th className="p-4">Check-ins</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete font-body text-sm">
            {members.length ? (
              members.map((m) => (
                <tr key={m.id} className="hover:bg-[#0d0d0d]">
                  <td className="p-4 font-bold">
                    {m.full_name || "—"}
                  </td>
                  <td className="p-4 text-bone/70">
                    {m.display_name || "—"}
                  </td>
                  <td className="p-4 text-bone/70">{m.checkins}</td>
                  <td className="p-4 text-bone/50">
                    {formatDay(m.created_at)}
                  </td>
                  <td className="p-4">
                    <StatusSelect
                      id={m.id}
                      current={m.role}
                      options={["member", "admin"]}
                      action={setMemberRole}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-bone/50">
                  No members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
