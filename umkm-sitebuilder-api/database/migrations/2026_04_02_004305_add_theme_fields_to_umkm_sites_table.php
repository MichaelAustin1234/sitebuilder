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
        Schema::table('umkm_sites', function (Blueprint $table) {
            // Warna utama toko (hex, e.g. #6366f1)
            $table->string('primary_color', 7)->default('#6366f1')->after('banner_url');
            // Tagline singkat toko
            $table->string('tagline', 150)->nullable()->after('primary_color');
            // Jam operasional (teks bebas, e.g. "Senin–Sabtu 08.00–20.00")
            $table->string('operating_hours', 200)->nullable()->after('tagline');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('umkm_sites', function (Blueprint $table) {
            $table->dropColumn(['primary_color', 'tagline', 'operating_hours']);
        });
    }
};
