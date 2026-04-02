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
            // Lacak jumlah klik tombol WhatsApp dari halaman publik toko
            $table->unsignedBigInteger('wa_click_count')->default(0)->after('view_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('umkm_sites', function (Blueprint $table) {
            $table->dropColumn('wa_click_count');
        });
    }
};
