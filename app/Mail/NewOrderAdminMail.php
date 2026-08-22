<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewOrderAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $purchases;

    public function __construct(
        public Order $order,
        public array $customer
    ) {
        $purchases = $order->purchases;

        if (is_string($purchases)) {
            $purchases = json_decode($purchases, true);
        }

        $this->purchases = is_array($purchases) ? $purchases : [];
    }

    public function build(): self
    {
        return $this
            ->subject("Nouvelle commande #{$this->order->id}")
            ->view('emails.new-order-admin');
    }
}
