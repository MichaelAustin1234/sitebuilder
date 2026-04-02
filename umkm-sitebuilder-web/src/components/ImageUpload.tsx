"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  /** URL gambar saat ini (dari database) — ditampilkan sebagai preview awal */
  currentUrl?: string | null;
  /** Dipanggil setelah upload berhasil dengan URL baru */
  onSuccess?: (logoUrl: string) => void;
  /** Dipanggil jika upload gagal */
  onError?: (message: string) => void;
}

type UploadState = "idle" | "previewing" | "uploading" | "success" | "error";

/**
 * ImageUpload — komponen upload logo toko dengan:
 * - Preview gambar sebelum diupload
 * - Progress indicator saat uploading
 * - Hapus preview jika gagal / dibatalkan
 */
export default function ImageUpload({ currentUrl, onSuccess, onError }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi sisi klien
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErrorMsg("Format tidak didukung. Gunakan JPG, PNG, atau WebP.");
      setState("error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Ukuran file maksimal 2 MB.");
      setState("error");
      return;
    }

    // Tampilkan preview lokal
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
    setErrorMsg(null);
    setState("previewing");
  }

  function handleCancel() {
    // Hapus preview & kembalikan ke URL awal (atau kosong)
    setPreviewUrl(currentUrl ?? null);
    setSelectedFile(null);
    setErrorMsg(null);
    setState("idle");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleUpload() {
    if (!selectedFile) return;

    setState("uploading");
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("logo", selectedFile);

    try {
      const res = await fetch("/api/dashboard/site/logo", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        const msg: string =
          json?.data?.errors?.logo?.[0] ?? json?.message ?? "Upload gagal.";
        setErrorMsg(msg);
        setPreviewUrl(currentUrl ?? null);
        setSelectedFile(null);
        setState("error");
        onError?.(msg);
        return;
      }

      setState("success");
      onSuccess?.(json.data.logo_url);
    } catch {
      const msg = "Terjadi kesalahan jaringan. Coba lagi.";
      setErrorMsg(msg);
      setPreviewUrl(currentUrl ?? null);
      setSelectedFile(null);
      setState("error");
      onError?.(msg);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview area */}
      <div
        className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer bg-gray-50 flex items-center justify-center"
        onClick={() => state !== "uploading" && inputRef.current?.click()}
        title="Klik untuk pilih gambar"
      >
        {previewUrl ? (
          <Image src={previewUrl} alt="Logo toko" fill className="object-cover" unoptimized />
        ) : (
          <span className="text-gray-400 text-xs text-center px-2">Klik untuk upload logo</span>
        )}
        {state === "uploading" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={state === "uploading"}
      />

      {/* Action buttons */}
      {state === "previewing" && (
        <div className="flex gap-2">
          <button
            onClick={handleUpload}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Upload Logo
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Batal
          </button>
        </div>
      )}

      {state === "success" && (
        <p className="text-sm text-green-600 font-medium">✓ Logo berhasil diupload!</p>
      )}

      {errorMsg && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}

