<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inventories = Inventory::with('product')->paginate(30);
        return inertia('Admin/Inventory/Index', [
            'inventories' => $inventories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Product $product)
    {
        return inertia('Admin/Inventory/Create', [
            'product' => $product
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'in_stock' => 'required|boolean',
            'qty' => 'required|integer',
            'unit' => 'required|string',
            'qty_set' => 'nullable|integer',
            'min_qty' => 'nullable|integer',
            'product_id' => 'nullable|exists:products,id',
            'warehouse' => 'nullable|string',
            'more' => 'nullable'
        ]);

        $inventory = new Inventory();
        $inventory->in_stock = $request->input('in_stock');
        $inventory->qty = $request->input('qty');
        $inventory->unit = $request->input('unit');
        $inventory->qty_set = $request->input('qty_set');
        $inventory->min_qty = $request->input('min_qty');
        $inventory->product_id = $request->input('product_id');
        $inventory->warehouse = $request->input('warehouse');
        
        $inventory->save();
        if($request->input('more')) {
            return redirect()->route('admin.inventories.create', ['product' => $request->input('product_id')])->with('success', 'Stock added successfully!');
        } else {
            return redirect()->route('admin.products.show', ['product' => $request->input('product_id')])->with('success', 'Stock added successfully!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Inventory $inventory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $inventory=Inventory::with('product')->find($id);
        return inertia('Admin/Inventory/Edit', [
            'inv' => $inventory
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inventory $inventory)
    {
        $request->validate([
            'in_stock' => 'required|boolean',
            'qty' => 'required|integer',
            'unit' => 'required|string',
            'qty_set' => 'nullable|integer',
            'min_qty' => 'nullable|integer',
            'product_id' => 'nullable|exists:products,id',
            'warehouse' => 'nullable|string'
        ]);

        $inventory->update([
            'in_stock' => $request->input('in_stock'),
            'qty' => $request->input('qty'),
            'unit' => $request->input('unit'),
            'qty_set' => $request->input('qty_set'),
            'min_qty' => $request->input('min_qty'),
            'product_id' => $request->input('product_id'),
            'warehouse' => $request->input('warehouse')
        ]);

        return redirect()->route('admin.products.show', ['product' => $request->input('product_id')])->with('success', 'Stock updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inventory $inventory)
    {
        $inventory->delete();
        return redirect()->route('admin.inventories.index');
    }
}
