import { ProgramForm } from "@/components/admin/ProgramForm";

export default function NewProgramPage() {
  return (
    <div>
      <h1 className="text-5xl uppercase">New Program</h1>
      <p className="mt-2 font-body text-sm text-bone/50">
        Create the program, then add weekly workouts on the next screen.
      </p>
      <div className="mt-8">
        <ProgramForm />
      </div>
    </div>
  );
}
