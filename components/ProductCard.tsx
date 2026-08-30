"use client";

import Image from "next/image";
import Link from "next/link";
import type { PreviewProduct } from "@/lib/catalogue-shared";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: PreviewProduct;
  onAdd: (product: PreviewProduct, size: number) => void;
  compact?: boolean;
};

export function ProductCard({
  product,
  onAdd,
  compact = false,
}: ProductCardProps) {
  const selectedVariant = product.variants.find(
    (item) => item.size_ml === product.display_size_ml,
  );

  const sizeLabel = `${product.display_size_ml}ml`;
  const href = `/products/${encodeURIComponent(product.item_code)}`;

  return (
    <div className="group flex h-full flex-col">
      <Link
        href={href}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
        aria-label={`${product.code_name} by ${product.designer}, ${sizeLabel}`}
      >
        <div
          className={`relative mb-4 flex items-end justify-center overflow-hidden bg-[var(--bg-elevated)] ${
            compact ? "aspect-[3/4] mb-3" : "aspect-[3/4] mb-5"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,var(--glow),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <Image
            src={product.display_image}
            alt=""
            width={compact ? 200 : 280}
            height={compact ? 260 : 360}
            className={`relative z-10 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04] ${
              compact ? "h-[72%]" : "h-[78%]"
            }`}
          />
          <div className="absolute left-2 top-2 z-10 flex flex-wrap gap-1.5 sm:left-3 sm:top-3 sm:gap-2">
            <span
              className={`uppercase tracking-[0.2em] text-[var(--fg-subtle)] ${
                compact ? "text-[0.55rem]" : "text-[0.65rem]"
              }`}
            >
              {sizeLabel} · {product.gender}
            </span>
            {selectedVariant && (
              <span
                className={`uppercase tracking-[0.16em] ${
                  compact ? "text-[0.5rem]" : "text-[0.6rem]"
                } ${selectedVariant.available ? "text-emerald-500" : "text-rose-400"}`}
              >
                {selectedVariant.available ? "In stock" : "Sold out"}
              </span>
            )}
          </div>
        </div>

        <p
          className={`uppercase tracking-[0.24em] text-[var(--fg-subtle)] ${
            compact ? "text-[0.55rem]" : "text-[0.65rem]"
          }`}
        >
          {product.designer}
        </p>
        <h3
          className={`mt-1.5 font-display leading-snug tracking-tight text-[var(--fg)] transition-colors group-hover:text-[var(--fg-muted)] ${
            compact ? "text-base" : "mt-2 text-xl"
          }`}
        >
          {product.code_name}
        </h3>
        <p
          className={`mt-1 text-[var(--fg-subtle)] ${
            compact ? "text-[0.65rem]" : "text-xs"
          }`}
        >
          {product.item_code}
        </p>
      </Link>

      {selectedVariant && (
        <div
          className={`mt-auto flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3 ${
            compact ? "mt-3 text-xs" : "mt-4 pt-4 text-sm"
          }`}
        >
          <div>
            <span className="block text-[var(--fg-muted)]">{sizeLabel}</span>
            <span className="text-[var(--fg)]">
              {formatPrice(selectedVariant.price)}
            </span>
          </div>
          <button
            type="button"
            disabled={!selectedVariant.available}
            onClick={() => onAdd(product, selectedVariant.size_ml)}
            className={`border border-[var(--fg)] uppercase tracking-[0.16em] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)] disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:text-[var(--fg-subtle)] ${
              compact
                ? "px-2.5 py-1.5 text-[0.55rem]"
                : "px-3 py-2 text-[0.6rem]"
            }`}
          >
            {selectedVariant.available ? "Add" : "Unavailable"}
          </button>
        </div>
      )}
    </div>
  );
}
