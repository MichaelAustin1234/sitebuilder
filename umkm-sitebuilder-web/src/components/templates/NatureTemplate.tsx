import Image from "next/image";
import type { SiteTemplateData } from "@/lib/types";
import { WaButton, FloatingWaButton } from "@/components/WaButton";
import { buildWaContactUrl, buildWaProductUrl } from "@/lib/wa";

/**
 * NatureTemplate v2 — Organic & earthy premium design.
 * Palet krem hangat, hijau alami, tipografi serif-feel, kartu produk yang lembut.
 * Cocok untuk: herbal, pertanian, wellness, makanan sehat, tanaman, eco-products.
 */
export default function NatureTemplate({ data }: { data: SiteTemplateData }) {
  const { site, products } = data;
  const primary = site.primary_color ?? "#16a34a";
  const contactUrl = site.phone_wa ? buildWaContactUrl(site.phone_wa, site.name) : null;
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const hasCategories = categories.length > 1;

  return (
    <div className="min-h-screen font-sans"
      style={{ "--primary-color": primary, backgroundColor: "#faf7f2", color: "#3d3222" } as React.CSSProperties}>

      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200 px-5 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {site.logo_url ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-stone-200 flex-shrink-0">
              <Image src={site.logo_url} alt={site.name} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: "var(--primary-color)" }}>🌿</div>
          )}
          <div>
            <p className="font-bold text-base leading-tight text-stone-800">{site.name}</p>
            {site.tagline && <p className="text-xs leading-none mt-0.5" style={{ color: "var(--primary-color)" }}>{site.tagline}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {site.operating_hours && <span className="hidden md:block text-xs text-stone-500 border border-stone-200 rounded-full px-3 py-1">⏰ {site.operating_hours}</span>}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="text-xs md:text-sm px-4 py-2 rounded-full font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: "var(--primary-color)" }}>
              💬 Hubungi
            </WaButton>
          )}
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "360px" }}>
        {site.banner_url ? (
          <>
            <Image src={site.banner_url} alt="Banner" fill className="object-cover" priority unoptimized />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)" }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 20%, #faf7f2) 0%, #faf7f2 60%)" }} />
        )}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20"
          style={{ color: site.banner_url ? "white" : "#3d3222" }}>
          <span className="text-5xl mb-4">🌿</span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-sm mb-3">{site.name}</h1>
          {site.tagline && (
            <p className="text-base md:text-lg font-semibold mb-2"
              style={{ color: site.banner_url ? "#bbf7d0" : "var(--primary-color)" }}>{site.tagline}</p>
          )}
          {site.description && (
            <p className="text-sm max-w-md leading-relaxed mb-6 opacity-90">{site.description}</p>
          )}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="inline-flex items-center gap-2 text-white text-sm font-bold px-7 py-3 rounded-full shadow-lg transition hover:scale-105 active:scale-95"
              style={{ backgroundColor: "var(--primary-color)" }}>
              🛒 Pesan Sekarang
            </WaButton>
          )}
        </div>
      </section>

      {/* ── Info Strip ─────────────────────────────────────────────────────── */}
      {(site.address || site.operating_hours || contactUrl) && (
        <div className="bg-white border-y border-stone-200 py-3">
          <div className="max-w-4xl mx-auto px-5 flex flex-wrap items-center gap-4 md:gap-8 justify-center text-sm text-stone-600">
            {site.address && <span className="flex items-center gap-1.5">📍 {site.address}</span>}
            {site.operating_hours && (
              <span className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--primary-color)" }}>
                ⏰ {site.operating_hours}
              </span>
            )}
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="flex items-center gap-1.5 font-bold rounded-full px-4 py-1.5 text-white text-xs"
                style={{ backgroundColor: "var(--primary-color)" }}>
                💬 WhatsApp
              </WaButton>
            )}
          </div>
        </div>
      )}

      {/* ── Products ───────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-5 md:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-stone-200 rounded-3xl">
            <p className="text-5xl mb-4">🌱</p>
            <p className="text-stone-400 font-medium">Produk segera tersedia</p>
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="mt-4 inline-block text-sm font-bold px-5 py-2 rounded-full text-white"
                style={{ backgroundColor: "var(--primary-color)" }}>💬 Tanya WA</WaButton>
            )}
          </div>
        ) : hasCategories ? (
          categories.map((cat) => {
            const catProds = products.filter((p) => p.category === cat);
            return (
              <section key={cat} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: "var(--primary-color)" }} />
                  <h2 className="text-lg font-bold text-stone-800">{cat}</h2>
                  <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{catProds.length} produk</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                  {catProds.map((p) => <NatureCard key={p.id} product={p} site={site} />)}
                </div>
              </section>
            );
          })
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-bold" style={{ color: "var(--primary-color)" }}>🌿 Produk Pilihan Kami</h2>
              <p className="text-stone-500 text-sm mt-1">Alami, segar, dan terjamin kualitasnya</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {products.map((p) => <NatureCard key={p.id} product={p} site={site} />)}
            </div>
          </>
        )}
      </main>

      {/* ── CTA Section ────────────────────────────────────────────────────── */}
      {contactUrl && (
        <section className="mx-5 md:mx-8 mb-12 rounded-3xl px-8 py-10 text-center text-white"
          style={{ backgroundColor: "var(--primary-color)" }}>
          <p className="text-2xl mb-2 font-bold">Hidup Lebih Sehat, Mulai Sekarang 🌿</p>
          <p className="text-sm opacity-80 mb-5">Konsultasikan kebutuhan produk alami Anda bersama kami</p>
          <WaButton href={contactUrl} slug={site.slug}
            className="inline-flex items-center gap-2 bg-white text-sm font-bold px-7 py-3 rounded-full shadow-md transition hover:opacity-90"
            style={{ color: "var(--primary-color)" }}>
            💬 Chat WhatsApp Sekarang
          </WaButton>
        </section>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-stone-200 bg-stone-50 py-10 text-center text-xs text-stone-400 space-y-1">
        <p className="font-bold text-sm text-stone-600">{site.name}</p>
        {site.address && <p>📍 {site.address}</p>}
        {site.operating_hours && <p>⏰ {site.operating_hours}</p>}
        {contactUrl && (
          <WaButton href={contactUrl} slug={site.slug} className="inline-block font-semibold" style={{ color: "var(--primary-color)" }}>
            💬 {site.phone_wa}
          </WaButton>
        )}
        <p className="pt-2 text-stone-300">© {new Date().getFullYear()} {site.name}. Dibuat dengan ❤️ UMKM Sitebuilder.</p>
      </footer>

      {contactUrl && <FloatingWaButton href={contactUrl} slug={site.slug} />}
    </div>
  );
}

/* ── Nature Product Card ─────────────────────────────────────────────────── */
function NatureCard({ product, site }: { product: SiteTemplateData["products"][0]; site: SiteTemplateData["site"] }) {
  const waUrl = site.phone_wa ? buildWaProductUrl(site.phone_wa, site.name, product.name, product.formatted_price) : null;
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-stone-100 flex flex-col">
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 gap-1">
            <span className="text-3xl">🌱</span>
            <span className="text-xs">Foto belum ada</span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-full">Habis</span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            Sisa {product.stock}
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-semibold line-clamp-2 leading-snug text-stone-800">{product.name}</p>
        {product.description && <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>}
        <p className="text-sm font-bold mt-2" style={{ color: "var(--primary-color)" }}>{product.formatted_price}</p>
        {product.stock > 0 && waUrl && (
          <WaButton href={waUrl} slug={site.slug}
            className="mt-2 block text-center text-xs py-2 rounded-xl text-white font-semibold transition hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "var(--primary-color)" }}>
            🛒 Pesan via WA
          </WaButton>
        )}
      </div>
    </div>
  );
}

