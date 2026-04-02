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
        Schema::create('templates', function (Blueprint $table) {
            $table->id();

            // Identitas template
            $table->string('name');           // contoh: "Minimalis"
            $table->string('slug')->unique(); // contoh: "minimalist"
            $table->text('description')->nullable();

            // URL thumbnail untuk preview di dashboard
            $table->string('thumbnail_url')->nullable();

            // Apakah template ini bisa dipilih user?
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
