<?php

namespace Tests\Unit;

use App\Mail\OrderPreparingMail;
use App\Models\Order;
use Tests\TestCase;

class OrderPreparingMailTest extends TestCase
{
    public function test_preparing_email_is_rendered_in_french(): void
    {
        $order = new Order([
            'status' => 'preparing',
            'language' => 'fr',
            'subTotal' => 20,
            'delivery' => 5,
            'total' => 25,
            'message' => 'Sans sac plastique',
            'purchases' => json_encode([[
                'quantity' => 2,
                'product' => [
                    'name' => ['fr' => 'Tomates'],
                    'price' => 10,
                ],
            ]]),
        ]);
        $order->id = 52;

        $mail = new OrderPreparingMail($order, 'Marie Dupont');

        $mail->assertHasSubject('Votre commande #52 est confirmée');
        $mail->assertSeeInHtml('Bonjour Marie Dupont');
        $mail->assertSeeInHtml('Votre commande est confirmée');
        $mail->assertSeeInHtml('Notre équipe est en train de préparer votre commande avec soin.');
        $mail->assertSeeInHtml('#00052');
        $mail->assertSeeInHtml('Détails de votre commande');
        $mail->assertSeeInHtml('Tomates');
        $mail->assertSeeInHtml('25,00 DT');
        $mail->assertSeeInHtml('À la livraison');
        $mail->assertSeeInHtml('Sans sac plastique');
    }

    public function test_preparing_email_shows_ticket_restaurant_payment(): void
    {
        $order = new Order([
            'subTotal' => 20,
            'delivery' => 5,
            'total' => 25,
            'cutlery' => true,
            'purchases' => [],
        ]);
        $order->id = 53;

        $mail = new OrderPreparingMail($order, 'Marie Dupont');

        $mail->assertSeeInHtml('Tickets restaurant');
    }

    public function test_preparing_email_is_rendered_in_english(): void
    {
        $order = new Order([
            'language' => 'en',
            'subTotal' => 10,
            'delivery' => 5,
            'total' => 15,
            'purchases' => json_encode([[
                'quantity' => 1,
                'product' => [
                    'name' => ['en' => 'Apples', 'fr' => 'Pommes'],
                    'price' => 10,
                ],
            ]]),
        ]);
        $order->id = 54;

        $mail = new OrderPreparingMail($order, 'John Doe');

        $mail->assertHasSubject('Your order #54 is confirmed');
        $mail->assertSeeInHtml('Your order is confirmed');
        $mail->assertSeeInHtml('Our team is carefully preparing your order.');
        $mail->assertSeeInHtml('Apples');
        $mail->assertSeeInHtml('Pay at delivery');
        $mail->assertSeeInHtml('15,00 TND');
    }

    public function test_preparing_email_is_rendered_in_tunisian_arabic(): void
    {
        $order = new Order([
            'language' => 'ar',
            'subTotal' => 10,
            'delivery' => 5,
            'total' => 15,
            'cutlery' => true,
            'purchases' => json_encode([[
                'quantity' => 1,
                'product' => [
                    'name' => ['ar' => 'تفاح', 'fr' => 'Pommes'],
                    'price' => 10,
                ],
            ]]),
        ]);
        $order->id = 55;

        $mail = new OrderPreparingMail($order, 'محمد');

        $mail->assertHasSubject('طلبك #55 تأكّد');
        $mail->assertSeeInHtml('طلبك تأكّد');
        $mail->assertSeeInHtml('فريقنا قاعد يحضّر في طلبك بكل عناية.');
        $mail->assertSeeInHtml('تفاح');
        $mail->assertSeeInHtml('الخلّاص بالبونوات');
        $mail->assertSeeInHtml('15,00 د.ت');
        $this->assertStringContainsString('dir="rtl"', $mail->render());
        $this->assertStringContainsString('direction: rtl', $mail->render());
    }

    public function test_preparing_email_falls_back_to_french(): void
    {
        $order = new Order([
            'language' => 'de',
            'subTotal' => 10,
            'delivery' => 5,
            'total' => 15,
            'purchases' => [],
        ]);
        $order->id = 56;

        $mail = new OrderPreparingMail($order, 'Client');

        $mail->assertHasSubject('Votre commande #56 est confirmée');
        $mail->assertSeeInHtml('Votre commande est confirmée');
    }
}
