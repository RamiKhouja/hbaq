<?php

namespace App\Http\Controllers\client;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Attribute;
use App\Models\Product;
use App\Models\PriceOption;
use Illuminate\Http\Request;

class ShopController extends Controller
{

    public function index(Request $request)
    {
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        $allCategories = Category::where('parent_id',null)->where('type','menu')->with('children')->get();
        $eventCategories = Category::where('parent_id',null)->where('type','event')->with('children')->get();

        $filterCategories = Category::where('type', 'menu')->orderBy('id')->get();
        $selectedCategories = collect(explode(',', $request->input('categories', '')))
            ->filter()
            ->map(fn ($category) => (int) $category)
            ->values();

        $hasActiveDiscount = function ($query) {
            $query->where('discount_price', '>', 0)
                ->where(function ($dateQuery) {
                    $dateQuery->whereNull('start_date')
                        ->orWhere('start_date', '<=', now()->toDateString());
                })
                ->where(function ($dateQuery) {
                    $dateQuery->whereNull('end_date')
                        ->orWhere('end_date', '>=', now()->toDateString());
                });
        };

        $productsQuery = Product::with([
            'categories',
            'prices' => fn ($query) => $query->orderBy('min_qty'),
        ])->latest();

        if ($selectedCategories->isNotEmpty()) {
            $productsQuery->whereHas('categories', function ($query) use ($selectedCategories) {
                $query->whereIn('categories.id', $selectedCategories);
            });
        }

        if ($request->boolean('featured')) {
            $productsQuery->where('is_featured', true);
        }

        if ($request->boolean('seasonal')) {
            $productsQuery->where('is_season', true);
        }

        if ($request->boolean('discount')) {
            $productsQuery->whereHas('prices', $hasActiveDiscount);
        }

        if ($request->filled('min')) {
            $minPrice = (float) $request->input('min');
            $productsQuery->whereHas('prices', function ($query) use ($minPrice, $hasActiveDiscount) {
                $query->where(function ($priceQuery) use ($minPrice, $hasActiveDiscount) {
                    $priceQuery->where('price', '>=', $minPrice)
                        ->orWhere(function ($discountQuery) use ($minPrice, $hasActiveDiscount) {
                            $hasActiveDiscount($discountQuery);
                            $discountQuery->where('discount_price', '>=', $minPrice);
                        });
                });
            });
        }

        if ($request->filled('max')) {
            $maxPrice = (float) $request->input('max');
            $productsQuery->whereHas('prices', function ($query) use ($maxPrice, $hasActiveDiscount) {
                $query->where(function ($priceQuery) use ($maxPrice, $hasActiveDiscount) {
                    $priceQuery->where('price', '<=', $maxPrice)
                        ->orWhere(function ($discountQuery) use ($maxPrice, $hasActiveDiscount) {
                            $hasActiveDiscount($discountQuery);
                            $discountQuery->where('discount_price', '<=', $maxPrice);
                        });
                });
            });
        }

        $products = $productsQuery->paginate(12)->withQueryString();

        

        return inertia('Client/Shop', [
            'categories' => $allCategories,
            'eventCategories'=> $eventCategories,
            'filterCategories' => $filterCategories,
            'products' => $products,
            'filters' => $request->only(['categories', 'featured', 'seasonal', 'discount', 'min', 'max']),
        ]);
    }

    public function categories(Request $request)
    {
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        $categories = Category::where('parent_id',null)->where('type','menu')->with('children')->get();
        $eventCategories = Category::where('parent_id',null)->where('type','event')->with('children')->get();

        return inertia('Client/Categories', [
            'categories' => $categories,
            'eventCategories' => $eventCategories
        ]);
    }

    public function search(Request $request)
    {
        $query = trim($request->input('query'));

        $results = Product::where(function ($q) use ($query) {
            $q->where('name->en', 'LIKE', "%{$query}%")
            ->orWhere('name->ar', 'LIKE', "%{$query}%")
            ->orWhere('name->fr', 'LIKE', "%{$query}%");
        })->get();

        return response()->json($results);
    }

    public function catprods($url)
    {
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        $category = Category::where('url', $url)->first();
        if (!$category) {
            abort(404, 'Category not found');
        }
        $products = $category->products()->with('pictures')->where('unit', '!=', 'pack')->get();
        $categories = Category::where('parent_id',null)->where('type','menu')->with('children')->get();
        $eventCategories = Category::where('parent_id',null)->where('type','event')->with('children')->get();

        return inertia('Client/Products', [
            'category' => $category,
            'eventCategories' => $eventCategories,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function eventprods($url)
    {
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        $category = Category::where('url', $url)->first();
        if (!$category) {
            abort(404, 'Category not found');
        }
        $products = $category->products()->with('pictures')->where('unit', 'pack')->get();
        $categories = Category::where('parent_id',null)->where('type','menu')->with('children')->get();
        $eventCategories = Category::where('parent_id',null)->where('type','event')->with('children')->get();

        return inertia('Client/Occasion', [
            'category' => $category,
            'eventCategories' => $eventCategories,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function calculatePrice($id, $quantity, $type)
    {
        $price_option = PriceOption::where('product_id',$id)
            ->where('unit',$type)
            ->where('min_qty','<=',$quantity)
            ->orderBy('min_qty', 'desc')
            ->first();
        $price=0;
        $currency = 'sr';
        $currentDate = now()->format('Y-m-d');
        if($price_option) {
            $price = $price_option->price ;
            if($price_option->is_discount && $price_option->discount_start <= $currentDate && $price_option->discount_end >= $currentDate){
                $price = $price_option->discount_price;
            }
            $currency = $price_option->currency;
        }
        
        return response()->json(['price' => number_format(floatval($price), 2), 'currency' => $currency]);
    }
}
