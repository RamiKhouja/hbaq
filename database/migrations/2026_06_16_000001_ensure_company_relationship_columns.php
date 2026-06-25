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
        if (Schema::hasTable('users') && ! Schema::hasColumn('users', 'company_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreignId('company_id')->nullable()->index()->after('role');
            });
        }

        if (Schema::hasTable('addresses') && ! Schema::hasColumn('addresses', 'company_id')) {
            Schema::table('addresses', function (Blueprint $table) {
                $table->foreignId('company_id')->nullable()->index()->after('user_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('addresses') && Schema::hasColumn('addresses', 'company_id')) {
            Schema::table('addresses', function (Blueprint $table) {
                $table->dropColumn('company_id');
            });
        }

        if (Schema::hasTable('users') && Schema::hasColumn('users', 'company_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('company_id');
            });
        }
    }
};
