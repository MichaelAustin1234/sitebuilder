import Image from "next/image";
import type { SiteTemplateData } from "@/lib/types";
import { WaButton, FloatingWaButton } from "@/components/WaButton";
import { buildWaContactUrl, buildWaProductUrl } from "@/lib/wa";

/**
 * WarungTemplate — Kehangatan warung lokal Indonesia.
 * Palet: merah bata/terracotta, kuning kunyit, putih gading, font bold.
 * Cocok untuk: warung makan, depot, masakan rumahan, angkringan, warteg.
 */
export default function WarungTemplate({ data }: { data: SiteTemplateData }) {
  const { site, products } = data;
  const primary = site.primary_color ?? "#b45309";
  const contactUrl = site.phone_wa ? buildWaContactUrl(site.phone_wa, site.name) : null;
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const hasCategories = categories.length > 1;

  return (
    <div className="min-h-screen font-sans"
      style={{ "--primary-color": primary, backgroundColor: "#fffbf5", color: "#292524" } as React.CSSProperties}>

      {/* ── Header / Hero ──────────────────────────────────────── */}
      <header className="relative overflow-hidden text-white" style={{ minHeight: "360px", backgroundColor: "var(--primary-color)" }}>
        {site.banner_url && (
          <Image src={site.banner_url} alt="Banner" fill className="object-cover opacity-30" priority unoptimized />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)" }} />
        {/* Batik-inspired border top */}
        <div className="absolute top-0 left-0 right-0 h-2" style={{ background: "repeating-linear-gradient(90deg, var(--primary-color) 0px, #fbbf24 8px, var(--primary-color) 16px)" }} />
        <div className="relative z-10 px-5 md:px-8 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {site.logo_url ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400/60 flex-shrink-0">
                  <Image src={site.logo_url} alt={site.name} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <span className="text-3xl">🍽️</span>
              )}
              <span className="font-extrabold text-xl tracking-wide">{site.name}</span>
            </div>
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="text-xs font-bold px-4 py-2 rounded-full border-2 border-yellow-400 text-yellow-300 transition hover:bg-yellow-400/20">
                📞 Pesan
              </WaButton>
            )}
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center px-6 pb-12 pt-8">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">{site.name}</h1>
          {site.tagline && <p className="text-yellow-300 font-bold text-base mb-2">{site.tagline}</p>}
          {site.description && <p className="text-sm text-white/70 max-w-md leading-relaxed mb-5">{site.description}</p>}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="inline-flex items-center gap-2 font-extrabold text-sm px-7 py-3 rounded-full shadow-xl transition hover:scale-105"
              style={{ backgroundColor: "#fbbf24", color: "#292524" }}>
              🍽️ Pesan Sekarang!
            </WaButton>
          )}
        </div>
      </header>

      {/* ── Info Bar ────────────────────────────────────────────── */}
      <div className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-3xl mx-auto px-5 py-3 flex flex-wrap gap-4 md:gap-8 items-center justify-center text-sm text-stone-600">
          {site.address && <span className="flex items-center gap-1.5">📍 {site.address}</span>}
          {site.operating_hours && (
            <span className="flex items-center gap-1.5 font-bold" style={{ color: "var(--primary-color)" }}>⏰ {site.operating_hours}</span>
          )}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="font-bold text-xs px-4 py-1.5 rounded-full text-white shadow-sm"
              style={{ backgroundColor: "var(--primary-color)" }}>💬 WA Kami</WaButton>
          )}
        </div>
      </div>

      {/* ── Menu ────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-5 md:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-amber-200 rounded-3xl">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-stone-400 font-medium">Menu segera tersedia</p>
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="mt-4 inline-block text-sm font-bold px-5 py-2 rounded-full text-white"
                style={{ backgroundColor: "var(--primary-color)" }}>💬 Tanya Menu</WaButton>
            )}
          </div>
        ) : hasCategories ? (
          categories.map((cat) => {
            const catProds = products.filter((p) => p.category === cat);
            return (
              <section key={cat} className="mb-10">
                <div className="flex items-center gap-2 mb-5 border-b-2 border-amber-200 pb-2">
                  <span className="text-lg">🍴</span>
                  <h2 className="text-xl font-extrabold" style={{ color: "var(--primary-color)" }}>{cat}</h2>
                  <span className="ml-auto text-xs text-stone-400">{catProds.length} menu</span>
                </div>
                <div className="space-y-3">
                  {catProds.map((p) => <WarungRow key={p.id} product={p} site={site} />)}
                </div>
              </section>
            );
          })
        ) : (
          <>
            <div className="flex items-center gap-2 mb-8 border-b-2 border-amber-200 pb-3">
              <span className="text-xl">🍴</span>
              <h2 className="text-2xl font-extrabold" style={{ color: "var(--primary-color)" }}>Daftar Menu</h2>
            </div>
            <div className="space-y-3">
              {products.map((p) => <WarungRow key={p.id} product={p} site={site} />)}
            </div>
          </>
        )}
      </main>
      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="text-white py-10 text-center text-sm" style={{ backgroundColor: "var(--primary-color)" }}>
        <p className="font-extrabold text-xl mb-2">{site.name}</p>
        {site.address && <p className="text-xs opacity-80 mb-1">📍 {site.address}</p>}
        {site.operating_hours && <p className="text-xs mb-3" style={{ color: "#fde68a" }}>⏰ {site.operating_hours}</p>}
        {contactUrl && (
          <WaButton href={contactUrl} slug={site.slug}
            className="inline-flex items-center gap-2 font-bold text-xs px-5 py-2.5 rounded-full mb-3"
            style={{ backgroundColor: "#fbbf24", color: "#292524" }}>
            💬 Chat WhatsApp
          </WaButton>
        )}
        <p className="block text-xs opacity-50">© {new Date().getFullYear()} {site.name}. Dibuat dengan UMKM Sitebuilder.</p>
      </footer>

      {contactUrl && <FloatingWaButton href={contactUrl} slug={site.slug} />}
    </div>
  );
}

/* ── Warung Row (menu list style) ─────────────────────────────────────── */
function WarungRow({ product, site }: { product: SiteTemplateData["products"][0]; site: SiteTemplateData["site"] }) {
  const waUrl = site.phone_wa ? buildWaProductUrl(site.phone_wa, site.name, product.name, product.formatted_price) : null;
  return (
    <div className="group flex items-center gap-4 bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow border border-amber-50">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-amber-50">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl opacity-40">🍽️</div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-xs font-bold text-red-500">Habis</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-stone-800 line-clamp-1">{product.name}</p>
        {product.description && <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{product.description}</p>}
        <p className="font-extrabold text-base mt-1" style={{ color: "var(--primary-color)" }}>{product.formatted_price}</p>
      </div>
      {product.stock > 0 && waUrl && (
        <WaButton href={waUrl} slug={site.slug}
          className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl text-white transition hover:opacity-90"
          style={{ backgroundColor: "var(--primary-color)" }}>
          Pesan
        </WaButton>
      )}
    </div>
  );
}

