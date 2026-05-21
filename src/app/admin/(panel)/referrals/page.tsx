import { getReferrals, getReferralSummary } from "@/lib/referral-data";
import { REFERRAL_STATUSES } from "@/lib/referral-data";
import { getStaff } from "@/lib/staff-data";
import { ReferralForm } from "@/components/admin/ReferralForm";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { PaidToggle } from "@/components/admin/PaidToggle";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  setReferralStatus,
  deleteReferral
} from "@/app/admin/referral-actions";
import { money, formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReferralsPage() {
  const [referrals, summary, staff] = await Promise.all([
    getReferrals(),
    getReferralSummary(),
    getStaff(true)
  ]);

  const totalOutstanding = summary.reduce((a, r) => a + r.outstanding, 0);
  const totalEarned = summary.reduce((a, r) => a + r.earned, 0);

  return (
    <div>
      <h1 className="text-5xl uppercase">Referrals</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="stat-tile">
          <p className="font-body text-[11px] uppercase tracking-widest text-bone/40">
            Total Referrals
          </p>
          <p className="stat-num mt-2">{referrals.length}</p>
        </div>
        <div className="stat-tile">
          <p className="font-body text-[11px] uppercase tracking-widest text-bone/40">
            Commission Earned
          </p>
          <p className="stat-num mt-2">{money(totalEarned)}</p>
        </div>
        <div className="stat-tile">
          <p className="font-body text-[11px] uppercase tracking-widest text-bone/40">
            Outstanding
          </p>
          <p className="stat-num mt-2 text-flame">{money(totalOutstanding)}</p>
        </div>
      </div>

      <h2 className="mt-12 text-3xl uppercase">By Staff</h2>
      <div className="mt-4 overflow-x-auto border border-concrete bg-[#0d0d0d]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-concrete font-body text-[11px] uppercase tracking-widest text-bone/40">
              <th className="px-5 py-3">Staff</th>
              <th className="px-5 py-3">Referrals</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Earned</th>
              <th className="px-5 py-3">Paid</th>
              <th className="px-5 py-3">Outstanding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete font-body text-sm">
            {summary.map((r) => (
              <tr key={r.staffId ?? "unassigned"}>
                <td className="px-5 py-3 font-display text-xl uppercase">
                  {r.name}
                </td>
                <td className="px-5 py-3 text-bone/60">{r.total}</td>
                <td className="px-5 py-3 text-bone/60">{r.joined}</td>
                <td className="px-5 py-3 text-bone/60">{money(r.earned)}</td>
                <td className="px-5 py-3 text-bone/60">{money(r.paid)}</td>
                <td className="px-5 py-3 tabular-nums text-flame">
                  {money(r.outstanding)}
                </td>
              </tr>
            ))}
            {summary.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-bone/50"
                >
                  No referrals logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-3xl uppercase">All Referrals</h2>
      <div className="mt-4 overflow-x-auto border border-concrete bg-[#0d0d0d]">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="border-b border-concrete font-body text-[11px] uppercase tracking-widest text-bone/40">
              <th className="px-5 py-3">Referred</th>
              <th className="px-5 py-3">By</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Commission</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete font-body text-sm">
            {referrals.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="px-5 py-4">
                  <span className="font-bold">{r.referred_name}</span>
                  {(r.referred_email || r.referred_phone) && (
                    <span className="mt-1 block text-xs text-bone/40">
                      {r.referred_email || r.referred_phone}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-bone/70">
                  {r.staff?.full_name ?? "—"}
                </td>
                <td className="px-5 py-4">
                  <StatusSelect
                    id={r.id}
                    current={r.status}
                    options={[...REFERRAL_STATUSES]}
                    action={setReferralStatus}
                  />
                </td>
                <td className="px-5 py-4">
                  <span className="text-bone/70">
                    {r.commission_amount != null
                      ? money(r.commission_amount)
                      : "—"}
                  </span>
                  {r.commission_amount != null && (
                    <span className="mt-1 block">
                      <PaidToggle id={r.id} paid={r.commission_paid} />
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-bone/50">
                  {formatEventDate(r.created_at.slice(0, 10))}
                </td>
                <td className="px-5 py-4 text-right">
                  <DeleteButton id={r.id} action={deleteReferral} />
                </td>
              </tr>
            ))}
            {referrals.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-bone/50">
                  No referrals yet. Log the first below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-3xl uppercase">Log a Referral</h2>
      <div className="mt-5">
        <ReferralForm staff={staff} />
      </div>
    </div>
  );
}
