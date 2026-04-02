import Image from "next/image";
import type { SiteTemplateData } from "@/lib/types";
import { WaButton, FloatingWaButton } from "@/components/WaButton";
import { buildWaContactUrl, buildWaProductUrl } from "@/lib/wa";

/**
 * BeautyTemplate — Elegant feminine design untuk salon & wellness.
 * Palet: putih bersih, rose gold, pink blush, tipografi elegan.
 * Cocok untuk: salon, spa, skincare, nail art, kecantikan, perawatan diri.
 */
export default function BeautyTemplate({ data }: { data: SiteTemplateData }) {
  const { site, products } = data;
  const primary = site.primary_color ?? "#e879a0";
  const contactUrl = site.phone_wa ? buildWaContactUrl(site.phone_wa, site.name) : null;
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const hasCategories = categories.length > 1;

  return (
    <div className="min-h-screen font-sans bg-white text-gray-800"
      style={{ "--primary-color": primary } as React.CSSProperties}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b px-5 md:px-8 py-3.5 flex items-center justify-between shadow-sm"
        style={{ borderColor: "rgba(232,121,160,0.2)" }}>
        <div className="flex items-center gap-3">
          {site.logo_url ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-pink-300">
              <Image src={site.logo_url} alt={site.name} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: "linear-gradient(135deg, var(--primary-color), #f9a8d4)" }}>✿</div>
          )}
          <div>
            <p className="font-bold text-base leading-tight" style={{ color: "var(--primary-color)" }}>{site.name}</p>
            {site.tagline && <p className="text-xs text-gray-400">{site.tagline}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {site.operating_hours && <span className="hidden md:block text-xs text-gray-400 border rounded-full px-3 py-1" style={{ borderColor: "rgba(232,121,160,0.3)" }}>⏰ {site.operating_hours}</span>}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="text-xs md:text-sm px-4 py-2 rounded-full font-bold text-white transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, var(--primary-color), #f9a8d4)" }}>
              💬 Booking
            </WaButton>
          )}
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "380px", background: "linear-gradient(135deg, #fff1f6 0%, #fff 50%, #fdf2f8 100%)" }}>
        {site.banner_url && (
          <>
            <Image src={site.banner_url} alt="Banner" fill className="object-cover opacity-20" priority unoptimized />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(232,121,160,0.3) 0%, rgba(255,255,255,0.5) 100%)" }} />
          </>
        )}
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: "var(--primary-color)" }} />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: "var(--primary-color)" }} />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
          <p className="text-xs tracking-[0.5em] uppercase font-semibold mb-4" style={{ color: "var(--primary-color)" }}>✿ Beauty & Care ✿</p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3 text-gray-800">{site.name}</h1>
          {site.tagline && <p className="text-base font-medium mb-2" style={{ color: "var(--primary-color)" }}>{site.tagline}</p>}
          {site.description && <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-6">{site.description}</p>}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="inline-flex items-center gap-2 text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-lg transition hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, var(--primary-color), #f9a8d4)" }}>
              ✨ Booking Sekarang via WA
            </WaButton>
          )}
        </div>
      </section>

      {/* ── Info Strip ──────────────────────────────────────────── */}
      {(site.address || site.operating_hours || contactUrl) && (
        <div className="border-y py-3" style={{ borderColor: "rgba(232,121,160,0.15)", backgroundColor: "#fff8fa" }}>
          <div className="max-w-4xl mx-auto px-5 flex flex-wrap gap-4 md:gap-8 justify-center text-sm text-gray-600">
            {site.address && <span>📍 {site.address}</span>}
            {site.operating_hours && <span className="font-semibold" style={{ color: "var(--primary-color)" }}>⏰ {site.operating_hours}</span>}
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="text-xs font-bold px-4 py-1.5 rounded-full text-white"
                style={{ background: "linear-gradient(135deg, var(--primary-color), #f9a8d4)" }}>
                💬 WhatsApp
              </WaButton>
            )}
          </div>
        </div>
      )}

      {/* ── Services / Products ──────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-5 md:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed rounded-3xl" style={{ borderColor: "rgba(232,121,160,0.3)" }}>
            <p className="text-5xl mb-4">✨</p>
            <p className="text-gray-400 font-medium">Layanan segera tersedia</p>
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="mt-4 inline-block text-sm font-bold px-5 py-2 rounded-full text-white"
                style={{ background: "linear-gradient(135deg, var(--primary-color), #f9a8d4)" }}>
                💬 Tanya Layanan
              </WaButton>
            )}
          </div>
        ) : hasCategories ? (
          categories.map((cat) => {
            const catProds = products.filter((p) => p.category === cat);
            return (
              <section key={cat} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 rounded-full" style={{ background: "linear-gradient(to bottom, var(--primary-color), #f9a8d4)" }} />
                  <h2 className="text-lg font-bold text-gray-800">{cat}</h2>
                  <span className="text-xs text-gray-400 px-2 py-0.5 rounded-full" style={{ backgroundColor: "#fff1f6" }}>{catProds.length} layanan</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {catProds.map((p) => <BeautyCard key={p.id} product={p} site={site} />)}
                </div>
              </section>
            );
          })
        ) : (
          <>
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.4em] uppercase mb-2 font-semibold" style={{ color: "var(--primary-color)" }}>✿ Layanan Kami ✿</p>
              <h2 className="text-2xl font-bold text-gray-800">Perawatan Terbaik untuk Anda</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => <BeautyCard key={p.id} product={p} site={site} />)}
            </div>
          </>
        )}
      </main>
      {/* ── CTA ──────────────────────────────────────────────────── */}
      {contactUrl && (
        <section className="mx-5 md:mx-8 mb-12 rounded-3xl px-8 py-10 text-center text-white"
          style={{ background: "linear-gradient(135deg, var(--primary-color) 0%, #f9a8d4 100%)" }}>
          <p className="text-2xl font-bold mb-2">Tampil Cantik Hari Ini ✨</p>
          <p className="text-sm opacity-80 mb-5">Booking via WhatsApp sekarang — cepat, mudah, terpercaya</p>
          <WaButton href={contactUrl} slug={site.slug}
            className="inline-flex items-center gap-2 bg-white text-sm font-bold px-7 py-3 rounded-full shadow-md transition hover:opacity-90"
            style={{ color: "var(--primary-color)" }}>
            💬 Booking via WhatsApp
          </WaButton>
        </section>
      )}

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t py-10 text-center text-xs text-gray-400 space-y-1"
        style={{ borderColor: "rgba(232,121,160,0.2)", backgroundColor: "#fff8fa" }}>
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

/* ── Beauty Card ────────────────────────────────────────────────────────── */
function BeautyCard({ product, site }: { product: SiteTemplateData["products"][0]; site: SiteTemplateData["site"] }) {
  const waUrl = site.phone_wa ? buildWaProductUrl(site.phone_wa, site.name, product.name, product.formatted_price) : null;
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border flex flex-col"
      style={{ borderColor: "rgba(232,121,160,0.15)" }}>
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: "#fff1f6" }}>
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1" style={{ color: "rgba(232,121,160,0.4)" }}>
            <span className="text-3xl">✿</span>
            <span className="text-xs">Foto belum ada</span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color: "var(--primary-color)", backgroundColor: "#fff1f6" }}>Habis</span>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-semibold line-clamp-2 text-gray-800">{product.name}</p>
        {product.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>}
        <p className="text-sm font-bold mt-2" style={{ color: "var(--primary-color)" }}>{product.formatted_price}</p>
        {product.stock > 0 && waUrl && (
          <WaButton href={waUrl} slug={site.slug}
            className="mt-2 block text-center text-xs py-2 rounded-xl font-bold text-white transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, var(--primary-color), #f9a8d4)" }}>
            Booking via WA
          </WaButton>
        )}
      </div>
    </div>
  );
}

