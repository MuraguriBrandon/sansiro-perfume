"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function ContactPage() {
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !message) {
      setError("Please enter your name and message before continuing.");
      return;
    }

    setError("");
    const details = [
      `Name: ${name}`,
      `Email: ${String(formData.get("email") ?? "").trim() || "Not provided"}`,
      `Phone: ${String(formData.get("phone") ?? "").trim() || "Not provided"}`,
      `Subject: ${String(formData.get("subject") ?? "").trim() || "General enquiry"}`,
      "",
      `Message: ${message}`,
    ].join("\n");
    const whatsappUrl = `https://wa.me/254719712242?text=${encodeURIComponent(details)}`;

    window.open(whatsappUrl, "_blank");
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-28">
        <p className="text-[0.7rem] uppercase tracking-[0.35em] text-[var(--fg-muted)]">Contact us</p>
        <div className="mt-6 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <h1 className="font-display text-5xl leading-[0.95] sm:text-7xl">Let&apos;s talk fragrance.</h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-[var(--fg-muted)]">Questions about a scent, a size, or an order? Send us a note and our team will get back to you.</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <label className="block text-xs uppercase tracking-[0.15em] text-[var(--fg-muted)]">Name<input required name="name" className="mt-2 block w-full border-b border-[var(--border)] bg-transparent px-0 py-3 text-sm outline-none focus:border-[var(--fg)]" /></label>
            <label className="block text-xs uppercase tracking-[0.15em] text-[var(--fg-muted)]">Email<input type="email" name="email" className="mt-2 block w-full border-b border-[var(--border)] bg-transparent px-0 py-3 text-sm outline-none focus:border-[var(--fg)]" /></label>
            <label className="block text-xs uppercase tracking-[0.15em] text-[var(--fg-muted)]">Phone<input type="tel" name="phone" className="mt-2 block w-full border-b border-[var(--border)] bg-transparent px-0 py-3 text-sm outline-none focus:border-[var(--fg)]" /></label>
            <label className="block text-xs uppercase tracking-[0.15em] text-[var(--fg-muted)]">Subject<input name="subject" className="mt-2 block w-full border-b border-[var(--border)] bg-transparent px-0 py-3 text-sm outline-none focus:border-[var(--fg)]" /></label>
            <label className="block text-xs uppercase tracking-[0.15em] text-[var(--fg-muted)]">Message<textarea required name="message" rows={5} className="mt-2 block w-full resize-y border-b border-[var(--border)] bg-transparent px-0 py-3 text-sm outline-none focus:border-[var(--fg)]" /></label>
            {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
            <button type="submit" className="bg-[var(--fg)] px-5 py-4 text-xs uppercase tracking-[0.2em] text-[var(--bg)]">Send via WhatsApp</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
