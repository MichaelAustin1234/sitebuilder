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
            // Template yang dipilih toko (nullable = belum pilih / pakai default minimalist)
            $table->foreignId('template_id')
                  ->nullable()
                  ->after('is_active')
                  ->constrained('templates')
                  ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('umkm_sites', function (Blueprint $table) {
            $table->dropForeign(['template_id']);
            $table->dropColumn('template_id');
        });
    }
};
