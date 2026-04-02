import Image from "next/image";
import type { SiteTemplateData } from "@/lib/types";
import { WaButton, FloatingWaButton } from "@/components/WaButton";
import { buildWaContactUrl, buildWaProductUrl } from "@/lib/wa";

/**
 * MinimalistTemplate v2 — Premium clean design.
 * Tipografi kuat, whitespace yang lapang, kartu produk dengan shadows elegan.
 * Cocok untuk semua jenis usaha yang ingin tampil profesional & modern.
 */
export default function MinimalistTemplate({ data }: { data: SiteTemplateData }) {
  const { site, products } = data;
  const primary = site.primary_color ?? "#6366f1";
  const contactUrl = site.phone_wa ? buildWaContactUrl(site.phone_wa, site.name) : null;

  // Group products by category
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const hasCategories = categories.length > 1;

  return (
    <div
      className="min-h-screen bg-white text-gray-800 font-sans"
      style={{ "--primary-color": primary } as React.CSSProperties}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 px-5 md:px-8 flex items-center gap-3 shadow-sm">
        {site.logo_url && (
          <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 shadow-sm ring-2 ring-offset-1" style={{ "--tw-ring-color": "var(--primary-color)" } as React.CSSProperties}>
            <Image src={site.logo_url} alt={site.name} fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold tracking-tight truncate text-gray-900">{site.name}</h1>
          {site.tagline && (
            <p className="text-xs mt-0.5 truncate font-medium" style={{ color: "var(--primary-color)" }}>{site.tagline}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {site.operating_hours && (
            <span className="hidden sm:block text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-1">⏰ {site.operating_hours}</span>
          )}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="text-xs md:text-sm px-3 md:px-5 py-2 rounded-full font-semibold transition text-white shadow-md hover:shadow-lg hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--primary-color)" }}>
              💬 Hubungi
            </WaButton>
          )}
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      {site.banner_url ? (
        <div className="relative w-full h-56 md:h-80 lg:h-96 overflow-hidden">
          <Image src={site.banner_url} alt="Banner" fill className="object-cover" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-2">{site.category}</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-sm leading-tight max-w-lg">{site.name}</h2>
            {site.tagline && <p className="text-sm md:text-base mt-2 font-medium" style={{ color: "oklch(90% 0.1 var(--primary-hue, 250))" }}>{site.tagline}</p>}
            {site.description && <p className="text-sm text-white/75 mt-2 max-w-md leading-relaxed line-clamp-2">{site.description}</p>}
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full shadow-lg transition hover:opacity-90 active:scale-95 w-fit text-white"
                style={{ backgroundColor: "var(--primary-color)" }}>
                🛒 Lihat Produk
              </WaButton>
            )}
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden py-14 md:py-20 px-8 md:px-16 text-center"
          style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 8%, white) 0%, white 60%)` }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: "var(--primary-color)" }} />
          {site.logo_url && (
            <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 shadow-lg border-4 border-white">
              <Image src={site.logo_url} alt={site.name} fill className="object-cover" unoptimized />
            </div>
          )}
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--primary-color)" }}>{site.category}</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{site.name}</h2>
          {site.tagline && <p className="text-base mt-2 font-medium" style={{ color: "var(--primary-color)" }}>{site.tagline}</p>}
          {site.description && <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">{site.description}</p>}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold px-7 py-3 rounded-full text-white shadow-md transition hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--primary-color)" }}>
              💬 Hubungi Kami
            </WaButton>
          )}
        </div>
      )}

      {/* ── Info Strip ─────────────────────────────────────────────────── */}
      {(site.address || site.operating_hours || site.phone_wa) && (
        <div className="bg-gray-50 border-y border-gray-100 px-4 py-3 flex flex-wrap gap-3 md:gap-6 text-xs text-gray-500 justify-center">
          {site.address && <span className="flex items-center gap-1">📍 {site.address}</span>}
          {site.operating_hours && <span className="flex items-center gap-1">⏰ {site.operating_hours}</span>}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug} className="font-semibold hover:underline" style={{ color: "var(--primary-color)" }}>
              💬 {site.phone_wa}
            </WaButton>
          )}
        </div>
      )}

      {/* ── Products ───────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-5 md:px-8 py-14">
        {products.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-100 rounded-2xl">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-400 font-medium">Produk segera tersedia</p>
            <p className="text-gray-300 text-sm mt-1">Hubungi kami untuk informasi lebih lanjut</p>
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="mt-4 inline-block text-sm font-semibold px-5 py-2 rounded-full text-white"
                style={{ backgroundColor: "var(--primary-color)" }}>
                💬 Tanya via WA
              </WaButton>
            )}
          </div>
        ) : hasCategories ? (
          // Grouped by category
          categories.map((cat) => {
            const catProducts = products.filter((p) => p.category === cat);
            return (
              <section key={cat} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-5 rounded-full" style={{ backgroundColor: "var(--primary-color)" }} />
                  <h2 className="text-lg font-bold text-gray-800">{cat}</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{catProducts.length} produk</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                  {catProducts.map((product) => <ProductCard key={product.id} product={product} site={site} />)}
                </div>
              </section>
            );
          })
        ) : (
          <>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: "var(--primary-color)" }} />
              <h2 className="text-xl font-bold text-gray-900">Produk Kami</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-auto">{products.length} produk</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
              {products.map((product) => <ProductCard key={product.id} product={product} site={site} />)}
            </div>
          </>
        )}
      </main>

      {/* ── CTA Section ─────────────────────────────────────────────────── */}
      {contactUrl && (
        <section className="mx-5 md:mx-8 mb-12 rounded-3xl px-8 py-10 text-center text-white"
          style={{ background: `linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 70%, #000))` }}>
          <h3 className="text-xl md:text-2xl font-bold mb-2">Butuh bantuan memilih produk?</h3>
          <p className="text-sm opacity-80 mb-5">Tim kami siap membantu Anda menemukan yang terbaik</p>
          <WaButton href={contactUrl} slug={site.slug}
            className="inline-flex items-center gap-2 bg-white text-sm font-bold px-7 py-3 rounded-full shadow-md transition hover:opacity-90 active:scale-95"
            style={{ color: "var(--primary-color)" }}>
            💬 Chat WhatsApp Sekarang
          </WaButton>
        </section>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-gray-50 py-10 text-center text-xs text-gray-400 space-y-1">
        <p className="font-bold text-sm text-gray-600">{site.name}</p>
        {site.address && <p>📍 {site.address}</p>}
        {site.operating_hours && <p>⏰ {site.operating_hours}</p>}
        {contactUrl && (
          <WaButton href={contactUrl} slug={site.slug} className="inline-block font-semibold" style={{ color: "var(--primary-color)" }}>
            💬 {site.phone_wa}
          </WaButton>
        )}
        <p className="pt-2 text-gray-300">© {new Date().getFullYear()} {site.name}. Dibuat dengan ❤️ UMKM Sitebuilder.</p>
      </footer>

      {contactUrl && <FloatingWaButton href={contactUrl} slug={site.slug} />}
    </div>
  );
}

/* ── Product Card Component ─────────────────────────────────────────────── */
function ProductCard({ product, site }: { product: SiteTemplateData["products"][0]; site: SiteTemplateData["site"] }) {
  const contactUrl = site.phone_wa ? buildWaProductUrl(site.phone_wa, site.name, product.name, product.formatted_price) : null;
  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-50">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-200 gap-1">
            <span className="text-3xl">🖼️</span>
            <span className="text-xs">Foto belum ada</span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-full">Habis</span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-2 right-2 bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full">Sisa {product.stock}</div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-semibold line-clamp-2 leading-snug text-gray-800">{product.name}</p>
        {product.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>}
        <p className="text-sm font-bold mt-2" style={{ color: "var(--primary-color)" }}>{product.formatted_price}</p>
        {product.stock > 0 && contactUrl && (
          <WaButton href={contactUrl} slug={site.slug}
            className="mt-2 block text-center text-xs py-2 rounded-xl text-white font-semibold transition hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "var(--primary-color)" }}>
            Pesan via WA
          </WaButton>
        )}
      </div>
    </div>
  );
}

