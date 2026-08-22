<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('orders', 'bill_generated_at')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->timestamp('bill_generated_at')->nullable()->after('bill_number');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('orders', 'bill_generated_at')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('bill_generated_at');
            });
        }
    }
};
