export type CatalogSize = 8 | 15 | 50;

export type SizeGuide = {
  size_ml: CatalogSize;
  label: string;
  packaging: string;
  usage: string;
  concentration: string;
};

export const sizeGuide: SizeGuide[] = [
  { size_ml: 8, label: "Pocket spray", packaging: "Compact travel spray", usage: "Easy everyday carry and quick top-ups", concentration: "Same fragrance formulation in a smaller format" },
  { size_ml: 15, label: "Daily spray", packaging: "Full-height portable spray bottle", usage: "Enough for a longer trip or regular daily wear", concentration: "Same fragrance formulation with more product per bottle" },
  { size_ml: 50, label: "Full size", packaging: "Large display bottle", usage: "Best value for an established signature scent", concentration: "Same fragrance formulation in the largest available size" },
];

export function getSizeGuide(size: CatalogSize): SizeGuide {
  return sizeGuide.find((item) => item.size_ml === size) ?? sizeGuide[0];
}