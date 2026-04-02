import Image from "next/image";
import type { SiteTemplateData } from "@/lib/types";
import { WaButton, FloatingWaButton } from "@/components/WaButton";
import { buildWaContactUrl, buildWaProductUrl } from "@/lib/wa";

/**
 * FashionTemplate — Elegan & premium, foto dominan.
 * Palet: hitam pekat, putih bersih, warna aksen emas/kuning dari --primary-color.
 * Cocok untuk pakaian, aksesoris, kecantikan, parfum.
 */
export default function FashionTemplate({ data }: { data: SiteTemplateData }) {
  const { site, products } = data;
  const primary = site.primary_color ?? "#eab308";
  const contactUrl = site.phone_wa ? buildWaContactUrl(site.phone_wa, site.name) : null;

  return (
    <div
      className="min-h-screen bg-neutral-950 text-white font-sans"
      style={{ "--primary-color": primary } as React.CSSProperties}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="flex items-center gap-3">
          {site.logo_url && (
            <div className="relative w-9 h-9 rounded-full overflow-hidden" style={{ border: "1.5px solid var(--primary-color)" }}>
              <Image src={site.logo_url} alt={site.name} fill className="object-cover" unoptimized />
            </div>
          )}
          <span className="text-base font-light tracking-[0.25em] uppercase">{site.name}</span>
        </div>
        <div className="flex items-center gap-4">
          {site.operating_hours && (
            <span className="hidden md:block text-xs text-neutral-500 tracking-widest">⏰ {site.operating_hours}</span>
          )}
          {contactUrl && (
            <WaButton
              href={contactUrl}
              slug={site.slug}
              className="text-xs tracking-[0.15em] uppercase px-5 py-2 rounded-none transition hover:bg-neutral-800"
              style={{ border: "1px solid var(--primary-color)", color: "var(--primary-color)" }}
            >
              Hubungi
            </WaButton>
          )}
        </div>
      </header>

      {/* ── Hero Banner ────────────────────────────────────────── */}
      {site.banner_url ? (
        <div className="relative w-full h-72 md:h-[500px] overflow-hidden">
          <Image src={site.banner_url} alt="Banner" fill className="object-cover opacity-50" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/20 via-transparent to-neutral-950/80" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-center">
            <p className="text-xs tracking-[0.5em] uppercase mb-3 font-medium" style={{ color: "var(--primary-color)" }}>
              ✦ Koleksi Terbaru ✦
            </p>
            <h1 className="text-3xl md:text-6xl font-thin tracking-[0.1em] uppercase drop-shadow">{site.name}</h1>
            {site.tagline && (
              <p className="mt-2 text-sm font-medium tracking-widest" style={{ color: "var(--primary-color)" }}>{site.tagline}</p>
            )}
            {site.description && (
              <p className="mt-3 text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">{site.description}</p>
            )}
            {contactUrl && (
              <WaButton
                href={contactUrl}
                slug={site.slug}
                className="mt-6 inline-block text-white text-xs tracking-[0.2em] uppercase px-8 py-3 transition hover:opacity-90"
                style={{ backgroundColor: "var(--primary-color)", color: "#000" }}
              >
                Shop Now
              </WaButton>
            )}
          </div>
        </div>
      ) : (
        <div className="py-20 text-center px-6 border-b border-neutral-800">
          <p className="text-xs tracking-[0.5em] uppercase mb-4 font-medium" style={{ color: "var(--primary-color)" }}>✦ Koleksi Terbaru ✦</p>
          <h1 className="text-4xl md:text-6xl font-thin tracking-[0.1em] uppercase">{site.name}</h1>
          {site.tagline && <p className="mt-3 text-sm tracking-widest" style={{ color: "var(--primary-color)" }}>{site.tagline}</p>}
          {site.description && <p className="mt-4 text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">{site.description}</p>}
        </div>
      )}

      {/* ── Products Grid ──────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase font-medium mb-1" style={{ color: "var(--primary-color)" }}>Our Collection</p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ backgroundColor: "var(--primary-color)" }} />
            <span className="text-xs tracking-[0.3em] text-neutral-400 uppercase">Produk</span>
            <div className="h-px w-16" style={{ backgroundColor: "var(--primary-color)" }} />
          </div>
        </div>

        {products.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-16 tracking-widest">BELUM ADA PRODUK TERSEDIA</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] bg-neutral-800 overflow-hidden mb-3">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 gap-2">
                      <span className="text-3xl">👗</span>
                      <span className="text-xs tracking-widest uppercase">Foto</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-xs tracking-[0.2em] uppercase text-white border border-white/60 px-4 py-1.5">
                        Habis
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs font-light tracking-[0.1em] line-clamp-2 text-neutral-200">{product.name}</p>
                {product.category && (
                  <p className="text-xs tracking-widest text-neutral-500 mt-0.5 uppercase">{product.category}</p>
                )}
                <p className="text-sm mt-1 font-medium" style={{ color: "var(--primary-color)" }}>{product.formatted_price}</p>
                {product.stock > 0 && site.phone_wa && (
                  <WaButton
                    href={buildWaProductUrl(site.phone_wa, site.name, product.name, product.formatted_price)}
                    slug={site.slug}
                    className="mt-3 block text-center text-xs py-2 tracking-[0.15em] uppercase transition hover:opacity-80 font-medium"
                    style={{ border: "1px solid var(--primary-color)", color: "var(--primary-color)" }}
                  >
                    Pesan via WA
                  </WaButton>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-800 py-10 text-center">
        <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--primary-color)" }}>{site.name}</p>
        {site.address && <p className="text-xs text-neutral-500 mb-1 tracking-widest uppercase">{site.address}</p>}
        {site.operating_hours && <p className="text-xs text-neutral-500 mb-3">⏰ {site.operating_hours}</p>}
        {contactUrl && (
          <WaButton href={contactUrl} slug={site.slug} className="inline-block text-xs tracking-[0.2em] uppercase mb-4 hover:opacity-70 transition" style={{ color: "var(--primary-color)" }}>
            💬 Chat WhatsApp
          </WaButton>
        )}
        <p className="block text-xs text-neutral-700 tracking-widest uppercase">© {new Date().getFullYear()} {site.name}</p>
      </footer>

      {contactUrl && <FloatingWaButton href={contactUrl} slug={site.slug} />}
    </div>
  );
}

