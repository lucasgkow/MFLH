"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow mb-4">Order Confirmed</p>
      <h1 className="text-6xl uppercase leading-[0.9] sm:text-7xl">
        You’re In<span className="text-flame">.</span>
      </h1>
      <p className="mt-6 max-w-md font-body text-lg text-bone/75">
        Thanks for the support. A receipt is on its way to your email, and
        we’ll let you know when your order ships.
      </p>
      <Link href="/shop" className="btn-primary mt-10">
        Keep Shopping
      </Link>
    </section>
  );
}
