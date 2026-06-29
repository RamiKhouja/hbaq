<?php

namespace App\Http\Controllers\client;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Pack;

class PackController extends Controller
{
    public function index()
    {
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return inertia('Client/Packs', [
            'categories' => Category::where('parent_id', null)->where('type', 'menu')->with('children')->get(),
            'eventCategories' => Category::where('parent_id', null)->where('type', 'event')->with('children')->get(),
            'packs' => Pack::with('products', 'pictures')->latest()->paginate(12),
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
}
