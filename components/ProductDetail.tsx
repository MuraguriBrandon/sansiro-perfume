"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/catalogue-shared";
import { asPreviewProduct, getProductImage } from "@/lib/catalogue-shared";
import { formatPrice } from "@/lib/format";
import { getSizeGuide, type CatalogSize } from "@/lib/size-guide";
import { useCart } from "./CartProvider";

type ProductDetailProps = {
  product: CatalogProduct;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart();
  const sortedVariants = useMemo(
    () =>
      [...product.variants].sort((a, b) => a.size_ml - b.size_ml),
    [product.variants],
  );

  const firstAvailable = sortedVariants.find((variant) => variant.available);
  const [selectedSize, setSelectedSize] = useState<CatalogSize>(
    (firstAvailable?.size_ml as CatalogSize) ??
      (sortedVariants[0]?.size_ml as CatalogSize) ??
      15,
  );

  const selectedVariant = sortedVariants.find(
    (variant) => variant.size_ml === selectedSize,
  );
  const imageSrc = getProductImage(product, selectedSize);
  const guide = getSizeGuide(selectedSize);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <Link
        href="/shop"
        className="mb-10 inline-block text-[0.65rem] uppercase tracking-[0.2em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
      >
        ← Back to shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-[var(--bg-elevated)]">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,var(--glow),transparent_60%)]"
            aria-hidden="true"
          />
          <Image
            src={imageSrc}
            alt={`${product.code_name} ${selectedSize}ml`}
            width={420}
            height={560}
            priority
            className="relative z-10 h-[78%] w-auto object-contain"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[0.7rem] uppercase tracking-[0.35em] text-[var(--fg-muted)]">
            {product.designer} · {product.gender}
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-[var(--fg)] sm:text-5xl">
            {product.code_name}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
            {product.item_code}
          </p>

          {product.scent_group && (
            <p className="mt-6 inline-flex w-fit border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-[var(--fg-muted)]">
              {product.scent_group}
            </p>
          )}

          {product.notes.length > 0 && (
            <p className="mt-6 text-sm leading-7 text-[var(--fg-muted)]">
              {product.notes.join(" · ")}
            </p>
          )}

          <div className="mt-10">
            <p className="mb-3 text-[0.65rem] uppercase tracking-[0.25em] text-[var(--fg-subtle)]">
              Variants
            </p>
            <div className="space-y-0 border-t border-[var(--border)]">
              {sortedVariants.map((variant) => {
                const active = variant.size_ml === selectedSize;
                const sizeGuide = getSizeGuide(variant.size_ml as CatalogSize);
                return (
                  <button
                    key={variant.size_ml}
                    type="button"
                    onClick={() =>
                      setSelectedSize(variant.size_ml as CatalogSize)
                    }
                    className={`flex w-full items-center justify-between gap-4 border-b border-[var(--border)] py-4 text-left transition-colors ${
                      active ? "bg-[var(--muted)]/60" : "hover:bg-[var(--muted)]/40"
                    }`}
                  >
                    <div>
                      <p className="text-sm text-[var(--fg)]">
                        {variant.size_ml}ml · {sizeGuide.label}
                      </p>
                      <p className="mt-1 text-xs text-[var(--fg-subtle)]">
                        {sizeGuide.packaging}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--fg)]">
                        {formatPrice(variant.price)}
                      </p>
                      <p
                        className={`mt-1 text-[0.65rem] uppercase tracking-[0.14em] ${
                          variant.available
                            ? "text-emerald-500"
                            : "text-rose-400"
                        }`}
                      >
                        {variant.available ? "In stock" : "Sold out"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedVariant && (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--fg-muted)]">
                  {selectedSize}ml · {guide.label}
                </p>
                <p className="mt-1 font-display text-3xl text-[var(--fg)]">
                  {formatPrice(selectedVariant.price)}
                </p>
              </div>
              <button
                type="button"
                disabled={!selectedVariant.available}
                onClick={() =>
                  addToCart(
                    asPreviewProduct(product, selectedSize),
                    selectedSize,
                  )
                }
                className="border border-[var(--fg)] px-6 py-3 text-[0.65rem] uppercase tracking-[0.18em] text-[var(--fg)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)] disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:text-[var(--fg-subtle)] disabled:hover:bg-transparent disabled:hover:text-[var(--fg-subtle)]"
              >
                {selectedVariant.available ? "Add to cart" : "Sold out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
