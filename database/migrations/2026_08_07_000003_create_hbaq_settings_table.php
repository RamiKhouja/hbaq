<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hbaq_settings', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('fiscal_number');
            $table->string('logo')->nullable();
            $table->string('signature')->nullable();
            $table->string('stamp')->nullable();
            $table->text('address');
            $table->string('phone');
            $table->string('email');
            $table->string('rib')->nullable();
            $table->decimal('vat_rate', 5, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hbaq_settings');
    }
};
