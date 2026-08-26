"use client";

import { useEffect, useMemo, useState } from "react";
import type { CatalogProduct, PreviewProduct } from "@/lib/catalogue";
import { getSizeGuide, sizeGuide, type CatalogSize } from "@/lib/size-guide";
import { useCart } from "./CartProvider";
import { ProductCard } from "./ProductCard";

type ProductGridProps = { products: PreviewProduct[] };

function asPreview(product: CatalogProduct, size: CatalogSize = 15): PreviewProduct {
  return {
    ...product,
    preview: size === 8 ? "8ml-men" : size === 50 ? "50ml-generic" : "8ml-women",
    display_image:
      size === 8
        ? product.image_8ml
        : size === 50
          ? product.image_50ml
          : product.image_15ml,
    display_size_ml: size,
  };
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();
  const [catalogue, setCatalogue] = useState(products);
  const [gender, setGender] = useState("All");
  const [scent, setScent] = useState("All");
  const [size, setSize] = useState<CatalogSize>(15);
  const [selected, setSelected] = useState<PreviewProduct | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then(({ products: fetched }: { products: CatalogProduct[] }) =>
        setCatalogue(fetched.map((product) => asPreview(product))),
      )
      .catch(() => undefined);
  }, []);

  const scents = useMemo(
    () =>
      Array.from(
        new Set(catalogue.map((product) => product.scent_group).filter(Boolean)),
      ).sort(),
    [catalogue],
  );

  const filtered = catalogue
    .filter(
      (product) =>
        (gender === "All" || product.gender === gender) &&
        (scent === "All" || product.scent_group === scent),
    )
    .map((product) => asPreview(product, size));

  const allOutOfStock =
    filtered.length > 0 &&
    filtered.every(
      (product) => !product.variants.some((variant) => variant.available),
    );

  const categoryLabel =
    gender === "All"
      ? "Every fragrance"
      : `${gender === "Ladies" ? "Ladies'" : gender === "Men" ? "Men's" : "Unisex"} fragrances`;

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
          Inspired by the classics. Available in 8ml, 15ml, and 50ml.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2 border-y border-[var(--border)] py-4">
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
              ? "All fragrances"
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
          onChange={(event) =>
            setSize(Number(event.target.value) as CatalogSize)
          }
          className="border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[0.65rem] uppercase tracking-[0.12em] text-[var(--fg-muted)]"
        >
          <option value={8}>8ml size</option>
          <option value={15}>15ml size</option>
          <option value={50}>50ml size</option>
        </select>
      </div>

      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-[var(--fg-subtle)]">
            Category
          </p>
          <h3 className="mt-2 font-display text-2xl">{categoryLabel}</h3>
        </div>
        <p className="text-right text-xs uppercase tracking-[0.16em] text-[var(--fg-muted)]">
          {getSizeGuide(size).label} · {size}ml
        </p>
      </div>

      {allOutOfStock && (
        <p className="mb-6 border border-rose-900/40 bg-rose-950/20 px-4 py-3 text-xs uppercase tracking-[0.14em] text-rose-300">
          Everything in this selection is currently sold out.
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="border border-dashed border-[var(--border)] px-6 py-20 text-center">
          <h3 className="font-display text-2xl">Nothing matches those filters.</h3>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            Try another gender or scent group.
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {sizeGuide.map((guide) => {
            const sizeProducts = filtered
              .map((product) => asPreview(product, guide.size_ml))
              .filter((product) =>
                product.variants.some(
                  (variant) => variant.size_ml === guide.size_ml,
                ),
              );
            return (
              <section key={guide.size_ml} aria-labelledby={`size-${guide.size_ml}`}>
                <div className="mb-6 flex flex-col gap-2 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.25em] text-[var(--fg-subtle)]">
                      Size category
                    </p>
                    <h3
                      id={`size-${guide.size_ml}`}
                      className="font-display text-3xl"
                    >
                      {guide.size_ml}ml · {guide.label}
                    </h3>
                  </div>
                  <p className="max-w-sm text-xs leading-5 text-[var(--fg-muted)]">
                    {guide.packaging}. {guide.usage}.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                  {sizeProducts.map((product) => (
                    <ProductCard
                      key={`${product.item_code}-${guide.size_ml}`}
                      product={product}
                      onSelect={setSelected}
                      onAdd={addToCart}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={addToCart}
        />
      )}
    </section>
  );
}

function ProductModal({
  product,
  onClose,
  onAdd,
}: {
  product: PreviewProduct;
  onClose: () => void;
  onAdd: (product: PreviewProduct, size: number) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-[var(--bg)] p-6 sm:p-10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="text-2xl text-[var(--fg-muted)]"
          >
            &times;
          </button>
        </div>
        <div className="grid gap-8 sm:grid-cols-[minmax(180px,0.8fr)_1fr]">
          <img
            src={product.display_image}
            alt={product.code_name}
            className="mx-auto h-64 object-contain"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--fg-subtle)]">
              {product.designer} · {product.gender}
            </p>
            <h2 className="mt-3 font-display text-4xl">{product.code_name}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--fg-muted)]">
              {product.scent_group || "Signature blend"}.{" "}
              {product.notes.slice(0, 6).join(" · ")}.
            </p>
            <div className="mt-8 space-y-3">
              {product.variants.map((variant) => (
                <div
                  key={variant.size_ml}
                  className="flex items-center justify-between border-t border-[var(--border)] py-3"
                >
                  <span>{variant.size_ml}ml</span>
                  <button
                    type="button"
                    disabled={!variant.available}
                    onClick={() => onAdd(product, variant.size_ml)}
                    className="border border-[var(--fg)] px-3 py-2 text-xs uppercase tracking-[0.15em] disabled:border-[var(--border)] disabled:text-[var(--fg-subtle)]"
                  >
                    {variant.available ? "Add to cart" : "Sold out"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
