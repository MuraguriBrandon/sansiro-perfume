import { BannerCarousel } from "@/components/BannerCarousel";
import { Header } from "@/components/Header";
import { HomeProductSections } from "@/components/HomeProductSections";
import { getFeaturedProducts, getHomeSizeSections } from "@/lib/catalogue";

export default function Home() {
  const sections = getHomeSizeSections(5);
  const featured = getFeaturedProducts(3);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Header />
      <main>
        <BannerCarousel products={featured} />
        <HomeProductSections sections={sections} />
      </main>
      <footer className="border-t border-[var(--border)] py-10 text-center text-xs uppercase tracking-[0.3em] text-[var(--fg-subtle)]">
        Sansiro Perfume
      </footer>
    </div>
  );
}
