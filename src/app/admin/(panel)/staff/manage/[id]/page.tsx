import Link from "next/link";
import { notFound } from "next/navigation";
import { getStaff } from "@/lib/staff-data";
import { StaffForm } from "@/components/admin/StaffForm";

export const dynamic = "force-dynamic";

export default async function EditStaffPage({
  params
}: {
  params: { id: string };
}) {
  const staff = (await getStaff()).find((s) => s.id === params.id);
  if (!staff) notFound();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-3">
        <h1 className="text-5xl uppercase">Edit Staff</h1>
        <Link
          href="/admin/staff/manage"
          className="font-body text-xs font-bold uppercase tracking-widest text-bone/60 hover:text-flame"
        >
          ← All Staff
        </Link>
      </div>
      <StaffForm staff={staff} />
    </div>
  );
}
