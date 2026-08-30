"use client";

import Link from "next/link";
import type { PreviewProduct } from "@/lib/catalogue-shared";
import { getSizeGuide, type CatalogSize } from "@/lib/size-guide";
import { useCart } from "./CartProvider";
import { ProductCard } from "./ProductCard";

type HomeSection = {
  size_ml: CatalogSize;
  products: PreviewProduct[];
};

type HomeProductSectionsProps = {
  sections: HomeSection[];
};

export function HomeProductSections({ sections }: HomeProductSectionsProps) {
  const { addToCart } = useCart();

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="mb-12 max-w-xl">
        <p className="mb-3 text-[0.7rem] uppercase tracking-[0.35em] text-[var(--fg-muted)]">
          Collection
        </p>
        <h2 className="font-display text-3xl tracking-tight text-[var(--fg)] sm:text-4xl">
          Fragrances
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">
          A quick look at each size. Browse the full range in the shop.
        </p>
      </div>

      <div className="space-y-16">
        {sections.map((section) => {
          const guide = getSizeGuide(section.size_ml);
          return (
            <section
              key={section.size_ml}
              aria-labelledby={`home-size-${section.size_ml}`}
            >
              <div className="mb-6 flex flex-col gap-3 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-[var(--fg-subtle)]">
                    Size category
                  </p>
                  <h3
                    id={`home-size-${section.size_ml}`}
                    className="font-display text-3xl"
                  >
                    {section.size_ml}ml · {guide.label}
                  </h3>
                </div>
                <Link
                  href={`/shop?size=${section.size_ml}`}
                  className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
                >
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
                {section.products.map((product) => (
                  <ProductCard
                    key={`${product.item_code}-${section.size_ml}`}
                    product={product}
                    onAdd={addToCart}
                    compact
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
