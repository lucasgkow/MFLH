import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getShopProduct } from "@/lib/data";
import { money } from "@/lib/format";
import { AddToCart } from "@/components/AddToCart";

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getShopProduct(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description ?? undefined
  };
}

export default async function ProductPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await getShopProduct(params.slug);
  if (!product) notFound();

  return (
    <section className="container-site py-16">
      <Link
        href="/shop"
        className="font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/60 hover:text-flame"
      >
        ← Shop
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden border border-concrete bg-zinc-900">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div
              role="img"
              aria-label={`Placeholder for ${product.name} — product photo pending`}
              className="flex h-full flex-col items-center justify-center gap-3 text-center"
            >
              <span className="font-display text-7xl text-bone/10">
                MFLH
              </span>
              <span className="font-body text-xs uppercase tracking-[0.2em] text-bone/30">
                [MISSING: product photo — recommend flat-lay on dark surface]
              </span>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-5xl uppercase leading-[0.9] sm:text-6xl">
            {product.name}
          </h1>
          <p className="mt-4 font-display text-4xl text-flame">
            {money(product.price)}
          </p>
          <p className="mt-6 font-body text-bone/75">
            {product.description}
          </p>
          <div className="mt-8">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}
