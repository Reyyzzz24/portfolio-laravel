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
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('section_eyebrow');
            $table->string('section_title');
            $table->text('section_description');
            $table->string('item_type');
            $table->string('name')->nullable();
            $table->string('institution')->nullable();
            $table->string('degree')->nullable();
            $table->string('period')->nullable();
            $table->boolean('is_current')->default(false);
            $table->unsignedSmallInteger('display_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
