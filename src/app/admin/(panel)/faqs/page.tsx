import { adminGetFaqs } from "@/lib/admin-data";
import { saveFaq, deleteFaq } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function FaqAdminPage() {
  const faqs = await adminGetFaqs();

  return (
    <div>
      <h1 className="text-5xl uppercase">FAQs</h1>

      <h2 className="mt-10 text-2xl uppercase text-flame">Add FAQ</h2>
      <form
        action={saveFaq}
        className="mt-4 grid max-w-2xl gap-4 border border-concrete bg-[#0d0d0d] p-6"
      >
        <div>
          <label className="field-label" htmlFor="q">
            Question
          </label>
          <input id="q" name="question" required className="field-input" />
        </div>
        <div>
          <label className="field-label" htmlFor="a">
            Answer
          </label>
          <textarea
            id="a"
            name="answer"
            rows={3}
            required
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="o">
            Display Order
          </label>
          <input
            id="o"
            name="display_order"
            type="number"
            defaultValue={faqs.length}
            className="field-input w-32"
          />
        </div>
        <button className="btn-primary w-fit">Add FAQ</button>
      </form>

      <h2 className="mt-12 text-2xl uppercase">Existing</h2>
      <div className="mt-4 space-y-4">
        {faqs.length ? (
          faqs.map((f) => (
            <form
              key={f.id}
              action={saveFaq}
              className="grid gap-3 border border-concrete bg-[#0d0d0d] p-5"
            >
              <input type="hidden" name="id" value={f.id} />
              <div className="flex items-center justify-between">
                <span className="font-body text-xs uppercase tracking-widest text-bone/40">
                  Order
                </span>
                <DeleteButton id={f.id} action={deleteFaq} />
              </div>
              <input
                name="question"
                defaultValue={f.question}
                className="field-input font-bold"
              />
              <textarea
                name="answer"
                defaultValue={f.answer}
                rows={3}
                className="field-input"
              />
              <div className="flex items-center gap-3">
                <input
                  name="display_order"
                  type="number"
                  defaultValue={f.display_order}
                  className="field-input w-24"
                />
                <button className="border border-concrete px-5 py-2 font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/80 hover:border-flame hover:text-flame">
                  Save
                </button>
              </div>
            </form>
          ))
        ) : (
          <p className="border border-concrete bg-[#0d0d0d] p-10 text-center font-body text-bone/50">
            No FAQs yet.
          </p>
        )}
      </div>
    </div>
  );
}
