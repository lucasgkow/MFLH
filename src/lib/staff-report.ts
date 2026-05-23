// Plain server-side helpers for the staff Hours & Payroll report. Kept out of
// the "use server" actions file because that file may only export async server
// actions — constants and sync helpers must live separately.

export const REPORT_COOKIE = "mflh_report_ok";

export function reportPin(): string {
  return process.env.STAFF_REPORT_PIN || "0000";
}

export function reportPinIsDefault(): boolean {
  return !process.env.STAFF_REPORT_PIN;
}
