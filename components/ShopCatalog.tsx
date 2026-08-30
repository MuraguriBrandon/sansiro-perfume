"use client";

import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/catalogue-shared";
import { asPreviewProduct } from "@/lib/catalogue-shared";
import type { CatalogSize } from "@/lib/size-guide";
import { useCart } from "./CartProvider";
import { ShopProductCard } from "./ShopProductCard";

type ShopCatalogProps = {
  products: CatalogProduct[];
  initialSize?: CatalogSize | "All";
};

export function ShopCatalog({
  products,
  initialSize = "All",
}: ShopCatalogProps) {
  const { addToCart } = useCart();
  const [gender, setGender] = useState("All");
  const [scent, setScent] = useState("All");
  const [size, setSize] = useState<CatalogSize | "All">(initialSize);
  const [query, setQuery] = useState("");

  const scents = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.scent_group).filter(Boolean)),
      ).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesGender = gender === "All" || product.gender === gender;
      const matchesScent = scent === "All" || product.scent_group === scent;
      const matchesSize =
        size === "All" ||
        product.variants.some((variant) => variant.size_ml === size);
      const matchesQuery =
        !needle ||
        product.code_name.toLowerCase().includes(needle) ||
        product.designer.toLowerCase().includes(needle) ||
        product.item_code.toLowerCase().includes(needle) ||
        product.scent_group.toLowerCase().includes(needle);

      return matchesGender && matchesScent && matchesSize && matchesQuery;
    });
  }, [products, gender, scent, size, query]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 max-w-xl">
        <p className="mb-3 text-[0.7rem] uppercase tracking-[0.35em] text-[var(--fg-muted)]">
          Shop
        </p>
        <h1 className="font-display text-4xl tracking-tight text-[var(--fg)] sm:text-5xl">
          All fragrances
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">
          Filter by gender, size, and scent — or search by name.
        </p>
      </div>

      <div className="mb-10 space-y-4 border-y border-[var(--border)] py-5">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search fragrances, designers, codes…"
          className="w-full border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-subtle)] focus:border-[var(--fg-muted)]"
          aria-label="Search products"
        />

        <div className="flex flex-wrap gap-2">
          {["All", "Men", "Ladies", "Unisex"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setGender(option)}
              className={`px-3 py-2 text-[0.65rem] uppercase tracking-[0.18em] ${
                gender === option
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "border border-[var(--border)] text-[var(--fg-muted)]"
              }`}
            >
              {option === "All"
                ? "All genders"
                : option === "Ladies"
                  ? "Ladies'"
                  : option === "Men"
                    ? "Men's"
                    : "Unisex"}
            </button>
          ))}

          <select
            value={scent}
            onChange={(event) => setScent(event.target.value)}
            className="border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[0.65rem] uppercase tracking-[0.12em] text-[var(--fg-muted)]"
            aria-label="Filter by scent group"
          >
            <option value="All">All scent groups</option>
            {scents.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={size}
            onChange={(event) => {
              const value = event.target.value;
              setSize(value === "All" ? "All" : (Number(value) as CatalogSize));
            }}
            className="border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[0.65rem] uppercase tracking-[0.12em] text-[var(--fg-muted)]"
            aria-label="Filter by size"
          >
            <option value="All">All sizes</option>
            <option value={8}>8ml</option>
            <option value={15}>15ml</option>
            <option value={50}>50ml</option>
          </select>
        </div>
      </div>

      <p className="mb-8 text-xs uppercase tracking-[0.16em] text-[var(--fg-muted)]">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-[var(--border)] px-6 py-20 text-center">
          <h2 className="font-display text-2xl">Nothing matches.</h2>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            Try another search or clear a filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ShopProductCard
              key={product.item_code}
              product={product}
              preferredSize={size}
              onAdd={(item, selectedSize) =>
                addToCart(asPreviewProduct(item, selectedSize as CatalogSize), selectedSize)
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
