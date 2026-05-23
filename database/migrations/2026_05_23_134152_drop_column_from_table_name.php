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
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn('section_eyebrow');
            $table->dropColumn('section_title');
            $table->dropColumn('form_action');
            $table->dropColumn('submit_label');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->string('section_eyebrow')->nullable();
            $table->string('section_title')->nullable();
            $table->string('form_action')->nullable();
            $table->string('submit_label')->nullable();
        });
    }
};
