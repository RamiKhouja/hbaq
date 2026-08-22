<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE orders MODIFY status ENUM('pending','paid','canceled','closed','preparing','delivering','done','cancel','close') NOT NULL DEFAULT 'pending'");
        }

        DB::table('orders')->where('phase', 'serving')->update(['status' => 'preparing']);
        DB::table('orders')->where('phase', 'delivery')->update(['status' => 'delivering']);
        DB::table('orders')->where('phase', 'closed')->update(['status' => 'done']);
        DB::table('orders')->where('phase', 'canceled')->update(['status' => 'cancel']);
        DB::table('orders')->where('status', 'paid')->update(['status' => 'preparing']);
        DB::table('orders')->where('status', 'canceled')->update(['status' => 'cancel']);
        DB::table('orders')->where('status', 'closed')->update(['status' => 'close']);

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE orders MODIFY status ENUM('pending','preparing','delivering','done','cancel','close') NOT NULL DEFAULT 'pending'");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE orders MODIFY status ENUM('pending','paid','canceled','closed','preparing','delivering','done','cancel','close') NOT NULL DEFAULT 'pending'");
        }

        DB::table('orders')->whereIn('status', ['preparing', 'delivering', 'done'])->update(['status' => 'paid']);
        DB::table('orders')->where('status', 'cancel')->update(['status' => 'canceled']);
        DB::table('orders')->where('status', 'close')->update(['status' => 'closed']);

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE orders MODIFY status ENUM('pending','paid','canceled','closed') NOT NULL DEFAULT 'pending'");
        }
    }
};
