<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Dashboard\ProductController;
use App\Http\Controllers\Api\Dashboard\UmkmSiteController;
use App\Http\Controllers\Api\Public\TemplateController;
use App\Http\Controllers\Api\Public\TokoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — UMKM Sitebuilder
| Prefix  : /api  (auto by Laravel)
| Version : v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── Health check ──────────────────────────────────────────────────
    Route::get('/health', function () {
        return response()->json([
            'success' => true,
            'message' => 'API is running',
            'data'    => [
                'status'  => 'ok',
                'version' => '1.0',
            ],
        ]);
    });

    // ── Auth routes ───────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        // Public — tidak butuh token
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login',    [AuthController::class, 'login']);

        // Protected — butuh Bearer token
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me',      [AuthController::class, 'me']);
        });
    });

    // ── Dashboard routes (auth required) ─────────────────────────────
    Route::prefix('dashboard')->middleware('auth:sanctum')->group(function () {

        // Profil toko UMKM — satu user = satu toko
        Route::get('/site',        [UmkmSiteController::class, 'show']);
        Route::post('/site',       [UmkmSiteController::class, 'store']);
        Route::put('/site',        [UmkmSiteController::class, 'update']);

        // Upload logo toko (multipart/form-data)
        Route::post('/site/logo',      [UmkmSiteController::class, 'uploadLogo']);

        // Upload banner toko (multipart/form-data)
        Route::post('/site/banner',    [UmkmSiteController::class, 'uploadBanner']);

        // Toggle publikasi toko
        Route::put('/site/publish',    [UmkmSiteController::class, 'togglePublish']);

        // Ganti template toko
        Route::put('/site/template',   [UmkmSiteController::class, 'updateTemplate']);

        // ── Produk toko ───────────────────────────────────────────────
        // Upload foto produk (harus sebelum apiResource agar tidak tertimpa {product})
        Route::post('/products/upload', [ProductController::class, 'uploadImage']);
        Route::apiResource('products', ProductController::class);
    });

    // ── Public routes ─────────────────────────────────────────────────
    Route::prefix('public')->group(function () {
        // Daftar semua template aktif (tidak butuh auth)
        Route::get('/templates', [TemplateController::class, 'index']);

        // Daftar semua toko yang dipublikasikan (untuk sitemap)
        Route::get('/toko',                  [TokoController::class, 'index']);

        // Halaman publik toko — return data toko + produk + template
        Route::get('/toko/{slug}',           [TokoController::class, 'show']);
        // Catat klik tombol WhatsApp (analytics)
        Route::post('/toko/{slug}/wa-click', [TokoController::class, 'trackWaClick']);
    });
});
