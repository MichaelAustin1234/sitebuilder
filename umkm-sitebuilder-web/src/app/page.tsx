/**
 * page.tsx — Landing Page Marketing UMKM Sitebuilder
 *
 * Server Component: tidak ada JS bundle ke browser, SEO optimal, loading kilat.
 * Sections: Hero → Stats → Features → How It Works → Templates → CTA Footer
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UMKM Sitebuilder — Toko Online Gratis untuk UMKM Indonesia",
  description:
    "Buat toko online profesional dalam 5 menit. Tanpa coding, tanpa biaya setup. Dilengkapi WhatsApp order, QR code, dan template cantik. Khusus UMKM Indonesia.",
};

// ── Static data ───────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: "🎨",
    title: "3 Template Profesional",
    desc: "Pilih antara Minimalis, Kuliner, atau Fashion. Semua responsif dan dapat dikustomisasi warna serta konten secara real-time.",
  },
  {
    icon: "💬",
    title: "Integrasi WhatsApp",
    desc: 'Tombol "Pesan via WA" otomatis di setiap produk dengan pesan yang sudah terformat. Floating button di semua halaman toko.',
  },
  {
    icon: "📱",
    title: "QR Code Toko",
    desc: "Generate QR code dengan logo toko di tengah. Download PNG, salin URL, atau bagikan langsung via WhatsApp — satu klik.",
  },
  {
    icon: "📊",
    title: "Analitik Dasar",
    desc: "Pantau jumlah pengunjung dan klik WhatsApp dari dashboard. Insight sederhana untuk memahami performa toko Anda.",
  },
  {
    icon: "🔒",
    title: "Aman & Terpercaya",
    desc: "Autentikasi berbasis token dengan cookie httpOnly. Data produk dan toko tersimpan aman di server Anda sendiri.",
  },
  {
    icon: "⚡",
    title: "Loading Super Cepat",
    desc: "Dibangun dengan Next.js 16 + Server Components. Halaman toko dirender di server — SEO optimal sejak hari pertama.",
  },
];

const STEPS = [
  { num: "01", title: "Daftar Gratis", desc: "Buat akun dalam 30 detik. Tidak perlu kartu kredit." },
  { num: "02", title: "Isi Data Toko", desc: "Unggah logo, isi nama, deskripsi, dan nomor WhatsApp." },
  { num: "03", title: "Tambah Produk", desc: "Upload foto, isi nama, harga, dan kategori produk Anda." },
  { num: "04", title: "Publish & Bagikan", desc: "Aktifkan toko dan bagikan URL atau QR code ke pelanggan." },
];

const TEMPLATES = [
  {
    name: "Minimalis",
    emoji: "🪴",
    desc: "Bersih dan elegan. Cocok untuk aksesoris, kerajinan, atau lifestyle.",
    bg: "bg-slate-50",
    badge: "bg-slate-700 text-white",
  },
  {
    name: "Kuliner",
    emoji: "🍜",
    desc: "Hangat dan menggugah selera. Ideal untuk warung makan dan katering.",
    bg: "bg-amber-50",
    badge: "bg-amber-600 text-white",
  },
  {
    name: "Fashion",
    emoji: "👗",
    desc: "Modern dan stylish. Sempurna untuk butik pakaian dan aksesoris.",
    bg: "bg-rose-50",
    badge: "bg-rose-600 text-white",
  },
];

const STATS = [
  { value: "5 menit", label: "Waktu setup rata-rata" },
  { value: "3", label: "Template profesional" },
  { value: "100%", label: "Gratis, tanpa biaya setup" },
  { value: "90+", label: "Target Lighthouse Score" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg text-indigo-600 tracking-tight">UMKM Sitebuilder</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-indigo-600 transition px-3 py-1.5">
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-indigo-600 text-white rounded-full px-5 py-2 hover:bg-indigo-700 transition"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6 text-center bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 mb-6 tracking-wide uppercase">
            🇮🇩 Khusus UMKM Indonesia
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Toko Online Profesional<br />
            <span className="text-indigo-600">dalam 5 Menit</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Tanpa coding. Tanpa biaya. Pilih template, isi produk, dan bagikan link toko Anda — selesai.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-block bg-indigo-600 text-white font-semibold rounded-2xl px-8 py-4 text-base hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              Buat Toko Sekarang →
            </Link>
            <Link
              href="/login"
              className="inline-block bg-white text-gray-700 font-medium rounded-2xl px-8 py-4 text-base border border-gray-200 hover:border-indigo-300 transition"
            >
              Sudah punya akun? Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-indigo-600 mb-1">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Semua yang Anda Butuhkan</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Fitur lengkap tanpa kerumitan — dirancang untuk pelaku UMKM yang ingin fokus berjualan.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition group">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cara Kerja</h2>
            <p className="text-gray-500 text-lg">Empat langkah mudah — toko Anda sudah online hari ini.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="relative p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                <p className="text-4xl font-black text-indigo-200 mb-3 leading-none">{step.num}</p>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pilih Template Anda</h2>
            <p className="text-gray-500 text-lg max-w-lg mx-auto">Tiga desain profesional yang bisa dikustomisasi warna dan kontennya secara langsung.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMPLATES.map((t) => (
              <div key={t.name} className={`rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition group ${t.bg}`}>
                <div className="flex items-center justify-center py-14 text-6xl">{t.emoji}</div>
                <div className="bg-white p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${t.badge}`}>{t.name}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6 bg-indigo-600 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Jualan Online?</h2>
          <p className="text-indigo-200 text-lg mb-10">Bergabunglah sekarang dan buat toko pertama Anda dalam hitungan menit.</p>
          <Link
            href="/register"
            className="inline-block bg-white text-indigo-700 font-bold rounded-2xl px-10 py-4 text-base hover:bg-indigo-50 transition shadow-xl"
          >
            Daftar Gratis Sekarang →
          </Link>
          <p className="mt-6 text-xs text-indigo-300">Tidak perlu kartu kredit • Tidak ada biaya tersembunyi</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 bg-gray-900 text-center text-gray-500 text-sm">
        <p className="font-semibold text-white mb-1">UMKM Sitebuilder</p>
        <p>Dibangun dengan ❤️ untuk UMKM Indonesia</p>
        <div className="mt-4 flex justify-center gap-6 text-xs">
          <Link href="/login" className="hover:text-white transition">Masuk</Link>
          <Link href="/register" className="hover:text-white transition">Daftar</Link>
        </div>
      </footer>

    </div>
  );
}

