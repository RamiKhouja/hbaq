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
        Schema::create('abouts', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->json('short_description');
            $table->string('image');
            $table->json('paragraph_1');
            $table->json('title_2')->nullable();
            $table->json('paragraph_2')->nullable();
            for ($i = 1; $i <= 5; $i++) {
                $table->string("picture_$i")->nullable();
            }
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('abouts');
    }
};
