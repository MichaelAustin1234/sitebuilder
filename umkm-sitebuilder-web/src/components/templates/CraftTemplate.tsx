import Image from "next/image";
import type { SiteTemplateData } from "@/lib/types";
import { WaButton, FloatingWaButton } from "@/components/WaButton";
import { buildWaContactUrl, buildWaProductUrl } from "@/lib/wa";

/**
 * CraftTemplate — Artisan handmade rustic aesthetic.
 * Palet: cokelat tanah, krem alami, hijau tua, tipografi serif/bold.
 * Cocok untuk: kerajinan tangan, batik, anyaman, pottery, produk UMKM tradisional.
 */
export default function CraftTemplate({ data }: { data: SiteTemplateData }) {
  const { site, products } = data;
  const primary = site.primary_color ?? "#78350f";
  const contactUrl = site.phone_wa ? buildWaContactUrl(site.phone_wa, site.name) : null;
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const hasCategories = categories.length > 1;

  return (
    <div className="min-h-screen font-sans"
      style={{ "--primary-color": primary, backgroundColor: "#faf6f1", color: "#1c1108" } as React.CSSProperties}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-amber-950/95 backdrop-blur-sm text-amber-50 px-5 md:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {site.logo_url ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400/40 flex-shrink-0">
              <Image src={site.logo_url} alt={site.name} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <span className="text-2xl">🏺</span>
          )}
          <div>
            <p className="font-extrabold text-base leading-tight tracking-wide">{site.name}</p>
            {site.tagline && <p className="text-xs text-amber-200 opacity-70">{site.tagline}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {site.operating_hours && <span className="hidden md:block text-xs text-amber-200/60 border border-amber-400/20 rounded-full px-3 py-1">⏰ {site.operating_hours}</span>}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="text-xs font-bold px-4 py-2 rounded-full text-amber-950 transition hover:opacity-90"
              style={{ backgroundColor: "var(--primary-color)", color: "#fef3c7" }}>
              💬 Pesan
            </WaButton>
          )}
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "380px", backgroundColor: "#3b1c08" }}>
        {site.banner_url && (
          <Image src={site.banner_url} alt="Banner" fill className="object-cover opacity-40" priority unoptimized />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(28,8,3,0.3) 0%, rgba(28,8,3,0.7) 100%)" }} />
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, #d97706 0px, #d97706 1px, transparent 0px, transparent 50%)", backgroundSize: "8px 8px" }} />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 text-amber-50">
          <p className="text-xs tracking-[0.5em] uppercase font-semibold mb-5" style={{ color: "#fbbf24" }}>✦ Buatan Tangan dengan Cinta ✦</p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3 drop-shadow-lg">{site.name}</h1>
          {site.tagline && <p className="text-base font-semibold mb-3" style={{ color: "#fbbf24" }}>{site.tagline}</p>}
          {site.description && <p className="text-sm opacity-70 max-w-md leading-relaxed mb-6">{site.description}</p>}
          {contactUrl && (
            <WaButton href={contactUrl} slug={site.slug}
              className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-full shadow-xl transition hover:scale-105"
              style={{ backgroundColor: "#fbbf24", color: "#1c0803" }}>
              🏺 Pesan Handmade via WA
            </WaButton>
          )}
        </div>
      </section>

      {/* ── Info Bar ──────────────────────────────────────────────────────── */}
      {(site.address || site.operating_hours) && (
        <div className="border-b" style={{ borderColor: "rgba(120,53,15,0.15)", backgroundColor: "#fef3c7" }}>
          <div className="max-w-4xl mx-auto px-5 py-2.5 flex flex-wrap gap-4 md:gap-8 justify-center text-sm text-amber-900">
            {site.address && <span>📍 {site.address}</span>}
            {site.operating_hours && <span className="font-semibold">⏰ {site.operating_hours}</span>}
          </div>
        </div>
      )}

      {/* ── Products ──────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-5 md:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed rounded-3xl" style={{ borderColor: "rgba(120,53,15,0.25)" }}>
            <p className="text-5xl mb-4">🏺</p>
            <p className="font-medium opacity-60">Produk segera tersedia</p>
            {contactUrl && (
              <WaButton href={contactUrl} slug={site.slug}
                className="mt-4 inline-block text-sm font-bold px-5 py-2 rounded-full text-amber-50"
                style={{ backgroundColor: "var(--primary-color)" }}>💬 Tanya Produk</WaButton>
            )}
          </div>
        ) : hasCategories ? (
          categories.map((cat) => {
            const catProds = products.filter((p) => p.category === cat);
            return (
              <section key={cat} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1" style={{ backgroundColor: "rgba(120,53,15,0.25)" }} />
                  <h2 className="text-sm font-extrabold tracking-[0.3em] uppercase px-3" style={{ color: "var(--primary-color)" }}>{cat}</h2>
                  <div className="h-px flex-1" style={{ backgroundColor: "rgba(120,53,15,0.25)" }} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {catProds.map((p) => <CraftCard key={p.id} product={p} site={site} />)}
                </div>
              </section>
            );
          })
        ) : (
          <>
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.4em] uppercase font-bold mb-2" style={{ color: "var(--primary-color)" }}>✦ Koleksi Kami ✦</p>
              <h2 className="text-2xl font-extrabold">Produk Handmade Pilihan</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => <CraftCard key={p.id} product={p} site={site} />)}
            </div>
          </>
        )}
      </main>
      {/* ── CTA ──────────────────────────────────────────────────────── */}
      {contactUrl && (
        <section className="mx-5 md:mx-8 mb-12 rounded-3xl px-8 py-10 text-center text-amber-50"
          style={{ background: `linear-gradient(135deg, var(--primary-color), #92400e)` }}>
          <p className="text-xs tracking-[0.4em] uppercase font-bold mb-2" style={{ color: "#fbbf24" }}>✦ Custom Order ✦</p>
          <h3 className="text-xl md:text-2xl font-bold mb-2">Ingin Desain Khusus?</h3>
          <p className="text-sm opacity-70 mb-5">Kami menerima pesanan custom sesuai keinginan Anda</p>
          <WaButton href={contactUrl} slug={site.slug}
            className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3 rounded-full shadow-md transition hover:opacity-90"
            style={{ backgroundColor: "#fbbf24", color: "#1c0803" }}>
            💬 Diskusi Custom Order via WA
          </WaButton>
        </section>
      )}

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-10 text-center text-xs space-y-1 border-t"
        style={{ borderColor: "rgba(120,53,15,0.2)", color: "rgba(28,17,8,0.5)", backgroundColor: "#fef3c7" }}>
        <p className="font-extrabold text-sm" style={{ color: "var(--primary-color)" }}>{site.name}</p>
        {site.address && <p>📍 {site.address}</p>}
        {site.operating_hours && <p>⏰ {site.operating_hours}</p>}
        {contactUrl && (
          <WaButton href={contactUrl} slug={site.slug} className="inline-block font-semibold" style={{ color: "var(--primary-color)" }}>
            💬 {site.phone_wa}
          </WaButton>
        )}
        <p className="pt-2" style={{ color: "rgba(28,17,8,0.25)" }}>© {new Date().getFullYear()} {site.name}. Dibuat dengan UMKM Sitebuilder.</p>
      </footer>

      {contactUrl && <FloatingWaButton href={contactUrl} slug={site.slug} />}
    </div>
  );
}

