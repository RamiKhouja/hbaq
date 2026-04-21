<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\PriceOption;
use App\Models\Product;
use App\Models\CompanyGroup;
use Illuminate\Http\Request;

class PriceOptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Product $product)
    {
        $groups = CompanyGroup::all();
        return inertia('Admin/Price/Create', [
            'product' => $product,
            'groups' => $groups
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'price' => 'required',
            'unit' => 'required|string',
            'min_qty' => 'nullable|integer',
            'is_discount' => 'nullable|boolean',
            'discount_price' => 'nullable',
            'discount_start' => 'nullable',
            'discount_end' => 'nullable',
            'product_id' => 'required|exists:products,id',
            'group_id' => 'nullable',
            'more' => 'nullable'
        ]);

        $po = new PriceOption();
        $po->price = $request->input('price');
        $po->unit = $request->input('unit');
        $po->min_qty = $request->input('min_qty');
        if($request->has('is_discount')) {
            $po->is_discount = $request->input('is_discount');
            $po->discount_price = $request->input('discount_price');
            if($po->discount_price != null && $po->discount_price >0) {
                $po->discount = round((($po->price - $po->discount_price) / $po->price) * 100, 1);
                $po->discount_start = \Carbon\Carbon::createFromFormat('Y-m-d', $request->input('discount_start'));
                $po->discount_end = \Carbon\Carbon::createFromFormat('Y-m-d', $request->input('discount_end'));
            }
        }
        $po->product_id = $request->input('product_id');
        $po->group_id = $request->input('group_id');

        $po->save();
        if($request->input('more')) {
            return redirect()->route('admin.prices.create', ['product' => $request->input('product_id')])->with('success', 'Price added successfully!');
        } else {
            return redirect()->route('admin.inventories.create', ['product' => $request->input('product_id')])->with('success', 'Price added successfully!');
        }
    }

    public function addOther(Product $product)
    {
        $groups = CompanyGroup::all();
        return inertia('Admin/Price/Add', [
            'product' => $product,
            'groups' => $groups
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function add(Request $request)
    {
        $request->validate([
            'price' => 'required',
            'unit' => 'required|string',
            'min_qty' => 'nullable|integer',
            'is_discount' => 'nullable|boolean',
            'discount_price' => 'nullable',
            'discount_start' => 'nullable',
            'discount_end' => 'nullable',
            'product_id' => 'required|exists:products,id',
            'group_id' => 'nullable',
            'more' => 'nullable'
        ]);

        $po = new PriceOption();
        $po->price = $request->input('price');
        $po->unit = $request->input('unit');
        $po->min_qty = $request->input('min_qty');
        if($request->has('is_discount')) {
            $po->is_discount = $request->input('is_discount');
            $po->discount_price = $request->input('discount_price');
            if($po->discount_price != null && $po->discount_price >0) {
                $po->discount = round((($po->price - $po->discount_price) / $po->price) * 100, 1);
                $po->discount_start = \Carbon\Carbon::createFromFormat('Y-m-d', $request->input('discount_start'));
                $po->discount_end = \Carbon\Carbon::createFromFormat('Y-m-d', $request->input('discount_end'));
            }
        }
        $po->product_id = $request->input('product_id');
        $po->group_id = $request->input('group_id');

        $po->save();
        if($request->input('more')) {
            return redirect()->route('admin.prices.add.other', ['product' => $request->input('product_id')])->with('success', 'Price added successfully!');
        } else {
            return redirect()->route('admin.products.show', ['product' => $request->input('product_id')])->with('success', 'Price added successfully!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PriceOption $priceOption)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PriceOption $priceOption)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PriceOption $priceOption)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PriceOption $priceOption)
    {
        //
    }
}
