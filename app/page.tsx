import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sansiro-pink/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <Image
          src="/images/logo.png"
          alt="SANSIRO Perfume"
          width={280}
          height={200}
          priority
          className="mb-12 w-48 sm:w-64"
        />

        <div className="mb-16 flex items-end justify-center gap-8 sm:gap-16">
          <Image
            src="/images/product-women.png"
            alt="SANSIRO for Women"
            width={80}
            height={320}
            className="h-32 w-auto opacity-80 sm:h-44"
          />
          <Image
            src="/images/product-men.png"
            alt="SANSIRO for Men"
            width={80}
            height={320}
            className="h-32 w-auto opacity-80 sm:h-44"
          />
        </div>

        <p className="text-xs font-light uppercase tracking-[0.35em] text-white/60 sm:text-sm">
          Coming Soon
        </p>
      </div>
    </main>
  );
}
