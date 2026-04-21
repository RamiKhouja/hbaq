<?php

namespace App\Http\Controllers\client;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ShowController extends Controller
{
    public function index($url)
    {
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $product = Product::where('url', $url)->with('pictures')->with('categories')->first();
        if (!$product) {
            abort(404, 'Product not found');
        }
        $categories = Category::where('parent_id',null)->where('type','menu')->with('children')->get();
        $eventCategories = Category::where('parent_id',null)->where('type','event')->with('children')->get();

        $productCategoryIds = $product->categories->pluck('id');

        $relatedProducts = Product::where('id', '!=', $product->id)
            ->whereHas('categories', function ($query) use ($productCategoryIds) {
                $query->whereIn('categories.id', $productCategoryIds);
            })
            ->with(['pictures', 'categories'])
            ->limit(10) // optional
            ->get();

        return inertia('Client/Product', [
            'categories' => $categories,
            'eventCategories' => $eventCategories,
            'product' => $product,
            'related' => $relatedProducts
        ]);
    }
}
