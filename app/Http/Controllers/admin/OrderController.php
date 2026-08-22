<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use App\Models\HbaqSetting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    //
    public function index(Request $request) {
        $statuses = ['pending', 'preparing', 'delivering', 'done', 'cancel', 'close'];
        $status = in_array($request->query('status'), $statuses, true)
            ? $request->query('status')
            : null;
        $search = trim((string) $request->query('search', ''));
        $search = mb_substr($search, 0, 100);

        $orders = Order::with(['user', 'profile'])
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($search !== '', function ($query) use ($search) {
                $idSearch = ltrim($search, '#');
                $nameParts = array_values(array_filter(
                    preg_split('/\s+/u', $search) ?: []
                ));

                $query->where(function ($query) use ($idSearch, $nameParts) {
                    if (ctype_digit($idSearch)) {
                        $query->orWhere('id', (int) $idSearch);
                    }

                    foreach (['user', 'profile'] as $relation) {
                        $query->orWhereHas($relation, function ($personQuery) use ($nameParts) {
                            foreach ($nameParts as $part) {
                                $personQuery->where(function ($nameQuery) use ($part) {
                                    $nameQuery->where('firstname', 'like', "%{$part}%")
                                        ->orWhere('lastname', 'like', "%{$part}%");
                                });
                            }
                        });
                    }
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();
            
        $orders->getCollection()->transform(function ($order) {
            $order->available_actions = $order->getAvailableActions();
            return $order;
        });

        return inertia('Admin/Order/Index', [
            'orders' => $orders,
            'deliverymen' => [],
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'nextBillNumber' => $this->nextBillNumber(),
        ]);
    }

    
    public function create(Request $request) {
        $order = new Order;
        $order->user_id = $request->input('user_id');
        $order->status = "created";
        $order->subTotal = $request->input('subTotal');
        $order->tax = 0.15;
        $order->total = $order->subTotal + $order->subTotal * $order->tax;
        $purchases = array();
        foreach ($request->input("purchases") as $purchase) {
            $name = Product::where('id',$request->input("product_id"))->first();
            $quantity = $request->input("quantity");
            array_push($purchases, [$name, $quantity]);
        }
        $order->purchases = $purchases;
        $order->save();
        
    }
    public function edit() {
        return inertia('Admin/Order/edit', [
            'orders' => $$orders,
        ]);
        
    }
    public function update(Request $request){

    }

    public function bill(Request $request, Order $order)
    {
        abort_unless(in_array($order->status, ['delivering', 'done'], true), 404);

        $validated = $request->validate([
            'bill_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('orders', 'bill_number')->ignore($order->id),
            ],
            'include_approval' => ['sometimes', 'boolean'],
        ]);

        $order->bill_number = $validated['bill_number'];
        $order->bill_generated_at = now();
        $order->save();

        return $this->renderBill($order, ! empty($validated['include_approval']));
    }

    public function clientBill(Order $order)
    {
        abort_unless($order->user_id === auth()->id(), 403);
        abort_unless($order->status === 'done', 404);

        if (! $order->bill_number) {
            $order->bill_number = $this->nextBillNumber();
            $order->bill_generated_at = now();
            $order->save();
        }

        return $this->renderBill($order, true, true);
    }

    private function renderBill(Order $order, bool $includeApproval, bool $download = false)
    {

        $order->load([
            'user.company.addresses',
            'user.addresses',
            'profile',
        ]);

        $client = $this->invoiceClient($order);
        $purchases = $order->purchases;

        if (is_string($purchases)) {
            $purchases = json_decode($purchases, true);
        }

        $settings = HbaqSetting::first();
        $logo = $this->invoiceImage($settings?->logo)
            ?: $this->imageDataUri(storage_path('app/pictures/hbaq-logo.png'));
        $vatRate = (float) ($settings?->vat_rate ?? 0);
        $preTaxTotal = (float) $order->total;
        $vatAmount = round($preTaxTotal * $vatRate / 100, 2);
        $stampAmount = 1.00;

        $invoiceData = [
            'order' => $order,
            'client' => $client,
            'purchases' => is_array($purchases) ? $purchases : [],
            'logo' => $logo,
            'signature' => $includeApproval
                ? $this->invoiceImage($settings?->signature)
                : null,
            'stamp' => $includeApproval
                ? $this->invoiceImage($settings?->stamp)
                : null,
            'invoiceTotals' => [
                'pre_tax' => $preTaxTotal,
                'vat_rate' => $vatRate,
                'vat' => $vatAmount,
                'stamp' => $stampAmount,
                'total' => $preTaxTotal + $vatAmount + $stampAmount,
            ],
            'seller' => [
                'name' => $settings?->company_name ?: 'Hbaq',
                'mf' => $settings?->fiscal_number ?: '0000000/A/A/000',
                'address' => $settings?->address ?: 'Tunis, Tunisie',
                'phone' => $settings?->phone,
                'email' => $settings?->email,
                'rib' => $settings?->rib,
                'vat_rate' => $settings?->vat_rate,
            ],
        ];

        $html = view('invoices.order', $invoiceData)->toArabicHTML();
        $pdf = Pdf::loadHTML($html)->setPaper('a4');

        $safeBillNumber = preg_replace('/[^A-Za-z0-9_-]+/', '-', $order->bill_number);

        return $download
            ? $pdf->download($safeBillNumber.'.pdf')
            : $pdf->stream($safeBillNumber.'.pdf');
    }

    private function nextBillNumber(): string
    {
        $lastBillNumber = Order::whereNotNull('bill_number')
            ->orderByDesc('bill_generated_at')
            ->orderByDesc('id')
            ->value('bill_number');

        if (! $lastBillNumber) {
            return 'FA0001';
        }

        if (preg_match('/^(.*?)(\d+)$/', $lastBillNumber, $matches)) {
            $prefix = $matches[1];
            $digits = $matches[2];
            $nextDigits = str_pad(
                (string) (((int) $digits) + 1),
                strlen($digits),
                '0',
                STR_PAD_LEFT
            );

            return $prefix.$nextDigits;
        }

        return $lastBillNumber.'1';
    }

    private function invoiceImage(?string $path): ?string
    {
        return $path
            ? $this->imageDataUri(storage_path('app/'.$path))
            : null;
    }

    private function imageDataUri(string $path): ?string
    {
        if (! is_file($path)) {
            return null;
        }

        $mime = mime_content_type($path) ?: 'image/png';

        return 'data:'.$mime.';base64,'.base64_encode(file_get_contents($path));
    }

    private function invoiceClient(Order $order): array
    {
        $user = $order->user;

        if ($user?->company) {
            $company = $user->company;
            $name = is_array($company->name)
                ? ($company->name['fr'] ?? $company->name['en'] ?? $company->name['ar'] ?? '')
                : $company->name;
            $mf = is_array($company->mf)
                ? ($company->mf['value'] ?? '')
                : $company->mf;

            return [
                'type' => 'Société',
                'name' => $name,
                'mf' => $mf,
                'email' => $company->email,
                'phone' => $company->phone,
                'address' => $this->formatAddress($company->addresses->first()),
            ];
        }

        $person = $user ?: $order->profile;
        $address = $user
            ? ($this->formatAddress($user->addresses->first()) ?: $this->formatDirectAddress($user))
            : $this->formatDirectAddress($person);

        return [
            'type' => 'Particulier',
            'name' => trim(($person?->firstname ?? '').' '.($person?->lastname ?? '')),
            'mf' => null,
            'email' => $person?->email,
            'phone' => $person?->phone,
            'address' => $address,
        ];
    }

    private function formatAddress($address): string
    {
        if (! $address) {
            return '';
        }

        return implode(', ', array_filter([
            $address->address_1,
            $address->address_2,
            $address->zip,
            $address->city,
            $address->state,
            $address->country,
        ]));
    }

    private function formatDirectAddress($person): string
    {
        if (! $person) {
            return '';
        }

        return implode(', ', array_filter([
            $person->address,
            $person->address_2,
            $person->zip,
            $person->city,
            $person->state,
            $person->country,
        ]));
    }

    public function delete(Order $order) {
        $order->delete();
        redirect()->route('admin.orders.index');
        
    }

}
