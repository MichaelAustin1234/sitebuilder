<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Template extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'thumbnail_url',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    // ── Relationships ──────────────────────────────────────────────────

    /** Toko-toko yang menggunakan template ini */
    public function sites(): HasMany
    {
        return $this->hasMany(UmkmSite::class);
    }

    // ── Scopes ────────────────────────────────────────────────────────

    /**
     * Hanya template yang aktif.
     *
     * @param Builder<Template> $query
     * @return Builder<Template>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
