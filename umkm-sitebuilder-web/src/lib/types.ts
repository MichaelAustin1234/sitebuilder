// ── Generic API Response Wrapper ─────────────────────────────────────────────
// Semua response dari Laravel menggunakan format ini:
// { success: boolean, message: string, data: T }
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// ── Pagination ────────────────────────────────────────────────────────────────
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

// ── Health Check ──────────────────────────────────────────────────────────────
export interface HealthData {
  status: string;
  version: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/** Shape of data.user returned from Laravel auth endpoints */
export interface AuthResponseData {
  user: User;
}

/** Shape of data.errors returned from Laravel on 422 */
export interface ValidationErrorData {
  errors: Record<string, string[]>;
}

// ── Template ──────────────────────────────────────────────────────────────────
export interface Template {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── UmkmSite ──────────────────────────────────────────────────────────────────
export interface UmkmSite {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  phone_wa: string | null;
  address: string | null;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string | null;
  tagline: string | null;
  operating_hours: string | null;
  is_active: boolean;
  is_published: boolean;
  view_count: number;
  site_url: string;
  template_id: number | null;
  template?: Template | null;
  created_at: string;
  updated_at: string;
}

// ── SiteTemplateData (dipakai oleh komponen template publik) ──────────────────
export interface SiteTemplateData {
  site: UmkmSite;
  products: Product[];
  template: Template;
}

// ── Produk ────────────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  umkm_site_id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  formatted_price: string;
  stock: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
  is_active?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  image_url?: string;
  is_active?: boolean;
}

export interface ProductListData {
  products: Product[];
  meta: PaginationMeta;
}

