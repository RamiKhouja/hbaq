<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;

class OrderController extends Controller
{
    //
    public function index() {
        $user = auth()->user();
        $orders = Order::with(['user', 'profile'])
            ->whereNotIn('status', ['done', 'close'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        $orders->getCollection()->transform(function ($order) {
            $order->available_actions = $order->getAvailableActions();
            return $order;
        });

        return inertia('Admin/Order/Index', [
            'orders' => $orders,
            'deliverymen' => []
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

    public function delete(Order $order) {
        $order->delete();
        redirect()->route('admin.orders.index');
        
    }

    public function history() {
        $user = auth()->user();
        $orders = Order::with(['user', 'profile'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return inertia('Admin/Order/History', [
            'orders' => $orders,
        ]);
    }
}
