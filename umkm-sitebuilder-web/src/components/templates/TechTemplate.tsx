import Image from "next/image";
import type { SiteTemplateData } from "@/lib/types";
import { WaButton, FloatingWaButton } from "@/components/WaButton";
import { buildWaContactUrl, buildWaProductUrl } from "@/lib/wa";

/**
 * TechTemplate v2 — Professional agency/services design.
 * Dark navbar, hero dengan gradient accent, feature highlights, service cards premium.
 * Cocok untuk: jasa digital, bengkel, laundry, konsultasi, klinik, salon.
 */
export default function TechTemplate({ data }: { data: SiteTemplateData }) {
  const { site, products } = data;
  const primary = site.primary_color ?? "#2563eb";
  const contactUrl = site.phone_wa ? buildWaContactUrl(site.phone_wa, site.name) : null;
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const hasCategories = categories.length > 1;

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-800 font-sans"
      style={{ "--primary-color": primary } as React.CSSProperties}
    >
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="bg-slate-900 text-white px-5 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          {site.logo_url ? (
            <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/20">
              <Image src={site.logo_url} alt={site.name} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: "var(--primary-color)" }}>
              {site.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <span className="font-bold text-base tracking-tight">{site.name}</span>
            {site.tagline && <span className="hidden md:inline ml-2 text-xs text-slate-400">{site.tagline}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {site.operating_hours && <span className="hidden lg:block text-xs text-slate-400 border border-slate-700 rounded-full px-3 py-1">⏰ {site.operating_hours}</span>}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="text-xs md:text-sm px-4 py-2 rounded-lg font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: "var(--primary-color)" }}>
              💬 Konsultasi
            </WaButton>
          )}
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative bg-slate-900 text-white overflow-hidden" style={{ minHeight: "360px" }}>
        {site.banner_url && <Image src={site.banner_url} alt="Banner" fill className="object-cover opacity-15" priority unoptimized />}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 40%, #0f172a) 0%, #0f172a 70%)" }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-24 flex flex-col items-start">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6 border border-white/20"
            style={{ backgroundColor: "color-mix(in srgb, var(--primary-color) 30%, transparent)", color: "var(--primary-color)" }}>
            ✦ Layanan Profesional
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 max-w-2xl">{site.name}</h1>
          {site.tagline && <p className="text-lg font-semibold mb-3" style={{ color: "oklch(80% 0.15 250)" }}>{site.tagline}</p>}
          {site.description && <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed mb-6">{site.description}</p>}
          <div className="flex flex-wrap gap-3">
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="inline-flex items-center gap-2 text-white text-sm font-bold px-6 py-3 rounded-xl transition hover:opacity-90 shadow-lg"
                style={{ backgroundColor: "var(--primary-color)" }}>
                💬 Konsultasi Gratis via WA
              </WaButton>
            )}
            {site.operating_hours && (
              <span className="inline-flex items-center gap-2 text-sm text-slate-300 border border-slate-700 px-4 py-3 rounded-xl">
                ⏰ {site.operating_hours}
              </span>
            )}
          </div>
        </div>
        {/* Stats/features strip */}
        {(site.address || products.length > 0) && (
          <div className="relative z-10 border-t border-white/10">
            <div className="max-w-5xl mx-auto px-5 md:px-8 py-4 flex flex-wrap gap-6 text-sm text-slate-400">
              {site.address && <span>📍 {site.address}</span>}
              {products.length > 0 && <span style={{ color: "var(--primary-color)" }}>✓ {products.length}+ Layanan Tersedia</span>}
            </div>
          </div>
        )}
      </section>

      {/* ── Products / Services ────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-5 md:px-8 py-14">
        {products.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-5xl mb-4">⚙️</p>
            <p className="text-slate-400 font-medium">Layanan segera tersedia</p>
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="mt-4 inline-block text-sm font-bold px-5 py-2 rounded-xl text-white"
                style={{ backgroundColor: "var(--primary-color)" }}>
                💬 Tanya Layanan
              </WaButton>
            )}
          </div>
        ) : hasCategories ? (
          categories.map((cat) => {
            const catProducts = products.filter((p) => p.category === cat);
            return (
              <section key={cat} className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: "var(--primary-color)" }} />
                  <h2 className="text-xl font-bold text-slate-800">{cat}</h2>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {catProducts.map((product) => <ServiceCard key={product.id} product={product} site={site} />)}
                </div>
              </section>
            );
          })
        ) : (
          <>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900">Produk &amp; Layanan Kami</h2>
              <p className="text-slate-500 text-sm mt-1">Solusi terbaik untuk kebutuhan Anda</p>
              <div className="mt-4 mx-auto w-12 h-1 rounded-full" style={{ backgroundColor: "var(--primary-color)" }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => <ServiceCard key={product.id} product={product} site={site} />)}
            </div>
          </>
        )}
      </main>

      {/* ── CTA Banner ─────────────────────────────────────────────────── */}
      {contactUrl && (
        <section className="bg-slate-900 text-white py-16 text-center px-6">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3">Siap untuk memulai?</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">Konsultasikan kebutuhan Anda dengan kami sekarang — gratis!</p>
          <WaButton href={contactUrl} slug={site.slug}
            className="inline-flex items-center gap-2 text-white text-sm font-bold px-8 py-3.5 rounded-xl transition hover:opacity-90 shadow-lg"
            style={{ backgroundColor: "var(--primary-color)" }}>
            💬 Hubungi via WhatsApp
          </WaButton>
        </section>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-8 text-center text-xs space-y-1">
        <p className="text-slate-200 font-bold text-sm">{site.name}</p>
        {site.address && <p>📍 {site.address}</p>}
        {site.operating_hours && <p>⏰ {site.operating_hours}</p>}
        {contactUrl && (
          <WaButton href={contactUrl} slug={site.slug} className="inline-block font-semibold hover:text-white transition" style={{ color: "var(--primary-color)" }}>
            💬 {site.phone_wa}
          </WaButton>
        )}
        <p className="pt-2 text-slate-600">© {new Date().getFullYear()} {site.name}. Dibuat dengan UMKM Sitebuilder.</p>
      </footer>

      {contactUrl && <FloatingWaButton href={contactUrl} slug={site.slug} />}
    </div>
  );
}

