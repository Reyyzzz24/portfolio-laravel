<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 0. Hapus tabel 'skills' lama terlebih dahulu jika ada, 
        // agar tidak bentrok dengan Schema::create di bawahnya.
        Schema::dropIfExists('skills');

        // 1. Tabel Master Header Teks Resume (Hanya 1 Baris Data)
        Schema::create('resume_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_eyebrow');
            $table->string('section_title');
            $table->text('section_description');
            $table->timestamps();
        });

        // 2. Tabel Khusus Tampungan Skills (Struktur Baru)
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedSmallInteger('display_order')->default(0);
            $table->timestamps();
        });

        // 3. Tabel Khusus Tampungan Education
        Schema::create('education', function (Blueprint $table) {
            $table->id();
            $table->string('institution');
            $table->string('degree');
            $table->string('period');
            $table->boolean('is_current')->default(false);
            $table->unsignedSmallInteger('display_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('education');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('resume_sections');
    }
};