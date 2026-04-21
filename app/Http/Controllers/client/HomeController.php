<?php

namespace App\Http\Controllers\client;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Service;
use App\Models\Cart;
use App\Models\About;
use App\Models\Ceo;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        //$user = auth()->user();
        $categories = Category::where('parent_id',null)->where('type','menu')->with('children')->get();
        $eventCategories = Category::where('parent_id',null)->where('type','event')->with('children')->get();
        $featured = Product::where('is_featured', true)->where('unit', '!=', 'pack')->take(20)->get();
        $services = Service::where('show_in_home', true)->take(3)->get();
        $prodCats = Category::with(['products'])->get()->map(function ($category) {
            return [
                'category' => $category,
                'products' => $category->products // Assuming the relationship is defined in Category model
            ];
        });
        $testimonials = Testimonial::where('is_approved', true)->get();
        $about = About::first();
        $ceo = CEO::first();
        
        // $products = DB::table('products')->join('purchases','purchases.product_id','=','products.id')
        //     ->where('purchases.cart_id','=',$user->cart->id)
        //     ->get();
        // $cart = $user->cart;
        // $cart->purchases = $products;
        return inertia('Client/Home', [
            'categories' => $categories,
            'eventCategories' => $eventCategories,
            'featured' => $featured,
            'prodCats' => $prodCats,
            'services' => $services,
            'about' => $about,
            'ceo' => $ceo,
            'testimonials' => $testimonials
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
