<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * User hanya bisa melihat daftar produk jika punya toko.
     */
    public function viewAny(User $user): bool
    {
        return $user->site !== null;
    }

    /**
     * User hanya bisa melihat produk milik tokonya sendiri.
     */
    public function view(User $user, Product $product): bool
    {
        return $user->site?->id === $product->umkm_site_id;
    }

    /**
     * User hanya bisa membuat produk jika sudah punya toko.
     */
    public function create(User $user): bool
    {
        return $user->site !== null;
    }

    /**
     * User hanya bisa mengupdate produk milik tokonya sendiri.
     */
    public function update(User $user, Product $product): bool
    {
        return $user->site?->id === $product->umkm_site_id;
    }

    /**
     * User hanya bisa menghapus (soft delete) produk milik tokonya sendiri.
     */
    public function delete(User $user, Product $product): bool
    {
        return $user->site?->id === $product->umkm_site_id;
    }
}
