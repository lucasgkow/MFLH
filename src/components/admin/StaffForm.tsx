import { saveStaff } from "@/app/admin/staff-actions";
import type { Staff } from "@/lib/types";

const ROLES = [
  "owner/coach",
  "coach",
  "trainer",
  "front desk",
  "admin"
] as const;

export function StaffForm({ staff }: { staff?: Staff }) {
  return (
    <form action={saveStaff} className="grid max-w-2xl gap-5">
      {staff && <input type="hidden" name="id" value={staff.id} />}
      <div>
        <label className="field-label" htmlFor="full_name">
          Full Name *
        </label>
        <input
          id="full_name"
          name="full_name"
          required
          defaultValue={staff?.full_name}
          className="field-input"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="field-label" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="role"
            defaultValue={staff?.role ?? "coach"}
            className="field-input"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="pin">
            Clock PIN (4–6 digits)
          </label>
          <input
            id="pin"
            name="pin"
            inputMode="numeric"
            pattern="[0-9]{4,6}"
            maxLength={6}
            defaultValue={staff?.pin ?? ""}
            placeholder="e.g. 1234"
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="hourly_rate">
            Hourly Rate ($)
          </label>
          <input
            id="hourly_rate"
            name="hourly_rate"
            type="number"
            step="0.01"
            min="0"
            defaultValue={staff?.hourly_rate ?? ""}
            placeholder="optional"
            className="field-input"
          />
        </div>
      </div>
      <label className="flex items-center gap-3 font-body text-sm text-bone/80">
        <input
          type="checkbox"
          name="active"
          defaultChecked={staff?.active ?? true}
          className="h-4 w-4 accent-flame"
        />
        Active (shows on the clock kiosk)
      </label>
      <button className="btn-primary w-fit">
        {staff ? "Save Changes" : "Add Staff"}
      </button>
    </form>
  );
}
