"use client";
import { useState } from "react";
import Image from "next/image";
import type { SiteTemplateData } from "@/lib/types";
import { WaButton, FloatingWaButton } from "@/components/WaButton";
import { buildWaContactUrl, buildWaProductUrl } from "@/lib/wa";

/**
 * MarketTemplate — Clean modern e-commerce marketplace.
 * Category chips filter, grid produk bersih, badge promo, harga bold.
 * Cocok untuk: toko serba ada, elektronik, groceries, sembako, online shop.
 */
export default function MarketTemplate({ data }: { data: SiteTemplateData }) {
  const { site, products } = data;
  const primary = site.primary_color ?? "#0ea5e9";
  const contactUrl = site.phone_wa ? buildWaContactUrl(site.phone_wa, site.name) : null;
  const allCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory ? products.filter((p) => p.category === activeCategory) : products;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800"
      style={{ "--primary-color": primary } as React.CSSProperties}>

      {/* ── Top Banner ─────────────────────────────────────────── */}
      <div className="text-white text-xs text-center py-2 font-semibold tracking-wide"
        style={{ backgroundColor: "var(--primary-color)" }}>
        🚀 Pesan via WhatsApp — Cepat, Aman, Terpercaya!
      </div>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 px-5 md:px-8 py-3 flex items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {site.logo_url ? (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={site.logo_url} alt={site.name} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold"
              style={{ backgroundColor: "var(--primary-color)" }}>M</div>
          )}
          <div className="min-w-0">
            <p className="font-extrabold text-base leading-tight truncate" style={{ color: "var(--primary-color)" }}>{site.name}</p>
            {site.tagline && <p className="text-xs text-gray-400 truncate">{site.tagline}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {site.operating_hours && <span className="hidden lg:block text-xs text-gray-500 border rounded-lg px-3 py-1">⏰ {site.operating_hours}</span>}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="text-xs font-bold px-4 py-2 rounded-xl text-white transition hover:opacity-90"
              style={{ backgroundColor: "var(--primary-color)" }}>
              💬 Chat WA
            </WaButton>
          )}
        </div>
      </nav>

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      {site.banner_url ? (
        <div className="relative w-full h-44 md:h-64 overflow-hidden">
          <Image src={site.banner_url} alt="Banner" fill className="object-cover" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 text-white">
            <h1 className="text-2xl md:text-4xl font-extrabold drop-shadow-lg">{site.name}</h1>
            {site.description && <p className="text-sm mt-1 max-w-xs opacity-80 line-clamp-2">{site.description}</p>}
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-xl text-white shadow-lg"
                style={{ backgroundColor: "var(--primary-color)" }}>
                🛒 Belanja Sekarang
              </WaButton>
            )}
          </div>
        </div>
      ) : (
        <div className="px-5 md:px-8 py-8 text-center" style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 10%, white), white)` }}>
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: "var(--primary-color)" }}>{site.name}</h1>
          {site.description && <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">{site.description}</p>}
        </div>
      )}

      {/* ── Info Bar ─────────────────────────────────────────────── */}
      {(site.address || site.operating_hours) && (
        <div className="bg-white border-b border-gray-100 px-5 py-2">
          <div className="max-w-5xl mx-auto flex flex-wrap gap-4 text-xs text-gray-500 justify-center">
            {site.address && <span>📍 {site.address}</span>}
            {site.operating_hours && <span className="font-semibold" style={{ color: "var(--primary-color)" }}>⏰ {site.operating_hours}</span>}
          </div>
        </div>
      )}

      {/* ── Category Chips ───────────────────────────────────────── */}
      {allCategories.length > 0 && (
        <div className="bg-white border-b border-gray-100 px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition"
            style={activeCategory === null
              ? { backgroundColor: "var(--primary-color)", color: "white", borderColor: "var(--primary-color)" }
              : { backgroundColor: "white", color: "#6b7280", borderColor: "#e5e7eb" }}>
            Semua ({products.length})
          </button>
          {allCategories.map((cat) => (
            <button key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full border transition"
              style={activeCategory === cat
                ? { backgroundColor: "var(--primary-color)", color: "white", borderColor: "var(--primary-color)" }
                : { backgroundColor: "white", color: "#6b7280", borderColor: "#e5e7eb" }}>
              {cat} ({products.filter((p) => p.category === cat).length})
            </button>
          ))}
        </div>
      )}

      {/* ── Product Grid ─────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-gray-400 font-medium">Tidak ada produk ditemukan</p>
            <button onClick={() => setActiveCategory(null)} className="mt-3 text-sm font-semibold" style={{ color: "var(--primary-color)" }}>
              Lihat semua produk →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((p) => <MarketCard key={p.id} product={p} site={site} />)}
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-xs text-gray-400 space-y-1">
        <p className="font-bold text-sm" style={{ color: "var(--primary-color)" }}>{site.name}</p>
        {site.address && <p>📍 {site.address}</p>}
        {site.operating_hours && <p>⏰ {site.operating_hours}</p>}
        {contactUrl && (
          <WaButton href={contactUrl} slug={site.slug} className="inline-block font-semibold" style={{ color: "var(--primary-color)" }}>
            💬 {site.phone_wa}
          </WaButton>
        )}
        <p className="pt-2 text-gray-200">© {new Date().getFullYear()} {site.name}. Dibuat dengan UMKM Sitebuilder.</p>
      </footer>

      {contactUrl && <FloatingWaButton href={contactUrl} slug={site.slug} />}
    </div>
  );
}

/* ── Market Product Card ──────────────────────────────────────────────── */
function MarketCard({ product, site }: { product: SiteTemplateData["products"][0]; site: SiteTemplateData["site"] }) {
  const waUrl = site.phone_wa ? buildWaProductUrl(site.phone_wa, site.name, product.name, product.formatted_price) : null;
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col border border-gray-100">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-400" unoptimized />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-200 gap-1">
            <span className="text-3xl">🛒</span>
            <span className="text-xs">Foto belum ada</span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-full">Habis</span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Sisa {product.stock}</div>
        )}
        {product.category && (
          <div className="absolute top-2 right-2 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "var(--primary-color)" }}>{product.category}</div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-semibold line-clamp-2 text-gray-800 leading-snug">{product.name}</p>
        <p className="text-base font-extrabold mt-auto pt-2" style={{ color: "var(--primary-color)" }}>{product.formatted_price}</p>
        {product.stock > 0 && waUrl && (
          <WaButton href={waUrl} slug={site.slug}
            className="mt-2 block text-center text-xs py-2 rounded-xl font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: "var(--primary-color)" }}>
            🛒 Beli via WA
          </WaButton>
        )}
      </div>
    </div>
  );
}

