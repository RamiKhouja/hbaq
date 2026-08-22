<?php

namespace App\Http\Controllers\client;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Pack;
use App\Models\PackCategory;
use App\Models\Package;
use App\Models\Product;
use Illuminate\Http\Request;

class PackController extends Controller
{
    public function index(Request $request)
    {
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $selectedCategory = $request->integer('category') ?: null;
        $packs = Pack::with('products', 'pictures', 'categories')
            ->when($selectedCategory, fn ($query) => $query->whereHas(
                'categories',
                fn ($categoryQuery) => $categoryQuery->where('pack_categories.id', $selectedCategory)
            ))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return inertia('Client/Packs', [
            'categories' => Category::where('parent_id', null)->where('type', 'menu')->with('children')->get(),
            'eventCategories' => Category::where('parent_id', null)->where('type', 'event')->with('children')->get(),
            'packCategories' => PackCategory::where('menu_show', true)->orderBy('name->en')->get(['id', 'name']),
            'selectedCategory' => $selectedCategory,
            'packs' => $packs,
        ]);
    }

    public function show(string $url)
    {
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $pack = Pack::where('url', $url)
            ->with([
                'pictures',
                'products' => fn ($query) => $query->with(['prices' => fn ($priceQuery) => $priceQuery->orderBy('min_qty')]),
            ])
            ->first();

        if (!$pack) {
            abort(404, 'Pack not found');
        }

        return inertia('Client/Pack', [
            'categories' => Category::where('parent_id', null)->where('type', 'menu')->with('children')->get(),
            'eventCategories' => Category::where('parent_id', null)->where('type', 'event')->with('children')->get(),
            'pack' => $pack,
            'related' => Pack::with('products', 'pictures')
                ->where('id', '!=', $pack->id)
                ->where(function ($query) {
                    $query->where('is_featured', true)->orWhere('is_new', true);
                })
                ->take(4)
                ->get(),
        ]);
    }

    public function build()
    {
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return inertia('Client/BuildPack', [
            'categories' => Category::whereNull('parent_id')->where('type', 'menu')->with('children')->get(),
            'eventCategories' => Category::whereNull('parent_id')->where('type', 'event')->with('children')->get(),
            'productCategories' => Category::where('type', 'menu')->orderBy('name->en')->get(['id', 'name']),
            'products' => Product::where('stock', '>', 0)
                ->with([
                    'categories:id,name',
                    'prices' => fn ($query) => $query->orderBy('min_qty'),
                ])
                ->orderBy('name->en')
                ->get(),
            'packages' => Package::where('is_active', true)->orderBy('price')->get(),
        ]);
    }
}
