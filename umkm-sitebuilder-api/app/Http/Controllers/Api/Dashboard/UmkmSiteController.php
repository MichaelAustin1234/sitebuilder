<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUmkmSiteRequest;
use App\Http\Requests\UpdateUmkmSiteRequest;
use App\Http\Requests\UploadBannerRequest;
use App\Http\Requests\UploadLogoRequest;
use App\Models\Template;
use App\Models\UmkmSite;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UmkmSiteController extends Controller
{
    // ── Slug Helper ────────────────────────────────────────────────────

    /**
     * Generate slug unik dari nama toko.
     *
     * Contoh: "Toko Saya" → "toko-saya"
     *         Jika "toko-saya" sudah ada → "toko-saya-2", dst.
     *
     * @param string      $name      Nama toko (raw)
     * @param int|null    $excludeId ID record yang dikecualikan (untuk update)
     */
    private function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $counter = 2;

        while (true) {
            $query = UmkmSite::where('slug', $slug);

            if ($excludeId !== null) {
                $query->where('id', '!=', $excludeId);
            }

            if (! $query->exists()) {
                break;
            }

            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    // ── Endpoints ──────────────────────────────────────────────────────

    /**
     * GET /api/v1/dashboard/site
     * Kembalikan profil toko milik user yang sedang login.
     */
    public function show(Request $request): JsonResponse
    {
        $site = $request->user()->site?->load('template');

        if (! $site) {
            return response()->json([
                'success' => false,
                'message' => 'Profil toko belum dibuat.',
                'data'    => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil toko berhasil diambil.',
            'data'    => ['site' => $site],
        ]);
    }

    /**
     * POST /api/v1/dashboard/site
     * Buat profil toko baru (satu user hanya boleh punya satu toko).
     */
    public function store(StoreUmkmSiteRequest $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Cegah duplikasi — satu user = satu toko
        if ($user->site) {
            return response()->json([
                'success' => false,
                'message' => 'Profil toko sudah ada. Gunakan endpoint update.',
                'data'    => null,
            ], 409);
        }

        $slug = $this->generateUniqueSlug($request->name);

        $site = UmkmSite::create([
            'user_id'     => $user->id,
            'name'        => $request->name,
            'slug'        => $slug,
            'description' => $request->description,
            'category'    => $request->category ?? 'lainnya',
            'phone_wa'    => $request->phone_wa,
            'address'     => $request->address,
            'logo_url'    => $request->logo_url,
            'banner_url'  => $request->banner_url,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profil toko berhasil dibuat.',
            'data'    => ['site' => $site],
        ], 201);
    }

    /**
     * PUT /api/v1/dashboard/site
     * Update profil toko milik user yang sedang login.
     */
    public function update(UpdateUmkmSiteRequest $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $site = $user->site;

        if (! $site) {
            return response()->json([
                'success' => false,
                'message' => 'Profil toko belum dibuat. Gunakan endpoint create.',
                'data'    => null,
            ], 404);
        }

        $data = $request->only([
            'name', 'description', 'category',
            'phone_wa', 'address', 'logo_url', 'banner_url',
            'primary_color', 'tagline', 'operating_hours',
        ]);

        // Re-generate slug jika nama berubah
        if ($request->has('name') && $request->name !== $site->name) {
            $data['slug'] = $this->generateUniqueSlug($request->name, $site->id);
        }

        $site->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Profil toko berhasil diupdate.',
            'data'    => ['site' => $site->fresh()],
        ]);
    }

    /**
     * POST /api/v1/dashboard/site/logo
     * Upload logo toko ke Cloudinary, simpan URL ke kolom logo_url.
     */
    public function uploadLogo(UploadLogoRequest $request, CloudinaryService $cloudinary): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $site = $user->site;

        if (! $site) {
            return response()->json([
                'success' => false,
                'message' => 'Profil toko belum dibuat. Buat toko terlebih dahulu.',
                'data'    => null,
            ], 404);
        }

        try {
            $uploaded = $cloudinary->upload(
                $request->file('logo'),
                'umkm/logos'
            );
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data'    => null,
            ], 502);
        }

        $site->update(['logo_url' => $uploaded['secure_url']]);

        return response()->json([
            'success' => true,
            'message' => 'Logo toko berhasil diupload.',
            'data'    => [
                'logo_url'  => $uploaded['secure_url'],
                'public_id' => $uploaded['public_id'],
            ],
        ]);
    }

    /**
     * POST /api/v1/dashboard/site/banner
     * Upload banner toko ke Cloudinary/local storage, simpan URL ke kolom banner_url.
     */
    public function uploadBanner(UploadBannerRequest $request, CloudinaryService $cloudinary): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $site = $user->site;

        if (! $site) {
            return response()->json([
                'success' => false,
                'message' => 'Profil toko belum dibuat. Buat toko terlebih dahulu.',
                'data'    => null,
            ], 404);
        }

        try {
            $uploaded = $cloudinary->upload(
                $request->file('banner'),
                'umkm/banners'
            );
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data'    => null,
            ], 502);
        }

        $site->update(['banner_url' => $uploaded['secure_url']]);

        return response()->json([
            'success' => true,
            'message' => 'Banner toko berhasil diupload.',
            'data'    => [
                'banner_url' => $uploaded['secure_url'],
                'public_id'  => $uploaded['public_id'],
            ],
        ]);
    }

    /**
     * PUT /api/v1/dashboard/site/publish
     * Toggle status publikasi toko (is_published).
     */
    public function togglePublish(Request $request): JsonResponse
    {
        $request->validate([
            'is_published' => ['required', 'boolean'],
        ], [
            'is_published.required' => 'Status publikasi wajib diisi.',
            'is_published.boolean'  => 'Status publikasi harus true atau false.',
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();
        $site = $user->site;

        if (! $site) {
            return response()->json([
                'success' => false,
                'message' => 'Profil toko belum dibuat.',
                'data'    => null,
            ], 404);
        }

        $site->update(['is_published' => $request->boolean('is_published')]);

        $status = $site->is_published ? 'dipublikasikan' : 'disembunyikan';

        return response()->json([
            'success' => true,
            'message' => "Toko berhasil {$status}.",
            'data'    => ['site' => $site->fresh()->load('template')],
        ]);
    }

    /**
     * PUT /api/v1/dashboard/site/template
     * Ganti template website toko.
     */
    public function updateTemplate(Request $request): JsonResponse
    {
        $request->validate([
            'template_id' => ['required', 'integer', 'exists:templates,id'],
        ], [
            'template_id.required' => 'Template wajib dipilih.',
            'template_id.integer'  => 'Template tidak valid.',
            'template_id.exists'   => 'Template tidak ditemukan.',
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();
        $site = $user->site;

        if (! $site) {
            return response()->json([
                'success' => false,
                'message' => 'Profil toko belum dibuat.',
                'data'    => null,
            ], 404);
        }

        // Pastikan template yang dipilih aktif
        $template = Template::active()->find($request->template_id);

        if (! $template) {
            return response()->json([
                'success' => false,
                'message' => 'Template tidak tersedia.',
                'data'    => null,
            ], 422);
        }

        $site->update(['template_id' => $template->id]);

        return response()->json([
            'success' => true,
            'message' => 'Template berhasil diubah.',
            'data'    => [
                'site'     => $site->fresh()->load('template'),
                'template' => $template,
            ],
        ]);
    }
}

