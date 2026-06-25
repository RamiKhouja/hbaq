<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductPrice;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductPriceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productPrices = ProductPrice::with('product')->latest()->paginate(30);

        return inertia('Admin/ProductPrice/Index', [
            'productPrices' => $productPrices,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Admin/ProductPrice/Create', [
            'products' => Product::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['nullable', Rule::exists('products', 'id')],
            'min_qty' => ['required', 'numeric', 'min:0'],
            'max_qty' => ['required', 'numeric', 'gte:min_qty'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['required', 'numeric', 'min:0', 'lte:price'],
            'discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        $validated['is_discounted'] = $request->has('is_discounted');

        $productPrice = ProductPrice::create([
            'product_id' => $validated['product_id'] ?? null,
            'min_qty' => $validated['min_qty'],
            'max_qty' => $validated['max_qty'],
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'],
            'discount_percentage' => $validated['discount_percentage'] ?? 0,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        ]);

        return response()->json([
            'message' => 'Product price created successfully',
            'product_price' => $productPrice->load('product'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductPrice $productPrice)
    {
        $productPrice->load('product');

        if (request()->wantsJson()) {
            return response()->json($productPrice);
        }

        return inertia('Admin/ProductPrice/Show', [
            'productPrice' => $productPrice,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductPrice $productPrice)
    {
        return inertia('Admin/ProductPrice/Edit', [
            'productPrice' => $productPrice,
            'products' => Product::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductPrice $productPrice)
    {
        $productPrice->update($this->validatedData($request));

        if ($request->wantsJson()) {
            return response()->json($productPrice->load('product'));
        }

        return redirect()
            ->route('admin.product-prices.index')
            ->with('success', 'Product price updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, ProductPrice $productPrice)
    {
        $productPrice->delete();

        if ($request->wantsJson()) {
            return response()->noContent();
        }

        return redirect()
            ->route('admin.product-prices.index')
            ->with('success', 'Product price deleted successfully!');
    }

    private function validatedData(Request $request): array
    {
        $data = $request->validate([
            'product_id' => ['required', Rule::exists('products', 'id')],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'min_qty' => ['nullable', 'integer', 'min:0'],
            'max_qty' => ['nullable', 'integer', 'min:1', 'gte:min_qty'],
            'discount_price' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'discount_percentage' => ['nullable', 'numeric', 'between:0,100'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $request->validate([
                'end_date' => ['after_or_equal:start_date'],
            ]);
        }

        if ($request->filled('discount_price') && floatval($request->input('price')) <= 0) {
            $request->validate([
                'discount_price' => ['prohibited'],
            ]);
        }

        if (
            $request->filled('discount_price') &&
            floatval($request->input('discount_price')) >= floatval($request->input('price'))
        ) {
            $request->validate([
                'discount_price' => ['lt:price'],
            ]);
        }

        $data['min_qty'] = $data['min_qty'] ?? 0;
        $data['max_qty'] = $data['max_qty'] ?? 1;

        return $data;
    }
}
