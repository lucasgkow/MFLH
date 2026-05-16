import { adminGetContacts } from "@/lib/admin-data";
import { updateContactStatus } from "@/app/admin/actions";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUSES = ["Unread", "Read", "Replied", "Archived"];

export default async function ContactAdminPage() {
  const rows = await adminGetContacts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl uppercase">Contact Forms</h1>
        <ExportCsvButton
          rows={rows}
          columns={[
            "name",
            "email",
            "phone",
            "subject",
            "message",
            "status",
            "created_at"
          ]}
          filename="mflh-contact.csv"
        />
      </div>

      <div className="mt-8 space-y-4">
        {rows.length ? (
          rows.map((c) => (
            <details
              key={c.id}
              className="group border border-concrete bg-[#0d0d0d]"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-display text-2xl uppercase">
                    {c.name}
                    <span className="ml-3 font-body text-xs uppercase tracking-widest text-flame">
                      {c.subject || "General"}
                    </span>
                  </p>
                  <p className="font-body text-sm text-bone/60">
                    {c.email} · {formatEventDate(c.created_at.slice(0, 10))}
                  </p>
                </div>
                <span
                  className="font-body text-xs uppercase tracking-widest text-bone/40"
                  onClick={(e) => e.preventDefault()}
                >
                  <StatusSelect
                    id={c.id}
                    current={c.status}
                    options={STATUSES}
                    action={updateContactStatus}
                  />
                </span>
              </summary>
              <div className="border-t border-concrete p-5">
                <p className="whitespace-pre-line font-body text-bone/80">
                  {c.message}
                </p>
                {c.phone && (
                  <p className="mt-3 font-body text-sm text-bone/50">
                    Phone: {c.phone}
                  </p>
                )}
              </div>
            </details>
          ))
        ) : (
          <p className="border border-concrete bg-[#0d0d0d] p-10 text-center font-body text-bone/50">
            No contact submissions yet.
          </p>
        )}
      </div>
    </div>
  );
}
