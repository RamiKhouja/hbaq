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
        Schema::table('products', function (Blueprint $table) {
            $table->string('unit')->default('piece')->after('price');
            $table->boolean('is_discount')->default(false);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->decimal('discount_percentage', 4, 2)->nullable();
            $table->date('discount_start')->nullable();
            $table->date('discount_end')->nullable();
            $table->decimal('price_after_discount', 10,2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('unit');
            $table->dropColumn('is_discount');
            $table->dropColumn('discount_price');
            $table->dropColumn('discount_percentage');
            $table->dropColumn('discount_start');
            $table->dropColumn('discount_end');
            $table->dropColumn('price_after_discount');
        });
    }
};
