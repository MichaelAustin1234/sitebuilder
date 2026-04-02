import Image from "next/image";
import type { SiteTemplateData } from "@/lib/types";
import { WaButton, FloatingWaButton } from "@/components/WaButton";
import { buildWaContactUrl, buildWaProductUrl } from "@/lib/wa";

/**
 * CafeTemplate — Dark moody coffee shop aesthetic.
 * Palet: cokelat tua, krem hangat, amber/gold accent.
 * Cocok untuk: coffee shop, kedai kopi, roastery, dessert café.
 */
export default function CafeTemplate({ data }: { data: SiteTemplateData }) {
  const { site, products } = data;
  const primary = site.primary_color ?? "#d97706";
  const contactUrl = site.phone_wa ? buildWaContactUrl(site.phone_wa, site.name) : null;
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const hasCategories = categories.length > 1;

  return (
    <div className="min-h-screen font-sans"
      style={{ "--primary-color": primary, backgroundColor: "#1c1410", color: "#f5f0e8" } as React.CSSProperties}>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <header className="relative overflow-hidden" style={{ minHeight: "420px" }}>
        {site.banner_url && (
          <Image src={site.banner_url} alt="Banner" fill className="object-cover opacity-30" priority unoptimized />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #1c1410 0%, rgba(28,20,16,0.6) 40%, #1c1410 100%)" }} />
        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")" }} />
        <nav className="relative z-20 flex items-center justify-between px-5 md:px-8 py-4">
          <div className="flex items-center gap-3">
            {site.logo_url ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-400/60 flex-shrink-0">
                <Image src={site.logo_url} alt={site.name} fill className="object-cover" unoptimized />
              </div>
            ) : (
              <span className="text-2xl">☕</span>
            )}
            <span className="font-bold text-lg tracking-wide" style={{ color: "var(--primary-color)" }}>{site.name}</span>
          </div>
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="text-xs font-bold px-4 py-2 rounded-full border transition hover:opacity-90"
              style={{ borderColor: "var(--primary-color)", color: "var(--primary-color)" }}>
              💬 Pesan
            </WaButton>
          )}
        </nav>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-16 pt-4">
          <p className="text-xs tracking-[0.4em] uppercase mb-3 font-medium" style={{ color: "var(--primary-color)" }}>✦ Specialty Coffee ✦</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-3">{site.name}</h1>
          {site.tagline && <p className="text-base font-medium mb-2 opacity-80">{site.tagline}</p>}
          {site.description && <p className="text-sm max-w-md leading-relaxed opacity-60 mb-6">{site.description}</p>}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3 rounded-full transition hover:opacity-90"
              style={{ backgroundColor: "var(--primary-color)", color: "#1c1410" }}>
              ☕ Pesan Sekarang
            </WaButton>
          )}
        </div>
        {(site.address || site.operating_hours) && (
          <div className="relative z-10 border-t py-3" style={{ borderColor: "rgba(217,119,6,0.2)" }}>
            <div className="flex flex-wrap gap-6 justify-center text-xs opacity-60 px-6">
              {site.address && <span>📍 {site.address}</span>}
              {site.operating_hours && <span style={{ color: "var(--primary-color)" }}>⏰ {site.operating_hours}</span>}
            </div>
          </div>
        )}
      </header>

      {/* ── Menu ───────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-5 md:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-24 border border-dashed rounded-2xl" style={{ borderColor: "rgba(217,119,6,0.3)" }}>
            <p className="text-5xl mb-4">☕</p>
            <p className="opacity-50 font-medium">Menu segera tersedia</p>
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="mt-4 inline-block text-sm font-bold px-5 py-2 rounded-full"
                style={{ backgroundColor: "var(--primary-color)", color: "#1c1410" }}>💬 Tanya Menu</WaButton>
            )}
          </div>
        ) : hasCategories ? (
          categories.map((cat) => {
            const catProds = products.filter((p) => p.category === cat);
            return (
              <section key={cat} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1" style={{ backgroundColor: "rgba(217,119,6,0.3)" }} />
                  <h2 className="text-sm font-bold tracking-[0.2em] uppercase px-3" style={{ color: "var(--primary-color)" }}>{cat}</h2>
                  <div className="h-px flex-1" style={{ backgroundColor: "rgba(217,119,6,0.3)" }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{catProds.map((p) => <CafeCard key={p.id} product={p} site={site} />)}</div>
              </section>
            );
          })
        ) : (
          <>
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.4em] uppercase font-medium mb-2" style={{ color: "var(--primary-color)" }}>✦ Menu Kami ✦</p>
              <h2 className="text-2xl font-bold">Pilihan Terbaik untuk Hari Anda</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{products.map((p) => <CafeCard key={p.id} product={p} site={site} />)}</div>
          </>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t py-10 text-center text-xs" style={{ borderColor: "rgba(217,119,6,0.2)", color: "rgba(245,240,232,0.5)" }}>
        <p className="font-bold text-base mb-2" style={{ color: "var(--primary-color)" }}>{site.name}</p>
        {site.address && <p className="mb-1">📍 {site.address}</p>}
        {site.operating_hours && <p className="mb-3">⏰ {site.operating_hours}</p>}
        {contactUrl && (
          <WaButton href={contactUrl} slug={site.slug} className="inline-block font-semibold mb-3 hover:opacity-80 transition" style={{ color: "var(--primary-color)" }}>
            💬 {site.phone_wa}
          </WaButton>
        )}
        <p className="block" style={{ color: "rgba(245,240,232,0.25)" }}>© {new Date().getFullYear()} {site.name}. Dibuat dengan UMKM Sitebuilder.</p>
      </footer>

      {contactUrl && <FloatingWaButton href={contactUrl} slug={site.slug} />}
    </div>
  );
}

/* ── Cafe Card ─────────────────────────────────────────────────────────── */
function CafeCard({ product, site }: { product: SiteTemplateData["products"][0]; site: SiteTemplateData["site"] }) {
  const waUrl = site.phone_wa ? buildWaProductUrl(site.phone_wa, site.name, product.name, product.formatted_price) : null;
  return (
    <div className="group flex gap-4 rounded-2xl p-4 border transition-colors hover:border-amber-700/40"
      style={{ backgroundColor: "#261d18", borderColor: "rgba(217,119,6,0.15)" }}>
      <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden" style={{ backgroundColor: "#33271f" }}>
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl opacity-40">☕</div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-xs font-bold text-red-400">Habis</span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        <div>
          <p className="font-bold text-sm line-clamp-2" style={{ color: "#f5f0e8" }}>{product.name}</p>
          {product.description && <p className="text-xs mt-1 line-clamp-2 opacity-50">{product.description}</p>}
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <p className="font-extrabold text-base" style={{ color: "var(--primary-color)" }}>{product.formatted_price}</p>
          {product.stock > 0 && waUrl && (
            <WaButton href={waUrl} slug={site.slug}
              className="text-xs px-3 py-1.5 rounded-xl font-bold transition hover:opacity-90 flex-shrink-0"
              style={{ backgroundColor: "var(--primary-color)", color: "#1c1410" }}>
              Pesan
            </WaButton>
          )}
        </div>
      </div>
    </div>
  );
}

