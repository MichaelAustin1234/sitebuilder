<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // ── Slug Helper ────────────────────────────────────────────────────

    /**
     * Generate slug unik per toko dari nama produk.
     *
     * Slug hanya harus unik di dalam satu toko (bukan global),
     * sesuai constraint unique(['umkm_site_id', 'slug']).
     *
     * @param string   $name       Nama produk
     * @param int      $siteId     ID toko pemilik produk
     * @param int|null $excludeId  ID produk yang dikecualikan (untuk update)
     */
    private function generateUniqueSlug(string $name, int $siteId, ?int $excludeId = null): string
    {
        $base    = Str::slug($name);
        $slug    = $base;
        $counter = 2;

        while (true) {
            $query = Product::withTrashed()
                ->where('umkm_site_id', $siteId)
                ->where('slug', $slug);

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
     * GET /api/v1/dashboard/products
     * Daftar produk milik toko user, dengan paginasi & filter.
     *
     * Query params:
     *   - category   : filter berdasarkan kategori
     *   - is_active  : filter berdasarkan status (true/false)
     *   - page       : nomor halaman (default 1)
     */
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $this->authorize('viewAny', Product::class);

        $site = $user->site;

        $query = $site->products()->orderByDesc('created_at');

        // Filter opsional
        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->has('is_active') && $request->query('is_active') !== null) {
            $query->where('is_active', filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $products = $query->paginate(12);

        return response()->json([
            'success' => true,
            'message' => 'Daftar produk berhasil diambil.',
            'data'    => [
                'products' => $products->items(),
                'meta'     => [
                    'current_page' => $products->currentPage(),
                    'last_page'    => $products->lastPage(),
                    'per_page'     => $products->perPage(),
                    'total'        => $products->total(),
                ],
            ],
        ]);
    }

    /**
     * POST /api/v1/dashboard/products
     * Tambah produk baru ke toko user.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $this->authorize('create', Product::class);

        $site = $user->site;

        $slug = $this->generateUniqueSlug($request->name, $site->id);

        $product = $site->products()->create([
            'name'        => $request->name,
            'slug'        => $slug,
            'description' => $request->description,
            'price'       => $request->price,
            'stock'       => $request->stock,
            'category'    => $request->category,
            'image_url'   => $request->image_url,
            'is_active'   => $request->boolean('is_active', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan.',
            'data'    => ['product' => $this->withFormattedPrice($product)],
        ], 201);
    }

    /**
     * GET /api/v1/dashboard/products/{product}
     * Detail satu produk milik toko user.
     */
    public function show(Request $request, Product $product): JsonResponse
    {
        $this->authorize('view', $product);

        return response()->json([
            'success' => true,
            'message' => 'Detail produk berhasil diambil.',
            'data'    => ['product' => $this->withFormattedPrice($product)],
        ]);
    }

    /**
     * PUT /api/v1/dashboard/products/{product}
     * Update data produk milik toko user.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $this->authorize('update', $product);

        /** @var \App\Models\User $user */
        $user = $request->user();
        $site = $user->site;

        $data = $request->only([
            'name', 'description', 'price', 'stock', 'category', 'image_url', 'is_active',
        ]);

        // Re-generate slug hanya jika nama berubah
        if ($request->has('name') && $request->name !== $product->name) {
            $data['slug'] = $this->generateUniqueSlug($request->name, $site->id, $product->id);
        }

        $product->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diupdate.',
            'data'    => ['product' => $this->withFormattedPrice($product->fresh())],
        ]);
    }

    /**
     * DELETE /api/v1/dashboard/products/{product}
     * Soft delete produk (produk tidak muncul di website publik, data tetap tersimpan).
     */
    public function destroy(Request $request, Product $product): JsonResponse
    {
        $this->authorize('delete', $product);

        $product->delete(); // SoftDeletes — hanya set deleted_at

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus.',
            'data'    => null,
        ]);
    }

    /**
     * POST /api/v1/dashboard/products/upload
     * Upload foto produk ke Cloudinary, kembalikan URL.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ], [
            'image.required' => 'Foto produk wajib dipilih.',
            'image.image'    => 'File harus berupa gambar.',
            'image.mimes'    => 'Format foto harus jpg, png, atau webp.',
            'image.max'      => 'Ukuran foto maksimal 2 MB.',
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();

        if (! $user->site) {
            return response()->json([
                'success' => false,
                'message' => 'Toko belum dibuat.',
                'data'    => null,
            ], 403);
        }

        $cloudinary = new CloudinaryService();
        $result     = $cloudinary->upload($request->file('image'), 'umkm/products');

        return response()->json([
            'success' => true,
            'message' => 'Foto produk berhasil diupload.',
            'data'    => ['image_url' => $result['secure_url']],
        ]);
    }

    // ── Helpers ────────────────────────────────────────────────────────

    /**
     * Tambahkan field formatted_price ke array produk.
     *
     * @param  Product  $product
     * @return array<string, mixed>
     */
    private function withFormattedPrice(Product $product): array
    {
        $arr = $product->toArray();
        $arr['formatted_price'] = $product->formatted_price;
        return $arr;
    }
}

