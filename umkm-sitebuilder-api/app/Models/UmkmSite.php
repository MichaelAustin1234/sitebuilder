<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class UmkmSite extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'category',
        'phone_wa',
        'address',
        'logo_url',
        'banner_url',
        'primary_color',
        'tagline',
        'operating_hours',
        'is_active',
        'is_published',
        'view_count',
        'wa_click_count',
        'template_id',
    ];

    protected $appends = ['site_url'];

    protected function casts(): array
    {
        return [
            'is_active'      => 'boolean',
            'is_published'   => 'boolean',
            'view_count'     => 'integer',
            'wa_click_count' => 'integer',
        ];
    }

    // ── Accessors ──────────────────────────────────────────────────────

    /**
     * URL publik toko ini di Next.js frontend.
     * Contoh: https://umkm.vercel.app/toko/toko-saya
     */
    public function getSiteUrlAttribute(): string
    {
        $base = rtrim(config('app.frontend_url', 'http://localhost:3000'), '/');
        return "{$base}/toko/{$this->slug}";
    }

    // ── Relationships ──────────────────────────────────────────────────

    /** Toko dimiliki oleh satu User */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Template yang dipakai toko ini */
    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    /** Semua produk milik toko ini (termasuk yang tidak aktif) */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /** Hanya produk aktif milik toko ini */
    public function activeProducts(): HasMany
    {
        return $this->hasMany(Product::class)->where('is_active', true);
    }
}
