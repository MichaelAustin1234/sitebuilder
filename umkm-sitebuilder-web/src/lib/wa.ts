/**
 * Utilitas WhatsApp — UMKM Sitebuilder
 *
 * Berisi fungsi-fungsi untuk memformat nomor WA dan membangun URL wa.me.
 * Semua fungsi bisa dipakai di Server Component maupun Client Component.
 */

/**
 * Normalisasi nomor telepon Indonesia ke format internasional tanpa "+".
 * Contoh: "08123456789" → "628123456789"
 *         "628123456789" → "628123456789"
 *         "+62 812-3456-789" → "628123456789"
 */
export function normalizePhone(phone: string): string {
  // Hapus semua karakter non-digit
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("62")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return "62" + digits.slice(1);
  }

  // Asumsikan sudah berupa nomor lokal tanpa awalan
  return "62" + digits;
}

/**
 * Bangun URL wa.me untuk menghubungi toko (tanpa produk spesifik).
 */
export function buildWaContactUrl(phone: string, siteName: string): string {
  const normalized = normalizePhone(phone);
  const text = `Halo ${siteName}, saya ingin bertanya mengenai produk Anda. Apakah masih buka?`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

/**
 * Bangun URL wa.me untuk memesan produk tertentu.
 */
export function buildWaProductUrl(
  phone: string,
  siteName: string,
  productName: string,
  formattedPrice: string
): string {
  const normalized = normalizePhone(phone);
  const text =
    `Halo ${siteName}, saya tertarik dengan ${productName} ` +
    `seharga ${formattedPrice}. Apakah masih tersedia?`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

