<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'status' => 'required|string',
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
            'payment_method' => 'required|string',
            'shipping_method' => 'required|string'
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
            'cutlery' => $validated['cutlery'] ?? true,
            'deliveryman_id' => $validated['deliveryman_id'] ?? null,
            'profile_id' => $validated['profile_id'] ?? null,
            'payment_method' => $validated['payment_method'],
            'shipping_method' => $validated['shipping_method']
        ]);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order
        ], 201);
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
                    $order->status = 'paid';
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
        $orders = Order::when($role === 'delivery', function ($query) use ($id) {
                $query->where('phase', 'delivery')
                ->where('deliveryman_id', $id);
            }, function ($query) {
                $query->whereNotIn('phase', ['closed', 'canceled']);
            })
            ->where(function ($query) {
                $query->where('payment_method', '!=', 'credit-card')
                    ->orWhere(function ($q) {
                        $q->where('payment_method', 'credit-card')
                            ->where('status', 'paid');
                    });
            })
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
            ->when($user->role === 'delivery', function ($query) {
                $query->where('phase', 'delivery');
            }, function ($query) {
                $query->whereNotIn('phase', ['closed', 'canceled']);
            })
            ->where(function ($query) {
                $query->where('payment_method', '!=', 'credit-card')
                    ->orWhere(function ($q) {
                        $q->where('payment_method', 'credit-card')
                            ->where('status', 'paid');
                    });
            })
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
        $validated = $request->validate([
            'status' => ['nullable', Rule::in(['pending', 'paid', 'canceled', 'closed'])],
            'phase' => ['nullable', Rule::in(['pending', 'serving', 'delivery', 'closed', 'canceled'])],
            'deliveryman_id' => ['nullable']
        ]);

        if (isset($validated['status'])) {
            $order->status = $validated['status'];
        }

        if (isset($validated['phase'])) {
            $order->phase = $validated['phase'];
        }

        if(isset($validated['deliveryman_id'])) {
            $order->deliveryman_id = $validated['deliveryman_id'];
        }


        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully.',
            'order' => $order
        ]);
    }

}
