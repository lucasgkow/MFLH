import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col border border-concrete bg-[#0d0d0d] transition-colors hover:border-flame"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            role="img"
            aria-label={`Placeholder for ${product.name} — product photo pending`}
            className="flex h-full flex-col items-center justify-center gap-2 text-center"
          >
            <span className="font-display text-5xl text-bone/10">MFLH</span>
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-bone/30">
              [Product photo pending]
            </span>
          </div>
        )}
        {!product.in_stock && (
          <span className="absolute right-4 top-4 bg-concrete px-3 py-1 font-body text-[11px] font-bold uppercase tracking-widest text-bone/70">
            Sold Out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl uppercase leading-none">{product.name}</h3>
        <p className="mt-2 font-body text-sm text-bone/60 line-clamp-2">
          {product.description}
        </p>
        <p className="mt-auto pt-4 font-display text-3xl text-flame">
          {money(product.price)}
        </p>
      </div>
    </Link>
  );
}
