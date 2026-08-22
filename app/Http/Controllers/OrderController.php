<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use App\Mail\NewOrderAdminMail;
use App\Mail\OrderPreparingMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending'])],
            'subTotal' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'user_id' => 'nullable|exists:users,id',
            'purchases' => 'required|array', // Ensure purchases is an array
            'purchases.*' => 'required|array', // Each purchase should be an array
            'delivery' => 'required|numeric|min:0',
            'message' => 'nullable|string',
            'cutlery' => 'boolean',
            'deliveryman_id' => 'nullable|exists:users,id',
            'profile_id' => 'nullable|exists:profiles,id',
            'payment_method' => ['required', Rule::in(['cash'])],
            'shipping_method' => ['required', Rule::in(['delivery'])],
            'language' => ['nullable', Rule::in(['en', 'fr', 'ar'])],
        ]);

        // Create the order
        $order = Order::create([
            'status' => $validated['status'],
            'subTotal' => $validated['subTotal'],
            'total' => $validated['total'],
            'user_id' => $validated['user_id'] ?? null,
            'purchases' => json_encode($validated['purchases']), // Store as JSON
            'delivery' => $validated['delivery'],
            'message' => $validated['message'] ?? null,
            'cutlery' => $validated['cutlery'] ?? false,
            'deliveryman_id' => $validated['deliveryman_id'] ?? null,
            'profile_id' => $validated['profile_id'] ?? null,
            'payment_method' => $validated['payment_method'],
            'shipping_method' => $validated['shipping_method'],
            'language' => $validated['language'] ?? 'fr',
        ]);

        $this->notifyAdmins($order);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order
        ], 201);
    }

    private function notifyAdmins(Order $order): void
    {
        $person = $order->user_id
            ? User::find($order->user_id)
            : $order->profile()->first();

        $customer = [
            'name' => trim(($person?->firstname ?? '').' '.($person?->lastname ?? '')),
            'phone' => $person?->phone,
            'address' => implode(', ', array_filter([
                $person?->address,
                $person?->address_2,
                $person?->city,
                $person?->state,
                $person?->zip,
            ])),
        ];

        User::where('role', 'admin')
            ->whereNotNull('email')
            ->each(function (User $admin) use ($order, $customer) {
                try {
                    Mail::to($admin->email)->send(new NewOrderAdminMail($order, $customer));
                } catch (\Throwable $exception) {
                    Log::error('Unable to send new order email to admin.', [
                        'admin_id' => $admin->id,
                        'order_id' => $order->id,
                        'error' => $exception->getMessage(),
                    ]);
                }
            });
    }

    public function update(Request $request, $id) {
        
        $paymentRef = $request->query('payment_ref');
        
        if (!$paymentRef) {
            return response()->json(['error' => 'payment_ref is required'], 400);
        }
        
        $url = "https://api.konnect.network/api/v2/payments/{$paymentRef}";
        try {
            $response = Http::get($url);
            $data = $response->json();
            
            if (isset($data['payment']['transactions'][0])) {
                $status = $data['payment']['transactions'][0]['status'] ?? 'unknown';
    
                if($status== "success") {
                    $order = Order::find($id);
                    $order->status = 'preparing';
                    $order->save();
                    
                    return redirect()->route('order.details', ['order' => $id])
                        ->with('success', 'Order created successfully!');
                }
            }
            return response()->json(['error' => 'Invalid response structure'], 400);

        } catch (\Exception $e) {
            Log::error('Error calling Konnect API', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch payment details'], 500);
        }
    }

    public function list($id, $role) {
        $orders = Order::whereNotIn('status', ['done', 'close'])
            ->get();
        return response()->json($orders, 201);
    }

    // public function list() {
    //     //$orders = Order::where('phase', 'pending')->get();
    //     $orders = Order::whereNotIn('phase', ['closed'])
    //         ->where(function ($query) {
    //             $query->where('payment_method', '!=', 'credit-card')
    //                 ->orWhere(function ($q) {
    //                     $q->where('payment_method', 'credit-card')
    //                         ->where('status', 'paid');
    //                 });
    //         })
    //         ->get();
    //     return response()->json($orders, 201);
    // }

    public function paginate(Request $request) {
        $user = auth()->user();
        $orders = Order::with(['user', 'profile'])
            ->whereNotIn('status', ['done', 'close'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        $orders->getCollection()->transform(function ($order) {
            $order->available_actions = $order->getAvailableActions();
            return $order;
        });


        return response()->json($orders);
    }


    public function change(Request $request, Order $order)
    {
        abort_unless(auth()->check() && auth()->user()->role === 'admin', 403);

        $validated = $request->validate([
            'status' => ['required', Rule::in($order->getAvailableActions())],
        ]);

        $order->status = $validated['status'];
        $order->save();
        $order->available_actions = $order->getAvailableActions();

        if ($validated['status'] === 'preparing') {
            $this->notifyCustomerOrderIsPreparing($order);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully.',
            'order' => $order
        ]);
    }

    private function notifyCustomerOrderIsPreparing(Order $order): void
    {
        $person = $order->user_id
            ? User::find($order->user_id)
            : $order->profile()->first();

        if (! $person?->email) {
            Log::warning('Unable to send preparing email: customer has no email.', [
                'order_id' => $order->id,
            ]);

            return;
        }

        $customerName = trim(($person->firstname ?? '').' '.($person->lastname ?? ''));

        try {
            Mail::to($person->email)->send(new OrderPreparingMail($order, $customerName));
        } catch (\Throwable $exception) {
            Log::error('Unable to send order preparing email to customer.', [
                'order_id' => $order->id,
                'customer_email' => $person->email,
                'error' => $exception->getMessage(),
            ]);
        }
    }

}
