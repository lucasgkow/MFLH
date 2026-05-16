"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, subtotal } =
    useCart();

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-black/70 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-concrete bg-ink transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-concrete px-6 py-5">
          <h2 className="font-display text-3xl uppercase">Your Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-bone/60 hover:text-flame"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="py-16 text-center font-body text-bone/50">
              Your cart is empty.
            </p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-4 border-b border-concrete pb-5"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-zinc-900 text-center font-display text-xs text-bone/40">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      "MFLH"
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-xl uppercase">
                      {item.name}
                    </p>
                    <p className="font-body text-xs uppercase tracking-widest text-bone/50">
                      Size {item.size}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            Number(e.target.value)
                          )
                        }
                        aria-label={`Quantity for ${item.name}`}
                        className="w-16 border border-concrete bg-[#111] px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() =>
                          removeItem(item.productId, item.size)
                        }
                        className="font-body text-xs uppercase tracking-widest text-bone/40 hover:text-flame"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-display text-xl text-flame">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-concrete px-6 py-5">
          <div className="mb-4 flex justify-between font-display text-2xl uppercase">
            <span>Subtotal</span>
            <span className="text-flame">${subtotal.toFixed(2)}</span>
          </div>
          <button
            disabled={items.length === 0}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
            title="Checkout coming soon"
          >
            Checkout
          </button>
          <p className="mt-3 text-center font-body text-[11px] uppercase tracking-widest text-bone/40">
            {/* TODO: Stripe checkout not yet wired */}
            Checkout coming soon
          </p>
          <Link
            href="/shop"
            onClick={closeCart}
            className="mt-3 block text-center font-body text-xs uppercase tracking-widest text-bone/50 hover:text-flame"
          >
            Continue shopping
          </Link>
        </div>
      </aside>
    </>
  );
}
