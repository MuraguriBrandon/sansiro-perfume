import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-gradient-to-b from-[var(--bg-elevated)] to-[rgba(0,0,0,0.3)] backdrop-blur-sm">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-[rgba(255,255,255,0.03)] to-transparent opacity-50 pointer-events-none" />
      
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-14">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--fg-subtle)]">
          Sansiro Perfume · © {new Date().getFullYear()}
        </p>
        <nav className="flex gap-8 text-xs uppercase tracking-[0.18em] text-[var(--fg-muted)]" aria-label="Footer navigation">
          <Link href="/about" className="transition-all duration-300 ease-out hover:text-[var(--fg)] hover:tracking-widest">About</Link>
          <Link href="/contact" className="transition-all duration-300 ease-out hover:text-[var(--fg)] hover:tracking-widest">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
