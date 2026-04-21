<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::paginate(30);

        return inertia('Admin/Brand/Index', [
            'brands' => $brands,
        ]);
    }

    public function create()
    {
        return inertia('Admin/Brand/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->storePublicly('pictures/brands');
        }
        $url = strtolower(str_replace(' ', '-', trim($request->input('name'))));
        // Create the brand
        $brand = Brand::create([
            'name' => $request->input('name'),
            'logo' => $logoPath,
            'url' => $url,
        ]);

        return redirect()->route('admin.brands.index')->with('success', 'Brand created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand)
    {
        return inertia('Admin/Brand/Edit', [
            'brand' => $brand,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand)
    {
        $request->validate([
            'name' => 'required|string',
            'url' => 'required|string',
            //'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Adjust file types and size as needed
        ]);
        
        
        $logoPath= $brand->logo;

        if ($request->file('logo')!==null) {
            $logoPath = $request->file('logo')->storePublicly('pictures/brands');
        }
        
        // update the brand
        $brand->update([
            'name' => $request->input('name'),
            'logo' => $logoPath,
            'url' => $request->input('url')
        ]);

        return redirect()->route('admin.brands.index')->with('success', 'Brand updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        $brand->delete();
        return redirect()->route('admin.brands.index')->with('success', 'Brand deleted successfully!');
    }

    public function import(Request $request) {

        $request->validate([
            'brand_file' => 'required'
        ]);
        $file = $request->file('brand_file');
        $fileContents = file($file->getPathname());
        foreach ($fileContents as $line) {
            $data = str_getcsv($line);
            $url = strtolower(str_replace(' ', '-', trim($data[0])));
            Brand::create([
                'name' => $data[0],
                'logo' => $data[1],
                'url' => $url,
            ]);
        }
        //dd($fileContents);
    }
}
