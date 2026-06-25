import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SANSIRO Perfume — Coming Soon",
  description:
    "SANSIRO Perfume — premium fragrances for men and women. Something beautiful is on the way.",
  openGraph: {
    title: "SANSIRO Perfume — Coming Soon",
    description: "Premium fragrances for men and women. Coming soon.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
