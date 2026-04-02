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
        Schema::create('umkm_sites', function (Blueprint $table) {
            $table->id();

            // Owner — satu user hanya boleh punya satu toko
            $table->foreignId('user_id')
                  ->unique()
                  ->constrained('users')
                  ->cascadeOnDelete();

            // Identitas toko
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // Kategori usaha
            $table->enum('category', [
                'kuliner',
                'fashion',
                'kecantikan',
                'kesehatan',
                'elektronik',
                'otomotif',
                'pendidikan',
                'jasa',
                'lainnya',
            ])->default('lainnya');

            // Kontak & lokasi
            $table->string('phone_wa', 20)->nullable();
            $table->text('address')->nullable();

            // Aset visual
            $table->string('logo_url')->nullable();
            $table->string('banner_url')->nullable();

            // Status aktif (bisa dipakai untuk suspend toko)
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkm_sites');
    }
};
