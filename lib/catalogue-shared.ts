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

export type PreviewKind = "8ml-men" | "8ml-women" | "50ml-generic";

export type PreviewProduct = CatalogProduct & {
  preview: PreviewKind;
  display_image: string;
  display_size_ml: 8 | 15 | 50;
};

export function getProductImage(
  product: CatalogProduct,
  sizeMl: 8 | 15 | 50,
): string {
  if (sizeMl === 8) return product.image_8ml;
  if (sizeMl === 15) return product.image_15ml;
  return product.image_50ml;
}

export function asPreviewProduct(
  product: CatalogProduct,
  sizeMl: 8 | 15 | 50,
): PreviewProduct {
  return {
    ...product,
    preview:
      sizeMl === 8
        ? product.gender === "Ladies"
          ? "8ml-women"
          : "8ml-men"
        : "50ml-generic",
    display_size_ml: sizeMl,
    display_image: getProductImage(product, sizeMl),
  };
}
