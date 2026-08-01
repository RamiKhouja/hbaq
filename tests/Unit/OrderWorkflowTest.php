<?php

namespace Tests\Unit;

use App\Models\Order;
use PHPUnit\Framework\TestCase;

class OrderWorkflowTest extends TestCase
{
    public function test_delivery_order_uses_the_expected_status_flow(): void
    {
        $order = new Order(['shipping_method' => 'delivery']);

        $order->status = 'pending';
        $this->assertSame(['preparing', 'cancel'], $order->getAvailableActions());

        $order->status = 'preparing';
        $this->assertSame(['delivering', 'cancel'], $order->getAvailableActions());

        $order->status = 'delivering';
        $this->assertSame(['done', 'cancel'], $order->getAvailableActions());

        $order->status = 'cancel';
        $this->assertSame(['close'], $order->getAvailableActions());

        $order->status = 'done';
        $this->assertSame([], $order->getAvailableActions());
    }

    public function test_non_delivery_order_skips_delivering_status(): void
    {
        $order = new Order([
            'shipping_method' => 'store',
            'status' => 'preparing',
        ]);

        $this->assertSame(['done', 'cancel'], $order->getAvailableActions());
    }
}
