"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { DashboardStatSkeleton } from "@/components/ui/Skeleton";

const NAV_ITEMS = [
  {
    href: "/dashboard/products",
    icon: "📦",
    title: "Manajemen Produk",
    description: "Tambah, edit, dan hapus produk toko Anda.",
    color: "indigo",
  },
  {
    href: "/dashboard/theme",
    icon: "🎨",
    title: "Kustomisasi Tema",
    description: "Atur warna, tagline, jam operasional, dan status publikasi.",
    color: "violet",
  },
  {
    href: "/dashboard/qrcode",
    icon: "📱",
    title: "QR Code Toko",
    description: "Generate dan download QR code untuk dibagikan ke pelanggan.",
    color: "emerald",
  },
];

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-7 w-28 bg-gray-200 animate-pulse rounded-md" />
            <div className="h-4 w-12 bg-gray-200 animate-pulse rounded-md" />
          </div>
          <div className="bg-gray-200 animate-pulse rounded-xl h-20 mb-6" />
          <DashboardStatSkeleton />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-4 sm:p-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-700 hover:underline transition"
          >
            Keluar
          </button>
        </div>

        {/* Welcome card */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <p className="text-gray-600">
            Selamat datang,{" "}
            <span className="font-semibold text-indigo-700">{user?.name}</span>! 👋
          </p>
          <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
        </motion.div>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {NAV_ITEMS.map((item, idx) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + idx * 0.07 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group border border-transparent hover:border-indigo-100 h-full"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h2 className="text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

