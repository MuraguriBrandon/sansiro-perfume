import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { ProductDetail } from "@/components/ProductDetail";
import { getCatalogue, getProductByCode } from "@/lib/catalogue";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getCatalogue().map((product) => ({ id: product.item_code }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductByCode(id);
  if (!product) {
    return { title: "Product not found — Sansiro" };
  }

  return {
    title: `${product.code_name} — Sansiro Perfume`,
    description: `${product.code_name} by ${product.designer}. ${product.scent_group || "Signature fragrance"}.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductByCode(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Header />
      <main>
        <ProductDetail product={product} />
      </main>
      <footer className="border-t border-[var(--border)] py-10 text-center text-xs uppercase tracking-[0.3em] text-[var(--fg-subtle)]">
        Sansiro Perfume
      </footer>
    </div>
  );
}
