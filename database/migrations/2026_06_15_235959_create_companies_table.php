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
        if (! Schema::hasTable('companies')) {
            Schema::create('companies', function (Blueprint $table) {
                $table->id();
                $table->json('name');
                $table->string('phone')->nullable();
                $table->string('email')->nullable();
                $table->json('mf')->nullable();
                $table->string('mf_image')->nullable();
                $table->string('logo')->nullable();
                $table->string('role')->nullable();
                $table->foreignId('company_group_id')->nullable()->index();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
