"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/lib/types";

export function AddToCart({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const sizes = product.sizes?.length ? product.sizes : ["OS"];
  const [size, setSize] = useState(sizes[0]);
  const [added, setAdded] = useState(false);

  function add() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      size,
      quantity: 1,
      imageUrl: product.image_url
    });
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      <p className="field-label">Size</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`min-w-[3rem] border px-4 py-3 font-display text-xl uppercase transition-colors ${
              size === s
                ? "border-flame bg-flame text-ink"
                : "border-concrete text-bone/70 hover:border-bone"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        onClick={add}
        disabled={!product.in_stock}
        className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        {!product.in_stock
          ? "Sold Out"
          : added
            ? "Added ✓"
            : "Add To Cart"}
      </button>
      <p className="mt-3 font-body text-[11px] uppercase tracking-widest text-bone/40">
        Secure checkout via Square
      </p>
    </div>
  );
}
