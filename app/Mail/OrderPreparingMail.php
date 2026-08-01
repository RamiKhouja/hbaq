<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderPreparingMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $purchases;
    public string $language;
    public array $copy;

    public function __construct(
        public Order $order,
        public string $customerName
    ) {
        $purchases = $order->purchases;

        if (is_string($purchases)) {
            $purchases = json_decode($purchases, true);
        }

        $this->purchases = is_array($purchases) ? $purchases : [];
        $this->language = in_array($order->language, ['en', 'fr', 'ar'], true)
            ? $order->language
            : 'fr';
        $this->copy = $this->translations()[$this->language];
    }

    public function build(): self
    {
        return $this
            ->subject(str_replace(':number', (string) $this->order->id, $this->copy['subject']))
            ->view('emails.order-preparing');
    }

    private function translations(): array
    {
        return [
            'fr' => [
                'subject' => 'Votre commande #:number est confirmée',
                'title' => 'Votre commande est confirmée',
                'hello' => 'Bonjour',
                'customer' => 'cher client',
                'confirmed' => 'Nous avons bien confirmé votre commande',
                'preparing' => 'Notre équipe est en train de préparer votre commande avec soin.',
                'details' => 'Détails de votre commande',
                'product' => 'Produit', 'quantity' => 'Quantité', 'price' => 'Prix',
                'subtotal' => 'Sous-total', 'delivery' => 'Livraison', 'total' => 'Total',
                'payment' => 'Paiement', 'meal_voucher' => 'Tickets restaurant',
                'cash_delivery' => 'À la livraison', 'comment' => 'Votre commentaire',
                'currency' => 'DT',
                'updates' => 'Nous vous informerons de la suite de son acheminement.',
                'thanks' => 'Merci pour votre confiance,', 'team' => 'L’équipe Hbaq',
            ],
            'en' => [
                'subject' => 'Your order #:number is confirmed',
                'title' => 'Your order is confirmed',
                'hello' => 'Hello', 'customer' => 'dear customer',
                'confirmed' => 'We have confirmed your order',
                'preparing' => 'Our team is carefully preparing your order.',
                'details' => 'Order details',
                'product' => 'Product', 'quantity' => 'Quantity', 'price' => 'Price',
                'subtotal' => 'Subtotal', 'delivery' => 'Delivery', 'total' => 'Total',
                'payment' => 'Payment', 'meal_voucher' => 'Meal voucher',
                'cash_delivery' => 'Pay at delivery', 'comment' => 'Your comment',
                'currency' => 'TND',
                'updates' => 'We will keep you updated as your order progresses.',
                'thanks' => 'Thank you for your trust,', 'team' => 'The Hbaq team',
            ],
            'ar' => [
                'subject' => 'طلبك #:number تأكّد',
                'title' => 'طلبك تأكّد',
                'hello' => 'عسلامة', 'customer' => 'حريفنا العزيز',
                'confirmed' => 'تأكّدنا من طلبك',
                'preparing' => 'فريقنا قاعد يحضّر في طلبك بكل عناية.',
                'details' => 'تفاصيل طلبك',
                'product' => 'المنتوج', 'quantity' => 'الكمية', 'price' => 'السوم',
                'subtotal' => 'المجموع الوقتي', 'delivery' => 'التوصيل', 'total' => 'المجموع',
                'payment' => 'طريقة الخلاص', 'meal_voucher' => 'الخلّاص بالبونوات',
                'cash_delivery' => 'الخلّاص وقت التوصيل', 'comment' => 'ملاحظتك',
                'currency' => 'د.ت',
                'updates' => 'باش نعلموك كي طلبك يخرج للتوصيل.',
                'thanks' => 'يعطيك الصحة على ثقتك،', 'team' => 'فريق حبق',
            ],
        ];
    }
}
