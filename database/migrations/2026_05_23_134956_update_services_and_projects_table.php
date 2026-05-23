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
        // Migration untuk services_sections
        Schema::create('services_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_eyebrow')->nullable();
            $table->string('section_title')->nullable();
            $table->timestamps();
        });

        // Migration untuk project_sections
        Schema::create('project_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_eyebrow')->nullable();
            $table->string('section_title')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services_sections');
        Schema::dropIfExists('project_sections');
    }
};
