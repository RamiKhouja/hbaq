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
        if (Schema::hasTable('companies') && ! Schema::hasColumn('companies', 'logo')) {
            Schema::table('companies', function (Blueprint $table) {
                $table->string('logo')->nullable();
            });
        }

        if (Schema::hasTable('users') && ! Schema::hasColumn('users', 'company_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreignId('company_id')->nullable()->index()->after('role');
            });
        }

        if (Schema::hasTable('addresses')) {
            Schema::table('addresses', function (Blueprint $table) {
                if (! Schema::hasColumn('addresses', 'company_id')) {
                    $table->foreignId('company_id')->nullable()->index()->after('user_id');
                }
            });

            Schema::table('addresses', function (Blueprint $table) {
                if (Schema::hasColumn('addresses', 'user_id')) {
                    $table->foreignId('user_id')->nullable()->change();
                }

                if (Schema::hasColumn('addresses', 'address_2')) {
                    $table->string('address_2')->nullable()->change();
                }
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

        if (Schema::hasTable('companies') && Schema::hasColumn('companies', 'logo')) {
            Schema::table('companies', function (Blueprint $table) {
                $table->dropColumn('logo');
            });
        }
    }
};
