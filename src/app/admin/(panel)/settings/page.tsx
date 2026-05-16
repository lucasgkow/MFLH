import { adminGetSettings } from "@/lib/admin-data";
import { saveSettings } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const FIELDS: { key: string; label: string }[] = [
  { key: "gym_address", label: "Gym Address" },
  { key: "gym_phone", label: "Phone" },
  { key: "gym_email", label: "Email" },
  { key: "instagram_main", label: "Instagram — @movefastliftheavy" },
  { key: "instagram_collective", label: "Instagram — @mflhcollective" },
  { key: "instagram_chris", label: "Instagram — @iamchrisharris" },
  { key: "facebook", label: "Facebook URL" }
];

export default async function SettingsPage() {
  const settings = await adminGetSettings();

  return (
    <div>
      <h1 className="text-5xl uppercase">Settings</h1>
      <p className="mt-2 font-body text-sm text-bone/50">
        Site config stored in the <code>site_settings</code> table.
      </p>

      <form action={saveSettings} className="mt-8 grid max-w-2xl gap-5">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="field-label" htmlFor={f.key}>
              {f.label}
            </label>
            <input
              id={f.key}
              name={f.key}
              defaultValue={settings[f.key] ?? ""}
              className="field-input"
            />
          </div>
        ))}
        <button className="btn-primary w-fit">Save Settings</button>
      </form>
    </div>
  );
}
