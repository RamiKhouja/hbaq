<?php

namespace App\Http\Controllers\client;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Pack;
use App\Models\Service;
use App\Models\Cart;
use App\Models\About;
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
        $featured = Product::with(['prices' => function ($q) {
                $q->orderBy('min_qty');
            }])->where(function ($q) {
                $q->where('is_featured', true)
                    ->orWhere('is_new', true)
                    ->orWhereHas('prices', function ($query) {
                        $query->where('discount_price', '>', 0)
                            ->where(function ($dateQuery) {
                                $dateQuery->whereNull('start_date')
                                    ->orWhere('start_date', '<=', now()->toDateString());
                            })
                            ->where(function ($dateQuery) {
                                $dateQuery->whereNull('end_date')
                                    ->orWhere('end_date', '>=', now()->toDateString());
                            });
                    });
        })->where('unit', '!=', 'pack')->take(20)->get();
        $seasonal = Product::with(['prices' => function ($q) {
                $q->orderBy('min_qty');
            }])
            ->where('is_season', true)
            ->where('unit', '!=', 'pack')
            ->take(20)
            ->get();
        $packs = Pack::with('products', 'pictures')
            ->where(function ($q) {
                $q->where('is_featured', true)
                    ->orWhere('is_new', true)
                    ->orWhere('discount_price', '>', 0);
            })
            ->take(8)
            ->get();
        $services = Service::where('show_in_home', true)->take(3)->get();
        $prodCats = Category::with(['products'])->get()->map(function ($category) {
            return [
                'category' => $category,
                'products' => $category->products // Assuming the relationship is defined in Category model
            ];
        });
        $testimonials = Testimonial::where('is_approved', true)->get();
        $about = About::first();
        
        // $products = DB::table('products')->join('purchases','purchases.product_id','=','products.id')
        //     ->where('purchases.cart_id','=',$user->cart->id)
        //     ->get();
        // $cart = $user->cart;
        // $cart->purchases = $products;
        return inertia('Client/Home', [
            'categories' => $categories,
            // 'eventCategories' => $eventCategories,
            'featured' => $featured,
            'seasonal' => $seasonal,
            'packs' => $packs,
            // 'prodCats' => $prodCats,
            // 'services' => $services,
            'about' => $about,
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
