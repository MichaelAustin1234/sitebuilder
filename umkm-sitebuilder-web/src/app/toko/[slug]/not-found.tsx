import Link from "next/link";

/**
 * Custom 404 – ditampilkan saat notFound() dipanggil dari toko/[slug]/page.tsx
 * (toko tidak ditemukan atau belum dipublikasikan).
 */
export default function TokoNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <p className="text-6xl font-bold text-gray-200 select-none">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-700">
        Toko tidak ditemukan
      </h1>
      <p className="mt-2 text-sm text-gray-500 max-w-sm">
        Toko yang kamu cari mungkin belum dipublikasikan atau alamatnya salah.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-gray-800 px-6 py-2 text-sm text-white hover:bg-gray-700 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}

