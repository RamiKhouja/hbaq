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

        $categories = Category::where('type', 'menu')->get();

        // Filter products based on the parameters
        

        if ($categories) {
            $categories = explode(',', $categories);
            // $productsQuery->whereHas('categories', function ($query) use ($categories) {
            //     $query->whereIn('category_id', $categories);
            // });
        }
        

        $prodCats = Category::with(['products'])->where('type','menu')->get()->map(function ($category) {
            return [
                'category' => $category,
                'products' => $category->products // Assuming the relationship is defined in Category model
            ];
        });
        $selectedCat = null;
        if($categories && count($categories)>0) {
            $selectedCat = $categories[0];
        }

        

        return inertia('Client/Shop', [
            'categories' => $allCategories,
            'eventCategories'=> $eventCategories,
            'prodCats' => $prodCats,
            'selectedCat' => $selectedCat
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
