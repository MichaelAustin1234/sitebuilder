import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "UMKM Sitebuilder — Toko Online Gratis untuk UMKM Indonesia",
    template: "%s | UMKM Sitebuilder",
  },
  description:
    "Buat toko online profesional dalam 5 menit. Tanpa coding, tanpa biaya. Khusus untuk UMKM Indonesia — dilengkapi integrasi WhatsApp, QR code, dan berbagai template cantik.",
  keywords: ["toko online", "UMKM", "sitebuilder", "website toko", "jualan online", "Indonesia"],
  authors: [{ name: "UMKM Sitebuilder" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "UMKM Sitebuilder",
    title: "UMKM Sitebuilder — Toko Online Gratis untuk UMKM Indonesia",
    description:
      "Buat toko online profesional dalam 5 menit. Tanpa coding, tanpa biaya.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UMKM Sitebuilder — Toko Online Gratis untuk UMKM Indonesia",
    description: "Buat toko online profesional dalam 5 menit. Tanpa coding, tanpa biaya.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
