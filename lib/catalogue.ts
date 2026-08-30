import "server-only";

import fs from "fs";
import path from "path";
import catalogueData from "@/public/scripts/seed_data/catalogue.json";
import {
  asPreviewProduct,
  type CatalogProduct,
  type Gender,
  type Product,
  type PreviewProduct,
} from "@/lib/catalogue-shared";

export type {
  CatalogProduct,
  Gender,
  PreviewKind,
  PreviewProduct,
  Product,
  ProductVariant,
} from "@/lib/catalogue-shared";

export {
  asPreviewProduct,
  getProductImage,
} from "@/lib/catalogue-shared";

const IMAGE_DIR = path.join(process.cwd(), "public", "images");

function listImageFiles(): string[] {
  try {
    return fs.readdirSync(IMAGE_DIR);
  } catch {
    return [];
  }
}

const imageFiles = listImageFiles();

function findImageIgnoreCase(filename: string): string | null {
  const match = imageFiles.find(
    (file) => file.toLowerCase() === filename.toLowerCase(),
  );
  return match ? `/images/${match}` : null;
}

export function get8mlImage(gender: Gender): string {
  if (gender === "Ladies") {
    return findImageIgnoreCase("8ml-women.png") ?? "/images/8ml-women.png";
  }
  return findImageIgnoreCase("8ml-men.png") ?? "/images/8ml-men.png";
}

export function get15mlImage(gender: Gender): string {
  const filename = gender === "Ladies" ? "15ml-female.png" : "15ml-male.png";
  return findImageIgnoreCase(filename) ?? `/images/${filename}`;
}

export function get50mlImage(itemCode: string): {
  src: string;
  dedicated: boolean;
} {
  const dedicated = findImageIgnoreCase(`${itemCode}-50ml.png`);
  if (dedicated) {
    return { src: dedicated, dedicated: true };
  }

  return {
    src:
      findImageIgnoreCase("Generic-50ml.png") ?? "/images/Generic-50ml.png",
    dedicated: false,
  };
}

export function getCatalogue(): CatalogProduct[] {
  return (catalogueData as Product[]).map((product) => {
    const image50 = get50mlImage(product.item_code);
    return {
      ...product,
      variants: [
        ...product.variants,
        { size_ml: 15, price: 500, available: true },
      ],
      image_8ml: get8mlImage(product.gender),
      image_15ml: get15mlImage(product.gender),
      image_50ml: image50.src,
      has_dedicated_50ml: image50.dedicated,
    };
  });
}

export function getFeaturedProducts(limit = 4): CatalogProduct[] {
  const products = getCatalogue();
  const withDedicated = products.filter(
    (product) => product.has_dedicated_50ml,
  );

  if (withDedicated.length >= limit) {
    return withDedicated.slice(0, limit);
  }

  return [...withDedicated, ...products]
    .filter(
      (product, index, list) =>
        list.findIndex((item) => item.item_code === product.item_code) ===
        index,
    )
    .slice(0, limit);
}

/** Look up a catalogue product by item_code (case-insensitive). */
export function getProductByCode(itemCode: string): CatalogProduct | null {
  const needle = itemCode.trim().toLowerCase();
  return (
    getCatalogue().find(
      (product) => product.item_code.toLowerCase() === needle,
    ) ?? null
  );
}

/** Homepage preview: up to 5 products per size. */
export function getHomeSizeSections(limit = 5): {
  size_ml: 8 | 15 | 50;
  products: PreviewProduct[];
}[] {
  const products = getCatalogue();
  const sizes: Array<8 | 15 | 50> = [8, 15, 50];

  return sizes.map((size_ml) => ({
    size_ml,
    products: products
      .filter((product) =>
        product.variants.some((variant) => variant.size_ml === size_ml),
      )
      .slice(0, limit)
      .map((product) => asPreviewProduct(product, size_ml)),
  }));
}

/** @deprecated Prefer getHomeSizeSections */
export function getHomePreviewProducts(): PreviewProduct[] {
  return getHomeSizeSections(1).flatMap((section) => section.products);
}
