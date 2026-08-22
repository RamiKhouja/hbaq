<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('bill_number', 50)->nullable()->unique()->after('language');
            $table->timestamp('bill_generated_at')->nullable()->after('bill_number');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropUnique(['bill_number']);
            $table->dropColumn('bill_generated_at');
            $table->dropColumn('bill_number');
        });
    }
};
