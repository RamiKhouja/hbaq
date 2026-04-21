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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['pending', 'paid', 'canceled', 'closed'])->default('pending');
            $table->enum('phase', ['pending', 'serving', 'delivery', 'closed', 'canceled'])->default('pending');
            $table->decimal('subTotal',10,2);
            $table->decimal('total',10,2);
            $table->foreignId('user_id')->nullable();
            $table->json('purchases');
            $table->decimal('delivery',10,2);
            $table->string('message')->nullable();
            $table->boolean('cutlery')->default(true);
            $table->foreignId('deliveryman_id')->nullable();
            $table->foreignId('profile_id')->nullable();
            $table->string('payment_method');
            $table->enum('shipping_method', ['store', 'delivery']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
