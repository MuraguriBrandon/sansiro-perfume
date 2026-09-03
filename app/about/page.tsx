import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Header />
      <main className="flex-grow mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-28">
        <p className="text-[0.7rem] uppercase tracking-[0.35em] text-[var(--fg-muted)]">About Sansiro</p>
        <div className="mt-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <h1 className="font-display text-5xl leading-[0.95] sm:text-7xl">Fragrance that stays with you.</h1>
          <div className="space-y-6 text-sm leading-7 text-[var(--fg-muted)]">
            <p>Sansiro makes considered fragrance easier to wear every day, with inspired scents in practical sizes for every kind of routine.</p>
            <p>From a pocket spray to a full-size bottle, each collection is selected for character, balance, and the pleasure of finding a scent that feels like your own.</p>
            <Link href="/shop" className="inline-block border border-[var(--fg)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]">Explore the collection</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
