import { notFound } from "next/navigation";
import { adminGetProduct } from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params
}: {
  params: { id: string };
}) {
  const product = await adminGetProduct(params.id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-5xl uppercase">Edit Product</h1>
      <p className="mt-2 font-body text-sm text-bone/50">{product.name}</p>
      <div className="mt-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
