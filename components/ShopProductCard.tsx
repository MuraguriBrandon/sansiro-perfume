"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/catalogue-shared";
import { getProductImage } from "@/lib/catalogue-shared";
import { formatPrice } from "@/lib/format";
import type { CatalogSize } from "@/lib/size-guide";

type ShopProductCardProps = {
  product: CatalogProduct;
  preferredSize: CatalogSize | "All";
  onAdd: (product: CatalogProduct, size: number) => void;
};

function pickDefaultSize(
  product: CatalogProduct,
  preferredSize: CatalogSize | "All",
): CatalogSize | null {
  const available = product.variants
    .filter((variant) => variant.available)
    .map((variant) => variant.size_ml as CatalogSize);

  if (available.length === 0) return null;

  if (preferredSize !== "All" && available.includes(preferredSize)) {
    return preferredSize;
  }

  return available[0];
}

export function ShopProductCard({
  product,
  preferredSize,
  onAdd,
}: ShopProductCardProps) {
  const availableVariants = useMemo(
    () => product.variants.filter((variant) => variant.available),
    [product.variants],
  );

  const [selectedSize, setSelectedSize] = useState<CatalogSize | null>(() =>
    pickDefaultSize(product, preferredSize),
  );

  useEffect(() => {
    setSelectedSize(pickDefaultSize(product, preferredSize));
  }, [product, preferredSize]);

  const selectedVariant = availableVariants.find(
    (variant) => variant.size_ml === selectedSize,
  );

  const imageSrc =
    selectedSize != null
      ? getProductImage(product, selectedSize)
      : product.image_15ml;

  const scentLabel = product.scent_group?.trim() || "Signature";
  const href = `/products/${encodeURIComponent(product.item_code)}`;

  return (
    <div className="flex flex-col">
      <article className="overflow-hidden border border-[var(--border)] bg-[var(--bg-elevated)]">
        <Link
          href={href}
          className="group block outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          aria-label={`View ${product.code_name}`}
        >
          <div className="relative flex h-[260px] items-center justify-center bg-[var(--muted)] px-4 py-4">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,var(--glow),transparent_60%)]"
              aria-hidden="true"
            />
            <Image
              src={imageSrc}
              alt={`${product.code_name} ${selectedSize ?? ""}ml`}
              width={220}
              height={280}
              className="relative z-10 h-[220px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>

          <div className="px-5 pb-2 pt-4">
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[var(--fg-subtle)]">
              {product.designer}
            </p>
            <h3 className="mt-2 font-display text-xl leading-snug tracking-tight text-[var(--fg)] transition-colors group-hover:text-[var(--fg-muted)]">
              {product.code_name}
            </h3>
          </div>
        </Link>

        <div className="px-5 pb-5 pt-2">
          <div className="flex flex-wrap gap-2">
            <span className="border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--fg-muted)]">
              {scentLabel}
            </span>
          </div>

          {availableVariants.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {availableVariants.map((variant) => {
                const active = variant.size_ml === selectedSize;
                return (
                  <button
                    key={variant.size_ml}
                    type="button"
                    onClick={() =>
                      setSelectedSize(variant.size_ml as CatalogSize)
                    }
                    className={`border px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                        : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {variant.size_ml}ml
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
              Sold out
            </p>
          )}

          {selectedVariant && (
            <p className="mt-3 text-sm text-[var(--fg)]">
              {formatPrice(selectedVariant.price)}
            </p>
          )}
        </div>
      </article>

      <button
        type="button"
        disabled={!selectedVariant}
        onClick={() => {
          if (!selectedVariant) return;
          onAdd(product, selectedVariant.size_ml);
        }}
        className="mt-3 w-full border border-[var(--fg)] bg-transparent px-4 py-3 text-[0.65rem] uppercase tracking-[0.18em] text-[var(--fg)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)] disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:text-[var(--fg-subtle)] disabled:hover:bg-transparent disabled:hover:text-[var(--fg-subtle)]"
      >
        Add to cart
      </button>
    </div>
  );
}
