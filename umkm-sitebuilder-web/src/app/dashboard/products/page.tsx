"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, ProductListData, PaginationMeta, CreateProductPayload } from "@/lib/types";
import ProductForm from "@/components/ProductForm";
import { ProductTableSkeleton } from "@/components/ui/Skeleton";
import { NoProductsEmptyState } from "@/components/ui/EmptyState";
import { SectionError } from "@/components/ui/ErrorBoundary";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Filters {
  category: string;
  is_active: string; // ""|"true"|"false"
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "makanan","minuman","pakaian","elektronik",
  "kerajinan","kosmetik","pertanian","lainnya",
];

const columnHelper = createColumnHelper<Product>();

// ── Delete Confirm Dialog ─────────────────────────────────────────────────────

function DeleteDialog({
  product,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h3 className="text-base font-semibold text-gray-800 mb-2">Hapus Produk?</h3>
        <p className="text-sm text-gray-600 mb-5">
          Produk <span className="font-medium text-gray-800">&quot;{product.name}&quot;</span> akan
          dihapus dan tidak akan tampil di website. Data tetap tersimpan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition"
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Wrapper ─────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 py-10 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
    }`}>
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: 12, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ category: "", is_active: "" });
  const [page, setPage] = useState(1);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch products ───────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (filters.category) params.set("category", filters.category);
      if (filters.is_active !== "") params.set("is_active", filters.is_active);

      const res = await fetch(`/api/dashboard/products?${params.toString()}`);
      const json = await res.json();

      if (res.ok) {
        const d = json.data as ProductListData;
        setProducts(d.products);
        setMeta(d.meta);
      } else {
        const msg = json.message ?? "Gagal memuat produk.";
        setFetchError(msg);
        toast.error(msg);
      }
    } catch {
      const msg = "Terjadi kesalahan jaringan. Periksa koneksi Anda.";
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleAdd = useCallback(async (payload: CreateProductPayload) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw json;
      toast.success(json.message ?? "Produk berhasil ditambahkan.");
      setShowAddModal(false);
      setPage(1);
      fetchProducts();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Gagal menambah produk.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchProducts]);

  const handleEdit = useCallback(async (payload: CreateProductPayload) => {
    if (!editProduct) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/dashboard/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw json;
      toast.success(json.message ?? "Produk berhasil diupdate.");
      setEditProduct(null);
      fetchProducts();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Gagal mengupdate produk.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [editProduct, fetchProducts]);

  const handleDelete = useCallback(async () => {
    if (!deleteProduct) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/dashboard/products/${deleteProduct.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw json;
      toast.success(json.message ?? "Produk berhasil dihapus.");
      setDeleteProduct(null);
      fetchProducts();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Gagal menghapus produk.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteProduct, fetchProducts]);

  // ── Table columns ────────────────────────────────────────────────────────────

  const columns = useMemo(() => [
    columnHelper.accessor("image_url", {
      header: "Foto",
      cell: (info) => {
        const url = info.getValue();
        return url ? (
          <div className="relative w-10 h-10 rounded overflow-hidden">
            <Image src={url} alt="foto" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-300 text-xs">—</div>
        );
      },
    }),
    columnHelper.accessor("name", {
      header: "Nama Produk",
      cell: (info) => <span className="font-medium text-gray-800">{info.getValue()}</span>,
    }),
    columnHelper.accessor("formatted_price", {
      header: "Harga",
      cell: (info) => <span className="text-gray-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor("stock", {
      header: "Stok",
      cell: (info) => <span className="text-gray-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor("category", {
      header: "Kategori",
      cell: (info) => (
        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("is_active", {
      header: "Status",
      cell: (info) => <StatusBadge active={info.getValue()} />,
    }),
    columnHelper.display({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => setEditProduct(row.original)}
            className="text-xs text-indigo-600 hover:underline"
          >Edit</button>
          <button
            onClick={() => setDeleteProduct(row.original)}
            className="text-xs text-red-500 hover:underline"
          >Hapus</button>
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: meta.last_page,
  });

  // ── Filter change helpers ────────────────────────────────────────────────────

  function handleFilterChange(key: keyof Filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const hasFilters = filters.category !== "" || filters.is_active !== "";

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-4 sm:p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Produk</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isLoading ? "Memuat..." : `Total ${meta.total} produk`}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 active:scale-95 transition w-full sm:w-auto justify-center"
          >
            <span>+</span> Tambah Produk
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">Semua Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <select
            value={filters.is_active}
            onChange={(e) => handleFilterChange("is_active", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
        </div>

        {/* Table area */}
        {isLoading ? (
          <ProductTableSkeleton />
        ) : fetchError ? (
          <SectionError message={fetchError} onRetry={fetchProducts} />
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <NoProductsEmptyState
              onAdd={() => setShowAddModal(true)}
              filtered={hasFilters}
            />
          </div>
        ) : (
          <motion.div
            className="bg-white rounded-xl shadow overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && meta.last_page > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
            <p className="text-sm text-gray-500">
              Halaman {meta.current_page} dari {meta.last_page}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.current_page <= 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition"
              >
                ← Sebelumnya
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={meta.current_page >= meta.last_page}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition"
              >
                Berikutnya →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animated Modals */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            key="add-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Modal title="Tambah Produk Baru" onClose={() => setShowAddModal(false)}>
              <ProductForm
                onSubmit={handleAdd}
                onCancel={() => setShowAddModal(false)}
                isSubmitting={isSubmitting}
              />
            </Modal>
          </motion.div>
        )}
        {editProduct && (
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Modal title="Edit Produk" onClose={() => setEditProduct(null)}>
              <ProductForm
                initialData={editProduct}
                onSubmit={handleEdit}
                onCancel={() => setEditProduct(null)}
                isSubmitting={isSubmitting}
              />
            </Modal>
          </motion.div>
        )}
        {deleteProduct && (
          <motion.div
            key="delete-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DeleteDialog
              product={deleteProduct}
              onConfirm={handleDelete}
              onCancel={() => setDeleteProduct(null)}
              isDeleting={isDeleting}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

