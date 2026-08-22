<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pack_categories', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->string('image')->nullable();
            $table->string('url')->unique();
            $table->boolean('menu_show')->default(true);
            $table->json('short_description')->nullable();
            $table->json('description')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('pack_categories')->nullOnDelete();
            $table->string('type')->nullable()->default('menu');
            $table->timestamps();
        });

        Schema::create('pack_pack_category', function (Blueprint $table) {
            $table->foreignId('pack_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pack_category_id')->constrained()->cascadeOnDelete();
            $table->primary(['pack_id', 'pack_category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pack_pack_category');
        Schema::dropIfExists('pack_categories');
    }
};
