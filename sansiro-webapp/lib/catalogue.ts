import fs from "fs";
import path from "path";
import catalogueData from "@/public/scripts/seed_data/catalogue.json";

export type Gender = "Men" | "Ladies" | "Unisex";

export type ProductVariant = {
  size_ml: number;
  price: number;
  available: boolean;
};

export type Product = {
  item_code: string;
  code_name: string;
  designer: string;
  scent_group: string;
  notes: string[];
  gender: Gender;
  variants: ProductVariant[];
};

export type CatalogProduct = Product & {
  image_8ml: string;
  image_15ml: string;
  image_50ml: string;
  has_dedicated_50ml: boolean;
};

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

export function formatPrice(price: number): string {
  return `KSh ${price.toLocaleString("en-KE")}`;
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

export type PreviewKind = "8ml-men" | "8ml-women" | "50ml-generic";

export type PreviewProduct = CatalogProduct & {
  preview: PreviewKind;
  display_image: string;
  display_size_ml: 8 | 15 | 50;
};


/** One row for the homepage: 8ml men, 8ml women, generic 50ml. */
export function getHomePreviewProducts(): PreviewProduct[] {
  const products = getCatalogue();
  const used = new Set<string>();

  const take = (
    predicate: (product: CatalogProduct) => boolean,
    preview: PreviewKind,
    display_size_ml: 8 | 15 | 50,
  ): PreviewProduct | null => {
    const product = products.find(
      (item) => !used.has(item.item_code) && predicate(item),
    );
    if (!product) return null;
    used.add(product.item_code);
    return {
      ...product,
      preview,
      display_size_ml,
      display_image:
        display_size_ml === 8 ? product.image_8ml : product.image_50ml,
    };
  };

  return [
    take((p) => p.gender === "Men", "8ml-men", 8),
    take((p) => p.gender === "Ladies", "8ml-women", 8),
    take((p) => !p.has_dedicated_50ml, "50ml-generic", 50),
  ].filter((item): item is PreviewProduct => item !== null);
}
