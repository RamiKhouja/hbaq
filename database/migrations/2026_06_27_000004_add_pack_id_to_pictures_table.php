<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pictures', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
        });

        DB::statement('ALTER TABLE pictures MODIFY product_id BIGINT UNSIGNED NULL');

        Schema::table('pictures', function (Blueprint $table) {
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreignId('pack_id')->nullable()->after('product_id')->constrained()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        DB::table('pictures')->whereNotNull('pack_id')->delete();

        Schema::table('pictures', function (Blueprint $table) {
            $table->dropForeign(['pack_id']);
            $table->dropColumn('pack_id');
            $table->dropForeign(['product_id']);
        });

        DB::statement('ALTER TABLE pictures MODIFY product_id BIGINT UNSIGNED NOT NULL');

        Schema::table('pictures', function (Blueprint $table) {
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }
};
