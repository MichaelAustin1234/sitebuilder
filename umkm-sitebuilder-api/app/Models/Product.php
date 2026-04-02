<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'umkm_site_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'category',
        'image_url',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price'     => 'decimal:2',
            'stock'     => 'integer',
            'is_active' => 'boolean',
        ];
    }

    // ── Relationships ──────────────────────────────────────────────────

    /** Produk dimiliki oleh satu toko UMKM */
    public function site(): BelongsTo
    {
        return $this->belongsTo(UmkmSite::class, 'umkm_site_id');
    }

    // ── Scopes ────────────────────────────────────────────────────────

    /**
     * Hanya produk yang aktif (digunakan untuk website publik).
     *
     * @param Builder<Product> $query
     * @return Builder<Product>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    // ── Accessors ─────────────────────────────────────────────────────

    /**
     * Harga dalam format Rupiah: "Rp 50.000"
     * Akses via $product->formatted_price
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format((float) $this->price, 0, ',', '.');
    }
}
