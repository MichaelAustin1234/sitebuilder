/**
 * api.ts — Axios client untuk komunikasi dengan Laravel API
 *
 * PENTING: File ini didesain untuk digunakan di Client Components saja.
 * Untuk fetch di Server Components, gunakan native fetch() langsung.
 *
 * Auth strategy: httpOnly cookie (Sanctum SPA auth)
 * - withCredentials: true  → browser kirim cookie otomatis di setiap request
 * - Axios otomatis baca XSRF-TOKEN cookie & kirim sebagai X-XSRF-TOKEN header
 * - Tidak perlu attach token manual — Sanctum yang handle di server
 */

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { ApiResponse } from './types';

// ── Instance ──────────────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true, // Kirim cookie (session + XSRF) di setiap request
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request Interceptor ───────────────────────────────────────────────────────
// Saat ini tidak ada modifikasi tambahan — cookie dikirim otomatis oleh browser.
// Interceptor ini siap untuk diisi (misal: tambah header custom di masa depan).
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

// ── Response Interceptor ──────────────────────────────────────────────────────
// Handle 401 Unauthorized: redirect ke /login
// Guard typeof window !== 'undefined' mencegah crash di server-side rendering
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;

