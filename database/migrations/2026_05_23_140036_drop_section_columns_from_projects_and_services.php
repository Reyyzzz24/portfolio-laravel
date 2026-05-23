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
        // Menghapus kolom dari tabel projects
        if (Schema::hasColumn('projects', 'section_eyebrow')) {
            Schema::table('projects', function (Blueprint $table) {
                $table->dropColumn(['section_eyebrow', 'section_title']);
            });
        }

        // Menghapus kolom dari tabel services
        if (Schema::hasColumn('services', 'section_eyebrow')) {
            Schema::table('services', function (Blueprint $table) {
                $table->dropColumn(['section_eyebrow', 'section_title']);
            });
        }
    }

    /**
     * Reverse the migrations (opsional, untuk rollback)
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('section_eyebrow')->nullable();
            $table->string('section_title')->nullable();
        });

        Schema::table('services', function (Blueprint $table) {
            $table->string('section_eyebrow')->nullable();
            $table->string('section_title')->nullable();
        });
    }
};