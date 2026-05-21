import { saveReferral } from "@/app/admin/referral-actions";
import { REFERRAL_STATUSES } from "@/lib/referral-data";
import type { Referral, Staff } from "@/lib/types";

export function ReferralForm({
  staff,
  referral
}: {
  staff: Staff[];
  referral?: Referral;
}) {
  return (
    <form action={saveReferral} className="grid max-w-2xl gap-5">
      {referral && <input type="hidden" name="id" value={referral.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="staff_id">
            Referred By *
          </label>
          <select
            id="staff_id"
            name="staff_id"
            required
            defaultValue={referral?.staff_id ?? ""}
            className="field-input"
          >
            <option value="">Select staff…</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={referral?.status ?? "Lead"}
            className="field-input"
          >
            {REFERRAL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="referred_name">
          Referred Person *
        </label>
        <input
          id="referred_name"
          name="referred_name"
          required
          defaultValue={referral?.referred_name}
          className="field-input"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="referred_email">
            Email
          </label>
          <input
            id="referred_email"
            name="referred_email"
            type="email"
            defaultValue={referral?.referred_email ?? ""}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="referred_phone">
            Phone
          </label>
          <input
            id="referred_phone"
            name="referred_phone"
            defaultValue={referral?.referred_phone ?? ""}
            className="field-input"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="commission_amount">
            Commission ($)
          </label>
          <input
            id="commission_amount"
            name="commission_amount"
            type="number"
            step="0.01"
            min="0"
            defaultValue={referral?.commission_amount ?? ""}
            placeholder="optional"
            className="field-input"
          />
        </div>
        <label className="flex items-end gap-3 pb-3 font-body text-sm text-bone/80">
          <input
            type="checkbox"
            name="commission_paid"
            defaultChecked={referral?.commission_paid ?? false}
            className="h-4 w-4 accent-flame"
          />
          Commission paid
        </label>
      </div>
      <div>
        <label className="field-label" htmlFor="note">
          Note
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          defaultValue={referral?.note ?? ""}
          className="field-input"
        />
      </div>
      <button className="btn-primary w-fit">
        {referral ? "Save Changes" : "Log Referral"}
      </button>
    </form>
  );
}
