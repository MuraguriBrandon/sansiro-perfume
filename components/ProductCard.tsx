"use client";

import Image from "next/image";
import type { PreviewProduct } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: PreviewProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const variant = product.variants.find(
    (item) => item.size_ml === product.display_size_ml,
  );

  const sizeLabel = `${product.display_size_ml}ml`;

  return (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
      aria-label={`${product.code_name} by ${product.designer}, ${sizeLabel}`}
    >
      <article className="flex h-full flex-col">
        <div className="relative mb-5 flex aspect-[3/4] items-end justify-center overflow-hidden bg-[var(--bg-elevated)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,var(--glow),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <Image
            src={product.display_image}
            alt=""
            width={280}
            height={360}
            className="relative z-10 h-[78%] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute left-3 top-3 z-10">
            <span className="text-[0.65rem] uppercase tracking-[0.25em] text-[var(--fg-subtle)]">
              {sizeLabel} · {product.gender}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[var(--fg-subtle)]">
            {product.designer}
          </p>
          <h3 className="mt-2 font-display text-xl leading-snug tracking-tight text-[var(--fg)] transition-colors group-hover:text-[var(--fg-muted)]">
            {product.code_name}
          </h3>
          <p className="mt-1 text-xs text-[var(--fg-subtle)]">
            {product.item_code}
          </p>

          {variant && (
            <div className="mt-4 flex items-baseline justify-between gap-2 border-t border-[var(--border)] pt-4 text-sm">
              <span className="text-[var(--fg-muted)]">{sizeLabel}</span>
              <span className="text-[var(--fg)]">
                {formatPrice(variant.price)}
                {!variant.available && (
                  <span className="ml-2 text-xs text-[var(--fg-subtle)]">
                    Soon
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </article>
    </a>
  );
}
