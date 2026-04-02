"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import type { Product, CreateProductPayload } from "@/lib/types";

export interface ProductFormValues {
  name: string;
  description: string;
  price: string; // string agar bisa format Rupiah di input
  stock: string;
  category: string;
  image_url: string;
  is_active: boolean;
}

interface ProductFormProps {
  /** Produk yang sedang diedit. Jika undefined → mode tambah */
  initialData?: Product;
  onSubmit: (payload: CreateProductPayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const CATEGORIES = [
  "makanan",
  "minuman",
  "pakaian",
  "elektronik",
  "kerajinan",
  "kosmetik",
  "pertanian",
  "lainnya",
];

/** Format angka menjadi string Rupiah dengan titik pemisah ribuan */
function formatRupiah(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Kembalikan string angka ke number (hapus titik) */
function parseRupiah(value: string): number {
  return parseInt(value.replace(/\./g, "") || "0", 10);
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData ? formatRupiah(String(initialData.price)) : "",
      stock: initialData ? String(initialData.stock) : "",
      category: initialData?.category ?? "",
      image_url: initialData?.image_url ?? "",
      is_active: initialData?.is_active ?? true,
    },
  });

  const imageUrl = watch("image_url");
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "error">("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url ?? null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setUploadError("Format tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Ukuran foto maksimal 2 MB.");
      return;
    }

    // Tampilkan preview lokal dulu
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError(null);
    setUploadState("uploading");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/dashboard/products/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.data?.errors?.image?.[0] ?? json?.message ?? "Upload gagal.";
        setUploadError(msg);
        setPreviewUrl(initialData?.image_url ?? null);
        setUploadState("error");
        return;
      }
      setValue("image_url", json.data.image_url);
      setUploadState("idle");
    } catch {
      setUploadError("Terjadi kesalahan jaringan.");
      setPreviewUrl(initialData?.image_url ?? null);
      setUploadState("error");
    }
  }

  async function onFormSubmit(values: ProductFormValues) {
    await onSubmit({
      name: values.name,
      description: values.description || undefined,
      price: parseRupiah(values.price),
      stock: parseInt(values.stock || "0", 10),
      category: values.category,
      image_url: values.image_url || undefined,
      is_active: values.is_active,
    });
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Foto Produk */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden cursor-pointer flex items-center justify-center"
          onClick={() => uploadState !== "uploading" && inputRef.current?.click()}
          title="Klik untuk pilih foto"
        >
          {previewUrl ? (
            <Image src={previewUrl} alt="Foto produk" fill className="object-cover" unoptimized />
          ) : (
            <span className="text-gray-400 text-xs text-center px-1">Foto produk</span>
          )}
          {uploadState === "uploading" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={handleImageChange} disabled={uploadState === "uploading"} />
        {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
        {imageUrl && uploadState === "idle" && !uploadError && (
          <p className="text-xs text-green-600">✓ Foto berhasil diupload</p>
        )}
        {/* Hidden field untuk image_url */}
        <input type="hidden" {...register("image_url")} />
      </div>

      {/* Nama */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Contoh: Nasi Goreng Spesial"
          {...register("name", { required: "Nama produk wajib diisi." })}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Deskripsi singkat produk..."
          {...register("description")}
        />
      </div>

      {/* Harga & Stok */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) *</label>
          <input
            type="text"
            inputMode="numeric"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="25.000"
            {...register("price", {
              required: "Harga wajib diisi.",
              validate: (v) => parseRupiah(v) >= 0 || "Harga tidak boleh negatif.",
            })}
            onChange={(e) => {
              const formatted = formatRupiah(e.target.value);
              setValue("price", formatted);
            }}
          />
          {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
          <input
            type="number"
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0"
            {...register("stock", {
              required: "Stok wajib diisi.",
              min: { value: 0, message: "Stok tidak boleh negatif." },
            })}
          />
          {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
        </div>
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("category", { required: "Kategori wajib dipilih." })}
        >
          <option value="">Pilih kategori...</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
      </div>

      {/* Toggle Aktif */}
      <div className="flex items-center gap-3">
        <input type="checkbox" id="is_active" className="w-4 h-4 accent-indigo-600" {...register("is_active")} />
        <label htmlFor="is_active" className="text-sm text-gray-700">Produk aktif (tampil di website)</label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || uploadState === "uploading"}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {isSubmitting ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambah Produk"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

