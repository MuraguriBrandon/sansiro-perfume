import { BannerCarousel } from "@/components/BannerCarousel";
import { Footer } from "@/components/Footer";
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
      <Footer />
    </div>
  );
}
