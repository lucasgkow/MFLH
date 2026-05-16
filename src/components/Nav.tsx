"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { useCart } from "@/components/cart/CartProvider";

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-concrete bg-ink/90 backdrop-blur">
      <nav className="container-site flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-3xl uppercase tracking-wide"
          onClick={() => setMobileOpen(false)}
        >
          MFLH<span className="text-flame">.</span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-body text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:text-flame ${
                  pathname === link.href ? "text-flame" : "text-bone/80"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/80 hover:text-flame"
          >
            Cart
            {count > 0 && (
              <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center bg-flame text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </button>
          <Link href="/get-started" className="hidden sm:block">
            <span className="bg-flame px-5 py-2 font-display text-lg uppercase tracking-wide text-ink transition-colors hover:bg-bone">
              Start Training
            </span>
          </Link>
          <button
            className="lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="font-display text-2xl">
              {mobileOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-concrete bg-ink lg:hidden">
          <ul className="container-site flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 font-display text-2xl uppercase tracking-wide text-bone/90 hover:text-flame"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/get-started"
                onClick={() => setMobileOpen(false)}
                className="mt-3 block bg-flame py-3 text-center font-display text-2xl uppercase text-ink"
              >
                Start Training
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
