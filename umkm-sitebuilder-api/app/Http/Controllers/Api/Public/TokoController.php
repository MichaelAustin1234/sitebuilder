<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\UmkmSite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TokoController extends Controller
{
    /**
     * GET /api/v1/public/toko
     *
     * Kembalikan daftar semua toko yang sudah dipublikasikan (slug + updated_at).
     * Dipakai oleh sitemap.ts di Next.js.
     */
    public function index(): JsonResponse
    {
        $shops = UmkmSite::where('is_published', true)
            ->orderBy('updated_at', 'desc')
            ->get(['slug', 'updated_at']);

        return response()->json([
            'success' => true,
            'message' => 'Daftar toko berhasil diambil.',
            'data'    => ['shops' => $shops],
        ]);
    }

    /**
     * GET /api/v1/public/toko/{slug}
     *
     * Kembalikan data toko beserta produk aktif dan template.
     * - Increment view_count setiap kali endpoint ini dipanggil.
     * - Return 404 jika slug tidak ditemukan atau is_published = false.
     * - ?preview=1 — skip increment view_count (dipakai oleh iframe preview dashboard).
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $isPreview = $request->boolean('preview');

        $query = UmkmSite::with(['template', 'activeProducts'])
            ->where('slug', $slug);

        // Mode preview (dari iframe dashboard) — tampilkan toko meski belum dipublish
        if (! $isPreview) {
            $query->where('is_published', true);
        }

        $site = $query->first();

        if (! $site) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan.',
                'data'    => null,
            ], 404);
        }

        // Increment view_count — kecuali mode preview (iframe di ThemeCustomizer)
        if (! $isPreview) {
            $site->incrementQuietly('view_count');
        }

        // Tentukan template: pakai yang dipilih, atau fallback ke minimalist
        $template = $site->template ?? [
            'id'            => 0,
            'name'          => 'Minimalis',
            'slug'          => 'minimalist',
            'description'   => null,
            'thumbnail_url' => null,
            'is_active'     => true,
        ];

        // Ambil produk aktif, urutkan terbaru
        $products = $site->activeProducts
            ->sortByDesc('created_at')
            ->values();

        return response()->json([
            'success' => true,
            'message' => 'Data toko berhasil diambil.',
            'data'    => [
                'site'     => $site->makeHidden(['activeProducts']),
                'products' => $products,
                'template' => $template,
            ],
        ]);
    }

    /**
     * POST /api/v1/public/toko/{slug}/wa-click
     *
     * Catat klik tombol WhatsApp dari halaman publik toko.
     * Endpoint publik — tidak butuh autentikasi.
     * Tidak increment jika ?preview=1 (sama seperti view_count).
     */
    public function trackWaClick(string $slug, Request $request): JsonResponse
    {
        $site = UmkmSite::where('slug', $slug)
            ->where('is_published', true)
            ->first();

        if (! $site) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan.',
                'data'    => null,
            ], 404);
        }

        if (! $request->boolean('preview')) {
            $site->incrementQuietly('wa_click_count');
        }

        return response()->json([
            'success' => true,
            'message' => 'Klik WA berhasil dicatat.',
            'data'    => null,
        ]);
    }
}
