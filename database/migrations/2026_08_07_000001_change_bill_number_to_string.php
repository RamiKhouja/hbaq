<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('bill_number', 50)->nullable()->change();
        });
    }

    public function down(): void
    {
        // Bill numbers may contain prefixes, so converting them back to integers
        // would destroy valid invoice identifiers.
    }
};
