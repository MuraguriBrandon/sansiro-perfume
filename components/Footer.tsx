import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--fg-subtle)]">
          Sansiro Perfume · © {new Date().getFullYear()}
        </p>
        <nav className="flex gap-5 text-xs uppercase tracking-[0.18em] text-[var(--fg-muted)]" aria-label="Footer navigation">
          <Link href="/about" className="hover:text-[var(--fg)]">About</Link>
          <Link href="/contact" className="hover:text-[var(--fg)]">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
