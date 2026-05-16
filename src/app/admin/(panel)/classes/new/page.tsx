import { ClassForm } from "@/components/admin/ClassForm";

export default function NewClassPage() {
  return (
    <div>
      <h1 className="text-5xl uppercase">New Class</h1>
      <div className="mt-8">
        <ClassForm />
      </div>
    </div>
  );
}
