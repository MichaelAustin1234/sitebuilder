"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { UmkmSite, Template } from "@/lib/types";

// ── Constants ───────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { name: "Indigo",  value: "#6366f1" },
  { name: "Rose",    value: "#f43f5e" },
  { name: "Amber",   value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
  { name: "Sky",     value: "#0ea5e9" },
  { name: "Violet",  value: "#8b5cf6" },
];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// ── Helpers ─────────────────────────────────────────────────────────────────

async function uploadImage(
  file: File,
  endpoint: string,
  fieldName: string
): Promise<string> {
  const formData = new FormData();
  formData.append(fieldName, file);
  const res = await fetch(endpoint, { method: "POST", body: formData });
  const json = await res.json();
  if (!res.ok || !json.success) {
    const err =
      json?.data?.errors?.[fieldName]?.[0] ??
      json?.message ??
      "Upload gagal.";
    throw new Error(err);
  }
  return json.data[`${fieldName}_url`] as string;
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ImageUploadBox({
  label,
  currentUrl,
  maxMb,
  onUploaded,
  endpoint,
  fieldName,
  aspectClass,
}: {
  label: string;
  currentUrl: string | null;
  maxMb: number;
  onUploaded: (url: string) => void;
  endpoint: string;
  fieldName: string;
  aspectClass: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Format tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > maxMb * 1024 * 1024) {
      toast.error(`Ukuran maksimal ${maxMb} MB.`);
      return;
    }
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadImage(file, endpoint, fieldName);
      onUploaded(url);
      toast.success(`${label} berhasil diupload.`);
    } catch (err: unknown) {
      toast.error((err as Error).message);
      setPreview(currentUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
      <div
        className={`relative w-full ${aspectClass} rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden cursor-pointer flex items-center justify-center hover:border-indigo-400 transition`}
        onClick={() => !uploading && inputRef.current?.click()}
        title={`Klik untuk ubah ${label}`}
      >
        {preview ? (
          <Image src={preview} alt={label} fill className="object-cover" unoptimized />
        ) : (
          <span className="text-gray-400 text-xs text-center px-2">
            Klik untuk upload {label}
          </span>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
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
        onChange={handleChange}
        disabled={uploading}
      />
      <p className="text-xs text-gray-400 mt-1">JPG/PNG/WebP, maks {maxMb} MB</p>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

interface Props {
  initialSite: UmkmSite;
}

export function ThemeCustomizer({ initialSite }: Props) {
  // Info toko
  const [name, setName]               = useState(initialSite.name);
  const [description, setDescription] = useState(initialSite.description ?? "");
  const [phoneWa, setPhoneWa]         = useState(initialSite.phone_wa ?? "");
  const [address, setAddress]         = useState(initialSite.address ?? "");

  // Tema
  const [primaryColor, setPrimaryColor]     = useState(initialSite.primary_color ?? "#6366f1");
  const [tagline, setTagline]               = useState(initialSite.tagline ?? "");
  const [operatingHours, setOperatingHours] = useState(initialSite.operating_hours ?? "");

  // Template
  const [templates, setTemplates]       = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    initialSite.template_id ?? null
  );
  const [isChangingTemplate, setIsChangingTemplate] = useState(false);

  // Publish
  const [isPublished, setIsPublished] = useState(initialSite.is_published ?? false);
  const [isToggling, setIsToggling]   = useState(false);

  // Assets (untuk refresh preview setelah upload)
  const [logoUrl, setLogoUrl]     = useState(initialSite.logo_url ?? null);
  const [bannerUrl, setBannerUrl] = useState(initialSite.banner_url ?? null);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const previewUrl = `/toko/${initialSite.slug}?preview=1`;

  // Fetch template list on mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/public/templates`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setTemplates(json.data.templates as Template[]);
      })
      .catch(() => {/* silent fail */});
  }, []);

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/dashboard/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          phone_wa: phoneWa,
          address,
          primary_color: primaryColor,
          tagline,
          operating_hours: operatingHours,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Perubahan berhasil disimpan!");
        setPreviewKey((k) => k + 1);
      } else {
        toast.error(json.message ?? "Gagal menyimpan perubahan.");
      }
    } catch {
      toast.error("Gagal menyimpan. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleChangeTemplate(templateId: number) {
    if (templateId === selectedTemplateId) return;
    setIsChangingTemplate(true);
    try {
      const res = await fetch("/api/dashboard/site/template", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_id: templateId }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedTemplateId(templateId);
        toast.success("Template berhasil diubah!");
        setPreviewKey((k) => k + 1);
      } else {
        toast.error(json.message ?? "Gagal mengganti template.");
      }
    } catch {
      toast.error("Gagal mengganti template. Coba lagi.");
    } finally {
      setIsChangingTemplate(false);
    }
  }

  async function handleTogglePublish() {
    const next = !isPublished;
    if (!window.confirm(next ? "Publikasikan toko ke publik sekarang?" : "Sembunyikan toko dari publik?")) return;

    setIsToggling(true);
    try {
      const res = await fetch("/api/dashboard/site/publish", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: next }),
      });
      const json = await res.json();
      if (json.success) {
        setIsPublished(next);
        toast.success(next ? "Toko berhasil dipublikasikan! 🎉" : "Toko disembunyikan dari publik.");
      } else {
        toast.error(json.message ?? "Gagal mengubah status.");
      }
    } catch {
      toast.error("Gagal mengubah status. Coba lagi.");
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Kustomisasi Toko</h1>
        <p className="text-sm text-gray-500 mb-8">
          Atur informasi, tampilan, dan aset toko Anda.
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Panel Kiri ─────────────────────────────────── */}
          <div className="w-full lg:w-96 flex-shrink-0 space-y-6">

            {/* Info Toko */}
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">🏪 Info Toko</h2>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nama Toko *</label>
                <input
                  type="text" maxLength={100} value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Nama toko Anda"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi</label>
                <textarea
                  rows={3} maxLength={1000} value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                  placeholder="Deskripsi singkat toko..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nomor WhatsApp</label>
                <input
                  type="tel" value={phoneWa}
                  onChange={(e) => setPhoneWa(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Alamat</label>
                <textarea
                  rows={2} maxLength={500} value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                  placeholder="Alamat toko (opsional)"
                />
              </div>
            </div>

            {/* Gambar Toko */}
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">🖼️ Gambar Toko</h2>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24">
                  <ImageUploadBox
                    label="Logo"
                    currentUrl={initialSite.logo_url}
                    maxMb={2}
                    endpoint="/api/dashboard/site/logo"
                    fieldName="logo"
                    aspectClass="aspect-square"
                    onUploaded={(url) => { setLogoUrl(url); setPreviewKey((k) => k + 1); }}
                  />
                </div>
                <div className="flex-1">
                  <ImageUploadBox
                    label="Banner"
                    currentUrl={initialSite.banner_url}
                    maxMb={4}
                    endpoint="/api/dashboard/site/banner"
                    fieldName="banner"
                    aspectClass="aspect-video"
                    onUploaded={(url) => { setBannerUrl(url); setPreviewKey((k) => k + 1); }}
                  />
                </div>
              </div>
            </div>

            {/* Pilih Template */}
            {templates.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  🎨 Template Website
                  {isChangingTemplate && (
                    <span className="ml-2 text-xs font-normal text-indigo-500">Mengganti...</span>
                  )}
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => handleChangeTemplate(tpl.id)}
                      disabled={isChangingTemplate}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border-2 transition text-sm ${
                        selectedTemplateId === tpl.id
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold"
                          : "border-gray-200 hover:border-indigo-300 text-gray-700"
                      }`}
                    >
                      <span className="font-medium">{tpl.name}</span>
                      {tpl.description && (
                        <span className="block text-xs text-gray-400 mt-0.5">{tpl.description}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Warna Utama */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">🎨 Warna Utama</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.value}
                    title={c.name}
                    onClick={() => setPrimaryColor(c.value)}
                    className="w-9 h-9 rounded-full transition-transform hover:scale-110 focus:outline-none"
                    style={{
                      backgroundColor: c.value,
                      boxShadow: primaryColor === c.value ? `0 0 0 3px white, 0 0 0 5px ${c.value}` : "none",
                    }}
                  />
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-500">
                <span>Kustom:</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                />
                <code className="ml-1 bg-gray-100 px-2 py-0.5 rounded font-mono">{primaryColor}</code>
              </label>
            </div>

            {/* Tagline & Jam Operasional */}
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">✏️ Tagline</label>
                <input
                  type="text" maxLength={150} value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Slogan singkat toko Anda..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">⏰ Jam Operasional</label>
                <input
                  type="text" maxLength={200} value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  placeholder="Contoh: Senin–Sabtu 08.00–20.00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Tombol Simpan */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition"
            >
              {isSaving ? "Menyimpan..." : "💾 Simpan Perubahan"}
            </button>

            {/* Toggle Publish */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-1">🌐 Status Toko</h2>
              <p className="text-xs text-gray-400 mb-3">
                {isPublished ? "Toko Anda saat ini dapat diakses publik." : "Toko Anda saat ini tersembunyi."}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-6 rounded-full cursor-pointer transition-colors flex items-center ${isPublished ? "bg-emerald-500" : "bg-gray-300"}`}
                  onClick={!isToggling ? handleTogglePublish : undefined}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${isPublished ? "translate-x-4" : "translate-x-0"}`} />
                </div>
                <span className={`text-sm font-medium ${isPublished ? "text-emerald-600" : "text-gray-500"}`}>
                  {isToggling ? "Memproses..." : isPublished ? "Dipublikasikan" : "Draft"}
                </span>
              </div>
              {isPublished && (
                <a
                  href={initialSite.site_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-xs text-indigo-500 hover:underline break-all"
                >
                  {initialSite.site_url}
                </a>
              )}
            </div>
          </div>

          {/* ── Preview Iframe ─────────────────────────────────── */}
          <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden" style={{ minHeight: "600px" }}>
            <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <p className="text-xs text-gray-400 font-mono truncate flex-1 text-center">
                Preview — {name}
              </p>
              <button
                onClick={() => setPreviewKey((k) => k + 1)}
                className="text-xs text-gray-400 hover:text-gray-600 transition"
                title="Refresh preview"
              >
                ↺
              </button>
            </div>
            <iframe
              key={previewKey}
              src={previewUrl}
              className="w-full"
              style={{ height: "calc(100% - 40px)", minHeight: "560px" }}
              title="Preview Toko"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}


