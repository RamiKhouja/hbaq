<?php

namespace App\Http\Controllers\client;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Address;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use App\Models\Purchase;
use App\Models\Cart;
use App\Models\Category;
use App\Models\PriceOption;
use Barryvdh\DomPDF\Facade\Pdf;
use NumberToWords\NumberToWords;


class CartController extends Controller
{
    //

    public function index()
    {
        $user = auth()->user();
        // $purchases = $user->cart->purchases;
        // $products = Product::whereIn('id',$purchases->pluck('product_id'))->get();

        $products = DB::table('products')->join('purchases','purchases.product_id','=','products.id')
        ->where('purchases.cart_id','=',$user->cart->id)
        ->get();
        return inertia('Client/Cart',[
            'user'=>$user,
            'cart'=>$user->cart,
            'products'=>$products

        ]) ;
        
    }

    public function getCart()
    {
        $user = auth()->user();

        $products = DB::table('products')->join('purchases','purchases.product_id','=','products.id')
            ->where('purchases.cart_id','=',$user->cart->id)
            ->get();
        $cart = $user->cart;
        $cart->purchases = $products;
        return response()->json($cart);
    }

    public function update(request $request) {

        $purchase = Purchase::find($request->input('id'));
        $purchase->quantity = $request->input('quantity');
        $cart = Cart::where('id',$purchase->cart_id)->first();
        $cart->subTotal-= $purchase->price;
        //$price_option = PriceOption::where('product_id',$purchase->product_id)->where('unit',$purchase->type)->where('min_qty','<',$purchase->quantity)->max('min_qty')->first();
        $price_option = PriceOption::where('product_id',$purchase->product_id)
            ->where('unit',$purchase->type)
            ->where('min_qty','<=',$purchase->quantity)
            ->orderBy('min_qty', 'desc')
            ->first();
        $price = $price_option->price * $purchase->quantity ;
        $currentDate = now()->format('Y-m-d');
        if($price_option->is_discount && $price_option->discount_start <= $currentDate && $price_option->discount_end >= $currentDate){
            $price -= $price_option->discount_price;
        }
        $purchase->price = $price;
        $cart->subTotal+= $purchase->price;
        $cart->save();
        $purchase->save();
        return back();

    
    }

    public function addToCart(Request $request)
    {
        $user = auth()->user();
        $purchase = new Purchase;
        $purchase->quantity = $request->input('quantity');
        $purchase->product_id = $request->input('product_id');
        $purchase->type = $request->input('type');
        $purchase->cart_id = $user->cart->id;
        
        //calculate new sub total
        $price_option = PriceOption::where('product_id',$purchase->product_id)
            ->where('unit',$purchase->type)
            ->where('min_qty','<=',$purchase->quantity)
            ->orderBy('min_qty', 'desc')
            ->value('id');
        $price = PriceOption::find($price_option)->price * $purchase->quantity ;
        $currentDate = now()->format('Y-m-d');
        $po = PriceOption::find($price_option);
        if($po->is_discount && $po->discount_start <= $currentDate && $po->discount_end >= $currentDate){
            $price = $po->discount_price * $purchase->quantity;
        }
        $purchase->price = $price;
        $user->cart->subTotal += $price;
        $user->cart->save();
        $purchase->save();
        return back()->with('success', 'product-add-cart-success');
        //return redirect()->route('cart.index');
    }
    public function removeFromCart(Purchase $purchase) {
        $user = auth()->user();
        //calculate new sub total
      
        $user->cart->subTotal -= $purchase->price;
        $user->cart->save();
        $purchase->delete(); // Delete the product
        return back();
    }


    public function clearCart() {
        $user = auth()->user();
        $purchases = Purchase::where('cart_id',$user->cart->id)->get();
        foreach ($purchases as $purchase) {
            $purchase->delete();
        }
        $user->cart->subTotal = 0;
        $user->cart->save();
    }

    public function history() {
        $orders = Order::where("user_id", auth()->user()->id)->orderBy('id', 'DESC')->get();
        return inertia('Client/History',[
            'orders'=>$orders
        ]);
    }

    public function orderDetails($id) {
        $order = order::find($id);
        if(!$order) {
            return redirect()->route('home.index')->with('error', 'Order not found');
        }
        $purchases = json_decode($order->purchases);
        $order->purchases = $purchases;
        $categories = Category::where('parent_id',null)->where('type','menu')->with('children')->get();
        $eventCategories = Category::where('parent_id',null)->where('type','event')->with('children')->get();
        return inertia('Client/OrderDetails',[
            'order'=>$order,
            'eventCategories' => $eventCategories,
            'categories' => $categories,
        ]);
    }


