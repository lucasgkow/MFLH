import { adminGetEventRegistrations } from "@/lib/admin-data";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EventRegistrationsPage() {
  const rows = await adminGetEventRegistrations();

  const grouped = rows.reduce<Record<string, typeof rows>>((acc, r) => {
    const key = r.events?.title || "Unknown event";
    (acc[key] ||= []).push(r);
    return acc;
  }, {});

  const csvRows = rows.map((r) => ({
    event: r.events?.title || "",
    name: r.name,
    email: r.email,
    phone: r.phone || "",
    registered_at: r.created_at
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl uppercase">Event Sign-ups</h1>
        <ExportCsvButton
          rows={csvRows}
          columns={["event", "name", "email", "phone", "registered_at"]}
          filename="mflh-event-registrations.csv"
        />
      </div>

      <div className="mt-8 space-y-8">
        {Object.keys(grouped).length ? (
          Object.entries(grouped).map(([title, list]) => (
            <div key={title} className="border border-concrete">
              <div className="flex items-center justify-between bg-[#0d0d0d] p-4">
                <p className="font-display text-2xl uppercase">{title}</p>
                <span className="font-body text-xs uppercase tracking-widest text-flame">
                  {list.length} registered
                </span>
              </div>
              <table className="w-full text-left">
                <thead className="font-body text-xs uppercase tracking-[0.15em] text-bone/50">
                  <tr className="border-t border-concrete">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-concrete font-body text-sm">
                  {list.map((r) => (
                    <tr key={r.id}>
                      <td className="p-4 font-bold">{r.name}</td>
                      <td className="p-4 text-bone/70">{r.email}</td>
                      <td className="p-4 text-bone/70">
                        {r.phone || "—"}
                      </td>
                      <td className="p-4 text-bone/50">
                        {formatEventDate(r.created_at.slice(0, 10))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p className="border border-concrete bg-[#0d0d0d] p-10 text-center font-body text-bone/50">
            No event registrations yet.
          </p>
        )}
      </div>
    </div>
  );
}
