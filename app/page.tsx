import { BannerCarousel } from "@/components/BannerCarousel";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import {
  getFeaturedProducts,
  getHomePreviewProducts,
} from "@/lib/catalogue";

export default function Home() {
  const products = getHomePreviewProducts();
  const featured = getFeaturedProducts(3);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Header />
      <main>
        <BannerCarousel products={featured} />
        <ProductGrid products={products} />
      </main>
      <footer className="border-t border-[var(--border)] py-10 text-center text-xs uppercase tracking-[0.3em] text-[var(--fg-subtle)]">
        SANSIRO Perfume
      </footer>
    </div>
  );
}
