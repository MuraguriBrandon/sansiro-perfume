import type { PreviewProduct } from "@/lib/catalogue";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: PreviewProduct[];
};

export function ProductGrid({ products }: ProductGridProps) {
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
          Inspired by the classics. Available in 8ml and 50ml.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={`${product.item_code}-${product.preview}`}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