/* ── Craft Card ─────────────────────────────────────────────────────────── */
function CraftCard({ product, site }: { product: SiteTemplateData["products"][0]; site: SiteTemplateData["site"] }) {
  const waUrl = site.phone_wa ? buildWaProductUrl(site.phone_wa, site.name, product.name, product.formatted_price) : null;
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col border"
      style={{ borderColor: "rgba(120,53,15,0.1)" }}>
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: "#fef3c7" }}>
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 opacity-40">
            <span className="text-3xl">🏺</span>
            <span className="text-xs">Foto belum ada</span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color: "var(--primary-color)", backgroundColor: "#fef3c7" }}>Habis</span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 3 && (
          <div className="absolute top-2 right-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "var(--primary-color)" }}>Sisa {product.stock}</div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-bold line-clamp-2 text-amber-950">{product.name}</p>
        {product.description && <p className="text-xs opacity-50 mt-1 line-clamp-2">{product.description}</p>}
        <p className="text-sm font-extrabold mt-2" style={{ color: "var(--primary-color)" }}>{product.formatted_price}</p>
        {product.stock > 0 && waUrl && (
          <WaButton href={waUrl} slug={site.slug}
            className="mt-2 block text-center text-xs py-2 rounded-xl font-bold text-amber-50 transition hover:opacity-90"
            style={{ backgroundColor: "var(--primary-color)" }}>
            Pesan via WA
          </WaButton>
        )}
      </div>
    </div>
  );
}

