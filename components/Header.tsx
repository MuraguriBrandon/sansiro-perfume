"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { useTheme } from "./ThemeProvider";

const navItems = [
  { label: "About us", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Contact us", href: "/contact" },
] as const;

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-18 sm:gap-8 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Sansiro home">
          <Image
            src="/images/logo.png"
            alt="Sansiro"
            width={120}
            height={48}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav
          className="flex flex-1 items-center justify-center gap-4 sm:gap-8"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[0.6rem] uppercase tracking-[0.18em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] sm:text-[0.65rem]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg)] transition-colors hover:bg-[var(--muted)]"
            aria-label={
              cartCount > 0 ? `Open cart, ${cartCount} items` : "Open cart"
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6 5 3H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--fg)] px-1 text-[0.6rem] font-medium leading-none text-[var(--bg)]">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg)] transition-colors hover:bg-[var(--muted)]"
            aria-label={
              theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
            {theme === "dark" ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
