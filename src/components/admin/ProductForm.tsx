import { saveProduct } from "@/app/admin/actions";
import { PRODUCT_SIZES } from "@/lib/constants";
import type { Product } from "@/lib/types";

export function ProductForm({ product }: { product?: Product }) {
  return (
    <form action={saveProduct} className="grid max-w-2xl gap-5">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div>
        <label className="field-label" htmlFor="name">
          Name *
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={product?.name}
          className="field-input"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="slug">
            Slug (auto if blank)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="price">
            Price (USD) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={product?.price}
            className="field-input"
          />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          className="field-input"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="image_url">
          Image URL
        </label>
        <input
          id="image_url"
          name="image_url"
          defaultValue={product?.image_url ?? ""}
          className="field-input"
        />
      </div>
      <div>
        <p className="field-label">Sizes</p>
        <div className="flex flex-wrap gap-4">
          {PRODUCT_SIZES.map((s) => (
            <label
              key={s}
              className="flex items-center gap-2 font-body text-sm text-bone/80"
            >
              <input
                type="checkbox"
                name="sizes"
                value={s}
                defaultChecked={product?.sizes?.includes(s)}
                className="h-4 w-4 accent-flame"
              />
              {s}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-8">
        <label className="flex items-center gap-3 font-body text-sm text-bone/80">
          <input
            type="checkbox"
            name="in_stock"
            defaultChecked={product?.in_stock ?? true}
            className="h-4 w-4 accent-flame"
          />
          In stock
        </label>
        <label className="flex items-center gap-3 font-body text-sm text-bone/80">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured ?? false}
            className="h-4 w-4 accent-flame"
          />
          Featured
        </label>
      </div>
      <button className="btn-primary w-fit">
        {product ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}
