import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { updateProfile } from "@/app/member/actions";
import { AvatarUploader } from "@/components/member/AvatarUploader";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { user, profile } = await requireMember();
  const initials = (
    (profile?.first_name?.[0] || "") + (profile?.last_name?.[0] || "") ||
    profile?.display_name?.slice(0, 2) ||
    "AT"
  ).toUpperCase();

  return (
    <div className="space-y-6">
      <Link
        href="/member"
        className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/50 hover:text-flame"
      >
        ← Home
      </Link>
      <div>
        <p className="eyebrow">Account</p>
        <h1 className="text-5xl uppercase leading-none">Profile</h1>
        <p className="mt-2 font-body text-sm text-bone/45">{user.email}</p>
      </div>

      <form action={updateProfile} className="space-y-5">
        <AvatarUploader
          userId={user.id}
          currentUrl={profile?.avatar_url ?? null}
          initials={initials}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label" htmlFor="first_name">
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              defaultValue={profile?.first_name ?? ""}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="last_name">
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              defaultValue={profile?.last_name ?? ""}
              className="field-input"
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="display_name">
            Display Name (shown in the feed & rosters)
          </label>
          <input
            id="display_name"
            name="display_name"
            defaultValue={profile?.display_name ?? ""}
            className="field-input"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={profile?.phone ?? ""}
            className="field-input"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={profile?.bio ?? ""}
            className="field-input"
          />
        </div>

        <button className="btn-primary w-full">Save Profile</button>
      </form>

      <div className="border border-concrete bg-[#0d0d0d] p-5">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-bone/40">
          Membership
        </p>
        <p className="font-display text-3xl uppercase text-flame">
          {(profile?.membership_status || "active").toUpperCase()}
        </p>
        <p className="mt-1 font-body text-xs text-bone/40">
          Billing is handled at the front desk. Questions? Talk to a coach.
        </p>
      </div>
    </div>
  );
}
