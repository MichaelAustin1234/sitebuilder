import Image from "next/image";
import type { SiteTemplateData } from "@/lib/types";
import { WaButton, FloatingWaButton } from "@/components/WaButton";
import { buildWaContactUrl, buildWaProductUrl } from "@/lib/wa";

/**
 * FoodTemplate v2 — Restaurant-grade design.
 * Hero dramatis, menu terkelompok per kategori, kartu menu informatif dengan foto.
 * Cocok untuk: restoran, kafe, warung makan, cloud kitchen, katering.
 */
export default function FoodTemplate({ data }: { data: SiteTemplateData }) {
  const { site, products } = data;
  const primary = site.primary_color ?? "#c2410c";
  const contactUrl = site.phone_wa ? buildWaContactUrl(site.phone_wa, site.name) : null;

  // Group products by category
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const hasCategories = categories.length > 1;

  return (
    <div
      className="min-h-screen text-gray-800 font-sans"
      style={{ "--primary-color": primary, backgroundColor: "#fffbf5" } as React.CSSProperties}
    >
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <header className="relative text-white overflow-hidden" style={{ minHeight: "380px", backgroundColor: "var(--primary-color)" }}>
        {site.banner_url && (
          <Image src={site.banner_url} alt="Banner" fill className="object-cover opacity-40" priority unoptimized />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)" }} />
        {/* Sticky nav */}
        <nav className="relative z-20 flex items-center justify-between px-5 md:px-8 py-4">
          <div className="flex items-center gap-3">
            {site.logo_url && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 flex-shrink-0">
                <Image src={site.logo_url} alt={site.name} fill className="object-cover" unoptimized />
              </div>
            )}
            <span className="font-bold text-lg text-white drop-shadow">{site.name}</span>
          </div>
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="text-sm font-bold px-4 py-2 rounded-full text-white border-2 border-white/50 backdrop-blur-sm transition hover:bg-white/20"
            >
              💬 Pesan
            </WaButton>
          )}
        </nav>
        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-16 pt-8">
          {site.logo_url && (
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white/60 shadow-2xl mb-5">
              <Image src={site.logo_url} alt={site.name} fill className="object-cover" unoptimized />
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">{site.name}</h1>
          {site.tagline && <p className="mt-2 text-base md:text-lg font-semibold text-yellow-200 drop-shadow">{site.tagline}</p>}
          {site.description && <p className="mt-3 text-sm text-white/80 max-w-md leading-relaxed">{site.description}</p>}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="mt-6 inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-xl transition hover:scale-105 active:scale-95"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
            >
              🛒 Pesan Sekarang via WhatsApp
            </WaButton>
          )}
        </div>
      </header>

      {/* ── Info Bar ───────────────────────────────────────────────────── */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-5 py-3 flex flex-wrap items-center gap-4 md:gap-8 justify-center text-sm text-gray-600">
          {site.address && <span className="flex items-center gap-1.5">📍 <span>{site.address}</span></span>}
          {site.operating_hours && (
            <span className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--primary-color)" }}>
              ⏰ <span>{site.operating_hours}</span>
            </span>
          )}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="flex items-center gap-1.5 font-bold rounded-full px-4 py-1.5 text-white text-xs shadow-sm"
              style={{ backgroundColor: "var(--primary-color)" }}>
              💬 WhatsApp
            </WaButton>
          )}
        </div>
      </div>

      {/* ── Menu ───────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-5 md:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-orange-100 rounded-3xl">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-gray-400 font-medium">Menu segera tersedia</p>
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="mt-4 inline-block text-sm font-bold px-5 py-2 rounded-full text-white"
                style={{ backgroundColor: "var(--primary-color)" }}>
                💬 Tanya Menu
              </WaButton>
            )}
          </div>
        ) : hasCategories ? (
          categories.map((cat) => {
            const catProducts = products.filter((p) => p.category === cat);
            return (
              <section key={cat} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: "var(--primary-color)" }} />
                  <h2 className="text-xl font-extrabold text-gray-800">{cat}</h2>
                  <div className="flex-1 h-px bg-orange-100 ml-2" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {catProducts.map((product) => <MenuCard key={product.id} product={product} site={site} />)}
                </div>
              </section>
            );
          })
        ) : (
          <>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold" style={{ color: "var(--primary-color)" }}>🍽️ Menu Kami</h2>
              <p className="text-gray-500 text-sm mt-1">Pilih menu favoritmu dan pesan via WhatsApp</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => <MenuCard key={product.id} product={product} site={site} />)}
            </div>
          </>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="text-white py-10 text-center text-sm" style={{ backgroundColor: "var(--primary-color)" }}>
        <p className="font-extrabold text-xl mb-3">{site.name}</p>
        {site.address && <p className="mb-1 opacity-90 text-xs">📍 {site.address}</p>}
        {site.operating_hours && <p className="mb-3 opacity-90 text-xs">⏰ {site.operating_hours}</p>}
        {contactUrl && (
          <WaButton href={contactUrl} slug={site.slug}
            className="inline-flex items-center gap-2 bg-white text-xs font-bold px-5 py-2.5 rounded-full mb-4 transition hover:opacity-90"
            style={{ color: "var(--primary-color)" }}>
            💬 Chat WhatsApp
          </WaButton>
        )}
        <p className="block opacity-60 text-xs">© {new Date().getFullYear()} {site.name}. Dibuat dengan UMKM Sitebuilder.</p>
      </footer>

      {contactUrl && <FloatingWaButton href={contactUrl} slug={site.slug} />}
    </div>
  );
}

/* ── Menu Card Component ────────────────────────────────────────────────── */
function MenuCard({ product, site }: { product: SiteTemplateData["products"][0]; site: SiteTemplateData["site"] }) {
  const waUrl = site.phone_wa ? buildWaProductUrl(site.phone_wa, site.name, product.name, product.formatted_price) : null;
  return (
    <div className="flex gap-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 border border-orange-50 group">
      <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-orange-50">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Habis</span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        <div>
          <p className="font-bold text-gray-800 line-clamp-2 leading-snug text-sm md:text-base">{product.name}</p>
          {product.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>}
        </div>
        <div className="flex items-center justify-between mt-2 gap-2">
          <p className="font-extrabold text-base" style={{ color: "var(--primary-color)" }}>{product.formatted_price}</p>
          {product.stock > 0 && waUrl && (
            <WaButton href={waUrl} slug={site.slug}
              className="text-center text-xs px-3 py-1.5 rounded-xl text-white font-semibold transition hover:opacity-90 flex-shrink-0"
              style={{ backgroundColor: "var(--primary-color)" }}>
              🛒 Pesan
            </WaButton>
          )}
        </div>
      </div>
    </div>
  );
}

