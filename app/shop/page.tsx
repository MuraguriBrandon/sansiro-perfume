import { Header } from "@/components/Header";
import { ShopCatalog } from "@/components/ShopCatalog";
import { getCatalogue } from "@/lib/catalogue";
import type { CatalogSize } from "@/lib/size-guide";

type ShopPageProps = {
  searchParams?: Promise<{ size?: string }>;
};

function parseSize(value?: string): CatalogSize | "All" {
  if (value === "8" || value === "15" || value === "50") {
    return Number(value) as CatalogSize;
  }
  return "All";
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = (await searchParams) ?? {};
  const products = getCatalogue();
  const initialSize = parseSize(params.size);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Header />
      <main>
        <ShopCatalog
          key={`shop-${initialSize}`}
          products={products}
          initialSize={initialSize}
        />
      </main>
      <footer className="border-t border-[var(--border)] py-10 text-center text-xs uppercase tracking-[0.3em] text-[var(--fg-subtle)]">
        Sansiro Perfume
      </footer>
    </div>
  );
}