/* ── Service Card Component ─────────────────────────────────────────────── */
function ServiceCard({ product, site }: { product: SiteTemplateData["products"][0]; site: SiteTemplateData["site"] }) {
  const waUrl = site.phone_wa ? buildWaProductUrl(site.phone_wa, site.name, product.name, product.formatted_price) : null;
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col group border border-slate-100">
      <div className="relative w-full aspect-video bg-slate-100">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
            <span className="text-3xl">⚙️</span>
            <span className="text-xs tracking-wide">Foto belum ada</span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">Tidak Tersedia</span>
          </div>
        )}
        {product.category && (
          <span className="absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-full text-white shadow-sm"
            style={{ backgroundColor: "var(--primary-color)" }}>
            {product.category}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="font-bold text-slate-800 line-clamp-2 mb-1">{product.name}</p>
        {product.description && <p className="text-xs text-slate-500 line-clamp-3 flex-1 leading-relaxed">{product.description}</p>}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-extrabold text-base" style={{ color: "var(--primary-color)" }}>{product.formatted_price}</span>
          {product.stock > 0 && waUrl && (
            <WaButton href={waUrl} slug={site.slug}
              className="text-xs px-4 py-2 rounded-xl text-white font-semibold transition hover:opacity-90 flex-shrink-0"
              style={{ backgroundColor: "var(--primary-color)" }}>
              Pesan
            </WaButton>
          )}
        </div>
      </div>
    </div>
  );
}