    public function checkout() {
        $allCategories = Category::where('parent_id',null)->with('children')->get();
        $user = null;
        if(auth()->check()) {
            $userId =   auth()->user()->id; 
            $user = User::with(['addresses' => function ($query) {
                $query->where('type', 'shipping');
            }])->find($userId);  
        }
        return inertia('Client/Checkout',[
            'user'=>$user,
            'categories'=>$allCategories
        ]);
    }

    public function order() {
        $allCategories = Category::where('parent_id',null)->with('children')->get();
        // $user = auth()->user()->with('addresses')->where('addresses.type','shipping')->with('cart')->with('company')->first();
        $userId =   auth()->user()->id; 
        $user = User::with(['addresses' => function ($query) {
            $query->where('type', 'shipping');
        },'company', 'cart'])->find($userId);  
        $purchases = DB::table('products')->join('purchases','purchases.product_id','=','products.id')
        ->where('purchases.cart_id','=',$user->cart->id)
        ->get();
        return inertia('Client/Order',[
            'user'=>$user,
            'categories'=>$allCategories,
            'purchases'=>$purchases
        ]);
    }
    // public function checkout() {
    //     $cart = auth()->user()->cart;
    //     $order = new Order;
    //     $order->status = "created";
    //     $order->tax = 0.15;
    //     $order->shipping = 10.00;
    //     $order->subTotal = $cart->subTotal;
    //     $order->total = $order->subTotal + $order->subTotal*$order->tax + $order->shipping;
    //     $order->user_id = auth()->user()->id;
    //     // $products = [];
    //     // foreach ($cart->purchases as $purchase) {
    //     //     $product = Product::find($purchase->product_id)->first();

    //     //     $price = PriceOption::find($price_option)->price * $purchase->quantity ;
    //     //     $currentDate = now()->format('Y-m-d');
    //     //     if(PriceOption::find($price_option)->is_discount && $price_option->discount_start <= $currentDate && $price_option->discount_end >= $currentDate){
    //     //         $price -= $price_option->discount_price;
    //     //     } 
    //     //     array_push($products, [
    //     //         "name"=>$product->name,
    //     //         "price"=> $price,
    //     //         "quantity"=> $purchase->quantity,
    //     //         "total"=> $purchase->price
    //     //     ]);
    //     // }
    //     //$order->purchases = json_encode($products);
    //     // $order->purchases = $cart->purchases->toJson();
    //     $order->purchases = json_encode($cart->purchases);
    //     $order->save();
    //     DB::table('purchases')->where('cart_id', '=', $cart->id)->delete();
    //     $cart->subTotal = 0;
    //     $cart->save();
    //     return redirect()->route('order.details', ['order' => $order->id])->with('success','Order Created Successfully');
    // }

    public function downloadPDF(Order $order) {
        $user = auth()->user()->with(['addresses' => function ($query) {
            $query->where('type', 'billing');
        },'company'])->first(); 
        $order->purchases = json_decode($order->purchases);
        foreach($order->purchases as $purchase) {
            $product = Product::find($purchase->product_id);
            $purchase->product = $product;
        }
        $order->total_letters = NumberToWords::transformCurrency('ar', $order->total*100, 'SAR');
        $pdf = PDF::loadView('invoice_en',  [
            'order' => $order,
            'user' => $user
        ]);
        return $pdf->stream('INVOICE_'.$order->created_at.'.pdf');
    }
    public function downloadPDF_ar(Order $order) {
        $user = auth()->user()->with(['addresses' => function ($query) {
            $query->where('type', 'shipping');
        },'company'])->first(); 
        $order->purchases = json_decode($order->purchases);
        foreach($order->purchases as $purchase) {
            $product = Product::find($purchase->product_id);
            $purchase->product = $product;
        }
        $order->total_letters = NumberToWords::transformCurrency('ar', $order->total*100, 'SAR');
        
        $html = view('invoice_en',  [
            'order' => $order,
            'user' => $user
        ])->toArabicHTML();
        $pdf = PDF::loadHTML($html);
        return $pdf->setOptions(['isHtml5ParserEnabled' => true, 'isRemoteEnabled' => true, 'enable_php' => true])
                    ->stream('INVOICE_'.$order->created_at.'.pdf');
        
    }
    
}