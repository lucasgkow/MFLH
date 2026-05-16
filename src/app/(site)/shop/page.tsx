import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop",
  description: "MFLH Collective merch — hoodies, tees, and headwear."
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <section className="container-site py-20">
      <p className="eyebrow mb-4">The Shop</p>
      <h1 className="text-6xl uppercase leading-[0.9] sm:text-8xl">
        Wear The Work<span className="text-flame">.</span>
      </h1>
      <p className="mt-6 max-w-xl font-body text-lg text-bone/75">
        Built for training. Worn everywhere else.
      </p>

      {products.length ? (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-14 border border-concrete bg-[#0d0d0d] p-12 text-center font-body text-bone/50">
          Merch loads from Supabase once the project is connected. Seed data
          ships with three drops: Gym Class Hoodie, Perfect Match Tee, and the
          Real Tree Snapback.
        </p>
      )}
    </section>
  );
}
