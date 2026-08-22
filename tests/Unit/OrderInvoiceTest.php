<?php

namespace Tests\Unit;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class OrderInvoiceTest extends TestCase
{
    public function test_french_order_invoice_renders_as_pdf(): void
    {
        $order = new Order([
            'status' => 'done',
            'subTotal' => 20,
            'delivery' => 5,
            'total' => 25,
            'cutlery' => true,
            'message' => 'Livrer le matin',
        ]);
        $order->id = 72;
        $order->bill_number = 'FA1042';
        $order->created_at = Carbon::parse('2026-08-07');

        $invoiceData = [
            'order' => $order,
            'client' => [
                'type' => 'Société',
                'name' => 'شركة المثال',
                'mf' => '1234567/A/A/000',
                'email' => 'client@example.com',
                'phone' => '20 000 000',
                'address' => 'نهج المثال، تونس',
            ],
            'purchases' => [[
                'quantity' => 2,
                'product' => [
                    'name' => ['fr' => 'Tomates'],
                    'price' => 10,
                ],
            ]],
            'logo' => null,
            'seller' => [
                'name' => 'Hbaq',
                'mf' => '0000000/A/A/000',
                'address' => 'Tunis, Tunisie',
            ],
        ];

        $html = view('invoices.order', $invoiceData)->toArabicHTML();
        $pdf = Pdf::loadHTML($html);

        $output = $pdf->output();

        $this->assertNotSame(view('invoices.order', $invoiceData)->render(), $html);
        $this->assertStringStartsWith('%PDF-', $output);
        $this->assertGreaterThan(1000, strlen($output));
    }
}
