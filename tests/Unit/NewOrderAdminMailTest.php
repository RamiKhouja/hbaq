<?php

namespace Tests\Unit;

use App\Mail\NewOrderAdminMail;
use App\Models\Order;
use Tests\TestCase;

class NewOrderAdminMailTest extends TestCase
{
    public function test_admin_email_is_rendered_in_french_with_order_and_customer_details(): void
    {
        $order = new Order([
            'subTotal' => 20,
            'delivery' => 5,
            'total' => 25,
            'status' => 'pending',
            'payment_method' => 'cash',
            'shipping_method' => 'delivery',
            'purchases' => [[
                'quantity' => 2,
                'product' => [
                    'name' => ['fr' => 'Tomates'],
                    'price' => 10,
                ],
            ]],
        ]);
        $order->id = 42;

        $mail = new NewOrderAdminMail($order, [
            'name' => 'Jean Dupont',
            'phone' => '20 000 000',
            'address' => '10 rue Exemple, Tunis',
        ]);

        $mail->assertSeeInHtml('Nouvelle commande #00042');
        $mail->assertSeeInHtml('Jean Dupont');
        $mail->assertSeeInHtml('20 000 000');
        $mail->assertSeeInHtml('10 rue Exemple, Tunis');
        $mail->assertSeeInHtml('Tomates');
        $mail->assertSeeInHtml('À la livraison');
    }

    public function test_admin_email_decodes_items_stored_as_json(): void
    {
        $order = new Order([
            'subTotal' => 10,
            'delivery' => 5,
            'total' => 15,
            'purchases' => json_encode([[
                'quantity' => 1,
                'product' => [
                    'name' => ['fr' => 'Pommes'],
                    'price' => 10,
                ],
            ]]),
        ]);
        $order->id = 43;

        $mail = new NewOrderAdminMail($order, [
            'name' => 'Client Test',
            'phone' => '21 000 000',
            'address' => 'Tunis',
        ]);

        $mail->assertSeeInHtml('Pommes');
    }
}
