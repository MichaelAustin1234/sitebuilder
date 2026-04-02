<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // Produk dimiliki oleh satu toko UMKM
            $table->foreignId('umkm_site_id')
                  ->constrained('umkm_sites')
                  ->cascadeOnDelete();

            // Identitas produk
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();

            // Harga & stok
            $table->decimal('price', 12, 2);          // max 999.999.999,99
            $table->unsignedInteger('stock')->default(0);

            // Kategori produk
            $table->enum('category', [
                'makanan',
                'minuman',
                'pakaian',
                'aksesoris',
                'kecantikan',
                'kesehatan',
                'elektronik',
                'rumah_tangga',
                'otomotif',
                'olahraga',
                'pendidikan',
                'lainnya',
            ])->default('lainnya');

            // Gambar produk (URL dari Cloudinary)
            $table->string('image_url')->nullable();

            // Status aktif — produk non-aktif tidak tampil di website publik
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Soft delete — data tidak hilang permanen
            $table->softDeletes();

            // Slug unik per toko (bukan global)
            $table->unique(['umkm_site_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
