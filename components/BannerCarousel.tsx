"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { CatalogProduct } from "@/lib/catalogue-shared";
import { formatPrice } from "@/lib/format";

type BannerCarouselProps = {
  products: CatalogProduct[];
};

export function BannerCarousel({ products }: BannerCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = products.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 5000);
    return () => window.clearInterval(id);
  }, [count]);

  if (count === 0) return null;

  const goTo = (next: number) => {
    setIndex((next + count) % count);
  };

  return (
    <section
      className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-elevated)]"
      aria-roledescription="carousel"
      aria-label="Featured fragrances"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--glow),transparent_55%)]" />

      <div className="relative mx-auto grid min-h-[70vh] max-w-6xl items-center px-5 py-14 sm:min-h-[64vh] sm:px-8 lg:py-20">
        {products.map((product, slideIndex) => {
          const active = slideIndex === index;
          const variant50 = product.variants.find((v) => v.size_ml === 50);
          const variant8 = product.variants.find((v) => v.size_ml === 8);

          return (
            <div
              key={product.item_code}
              className={`col-start-1 row-start-1 grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
                active
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
              } transition-opacity duration-700 ease-out`}
              aria-hidden={!active}
            >
              <div className="flex flex-col justify-center order-2 lg:order-1">
                <p className="mb-3 text-[0.7rem] uppercase tracking-[0.35em] text-[var(--fg-muted)] animate-fade-up">
                  Featured · {product.gender}
                </p>
                <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-[var(--fg)] sm:text-5xl lg:text-6xl">
                  {product.code_name}
                </h1>
                <p className="mt-4 text-sm uppercase tracking-[0.28em] text-[var(--fg-subtle)]">
                  {product.designer}
                </p>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--fg-muted)]">
                  {variant8 && (
                    <span>
                      8ml · {formatPrice(variant8.price)}
                      {!variant8.available && (
                        <span className="ml-2 text-[var(--fg-subtle)]">
                          Soon
                        </span>
                      )}
                    </span>
                  )}
                  {variant50 && (
                    <span>
                      50ml · {formatPrice(variant50.price)}
                      {!variant50.available && (
                        <span className="ml-2 text-[var(--fg-subtle)]">
                          Soon
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative order-1 flex min-h-[42vh] items-center justify-center lg:order-2">
                <div className="absolute h-56 w-56 rounded-full bg-[var(--glow-strong)] blur-3xl sm:h-72 sm:w-72" />
                <Image
                  src={product.image_50ml}
                  alt={`${product.code_name} by ${product.designer}`}
                  width={360}
                  height={480}
                  priority={slideIndex === 0}
                  className={`relative z-10 h-[42vh] w-auto max-h-[420px] object-contain transition-transform duration-700 ${
                    active ? "scale-100" : "scale-95"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4 sm:bottom-8">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          className="flex h-9 w-9 items-center justify-center border border-[var(--border)] text-[var(--fg-muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]"
          aria-label="Previous slide"
        >
          <span aria-hidden="true">←</span>
        </button>
        <div className="flex items-center gap-2" role="tablist">
          {products.map((product, slideIndex) => (
            <button
              key={product.item_code}
              type="button"
              role="tab"
              aria-selected={slideIndex === index}
              aria-label={`Show ${product.code_name}`}
              onClick={() => setIndex(slideIndex)}
              className={`h-1.5 transition-all ${
                slideIndex === index
                  ? "w-8 bg-[var(--fg)]"
                  : "w-1.5 bg-[var(--fg-subtle)] hover:bg-[var(--fg-muted)]"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          className="flex h-9 w-9 items-center justify-center border border-[var(--border)] text-[var(--fg-muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]"
          aria-label="Next slide"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
