<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductCategory;
use App\Models\Inventory;
use App\Models\PriceOption;
use App\Models\Picture;
use App\Models\Attribute;
use App\Models\AttOption;
use App\Models\ProductOption;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('categories')->paginate(30);
        return inertia('Admin/Product/Index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //$attributes = Attribute::with('options')->get();
        $categories = Category::all();
        return inertia('Admin/Product/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
            'name_fr' => 'required|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'price' => 'required',
            'weight' => 'nullable',
            'unit' => 'string',
            'is_featured' => 'nullable|boolean',
            'is_null' => 'nullable|boolean',
            'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_discount' => 'nullable',
            'discount_price' => 'nullable',
            'discount_percentage' => 'nullable',
            'discount_start' => 'nullable',
            'discount_end' => 'nullable',
            'ingredients_en' => 'nullable',
            'ingredients_ar' => 'nullable',
            'ingredients_fr' => 'nullable',
            'instructions_en' => 'nullable',
            'instructions_ar' => 'nullable',
            'instructions_fr' => 'nullable',
        ]);

        $name = array(
            'en' => $request->input('name_en'),
            'ar' => $request->input('name_ar'),
            'fr' => $request->input('name_fr')
        );
        $description = array(
            'en' => $request->input('description_en'),
            'ar' => $request->input('description_ar'),
            'fr' => $request->input('description_fr')
        );

        $ingredients = array(
            'en' => $request->input('ingredients_en'),
            'ar' => $request->input('ingredients_ar'),
            'fr' => $request->input('ingredients_fr')
        );

        $instructions = array(
            'en' => $request->input('instructions_en'),
            'ar' => $request->input('instructions_ar'),
            'fr' => $request->input('instructions_fr')
        );

        $product = new Product();
        $product->name = $name;
        $product->description = $description;
        $product->instructions = $instructions;
        $product->ingredients = $ingredients;
        $product->price= $request->input('price');
        $product->unit= $request->input('unit');
        $product->weight= $request->input('weight');
        $product->is_discount = $request->input('is_discount');
        $product->discount_price = $request->input('discount_price');
        $product->discount_percentage = $request->input('discount_percentage');
        if($product->discount_price != null && $product->discount_price >0) {
            $product->discount_start = \Carbon\Carbon::createFromFormat('Y-m-d', $request->input('discount_start'));
            $product->discount_end = \Carbon\Carbon::createFromFormat('Y-m-d', $request->input('discount_end'));
            $product->price_after_discount = round(($request->input('price') - $request->input('discount_price')),2);
        }
        $product->is_new = $request->input('is_new');
        $product->is_featured = $request->input('is_featured');
        $product->url = strtolower(str_replace(' ', '-', trim($request->input('name_en'))));
        if ($request->hasFile('main_image')) {
            $imagePath = $request->file('main_image')->storePublicly('pictures/products');
            $product->main_image = $imagePath;
        }
        
        $product->save();

        $categories = $request->input('categories');
        foreach ($categories as $category) {
            $cat = Category::findOrFail(intval($category));
            ProductCategory::create([
                'product_id' => $product->id,
                'category_id' => $cat->id
            ]);
        }

        if ($request->hasFile('pictures')) {
            foreach ($request->file('pictures') as $index => $file) {
                $imagePath = $file->storePublicly('pictures/products');

                Picture::create([
                    'product_id' => $product->id,
                    'order' => $request->input("pictures_order.$index"),
                    'path' => $imagePath,
                ]);
            }
        }

        //return redirect()->route('admin.prices.create', ['product' => $product->id]);
        return redirect()->route('admin.products.index')->with('success', 'Product created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product = Product::with('categories')->with('pictures')->find($product->id);
        // $prices = $product->prices;
        return inertia('Admin/Product/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product = Product::with('categories')->with('pictures')->find($product->id);
        $categories = Category::all();
        return inertia('Admin/Product/Edit', [
            'prod' => $product,
            'categories' => $categories,
            'prodCats' => $product->categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
            'name_fr' => 'required|string',

            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_fr' => 'nullable|string',

            'price' => 'required',
            'weight' => 'nullable',
            'unit' => 'string',

            'is_featured' => 'nullable|boolean',
            'is_new' => 'nullable|boolean',

            'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',

            'is_discount' => 'nullable',
            'discount_price' => 'nullable',
            'discount_percentage' => 'nullable',
            'discount_start' => 'nullable',
            'discount_end' => 'nullable',

            'ingredients_en' => 'nullable',
            'ingredients_ar' => 'nullable',
            'ingredients_fr' => 'nullable',

            'instructions_en' => 'nullable',
            'instructions_ar' => 'nullable',
            'instructions_fr' => 'nullable',
        ]);

        /* ---------- Translations ---------- */
        $product->name = [
            'en' => $request->input('name_en'),
            'ar' => $request->input('name_ar'),
            'fr' => $request->input('name_fr'),
        ];

        $product->description = [
            'en' => $request->input('description_en'),
            'ar' => $request->input('description_ar'),
            'fr' => $request->input('description_fr'),
        ];

        $product->ingredients = [
            'en' => $request->input('ingredients_en'),
            'ar' => $request->input('ingredients_ar'),
            'fr' => $request->input('ingredients_fr'),
        ];

        $product->instructions = [
            'en' => $request->input('instructions_en'),
            'ar' => $request->input('instructions_ar'),
            'fr' => $request->input('instructions_fr'),
        ];

        /* ---------- Basic Fields ---------- */
        $product->price = $request->input('price');
        $product->unit = $request->input('unit');
        $product->weight = $request->input('weight');

        $product->is_featured = $request->input('is_featured');
        $product->is_new = $request->input('is_new');

        /* ---------- Discount Logic ---------- */
        $product->is_discount = $request->input('is_discount');
        $product->discount_price = $request->input('discount_price');
        $product->discount_percentage = $request->input('discount_percentage');

        if (
            $request->filled('discount_price') &&
            $request->input('discount_price') > 0
        ) {
            if($request->input('discount_start') && $request->input('discount_start')!="null") {
                $product->discount_start = \Carbon\Carbon::createFromFormat(
                    'Y-m-d',
                    $request->input('discount_start')
                );
            }

            if($request->input('discount_end') && $request->input('discount_end')!="null") {
                $product->discount_end = \Carbon\Carbon::createFromFormat(
                    'Y-m-d',
                    $request->input('discount_end')
            );
            }

            $product->price_after_discount = round(
                $request->input('price') - $request->input('discount_price'),
                2
            );
        } else {
            // Reset discount if unchecked
            $product->discount_start = null;
            $product->discount_end = null;
            $product->price_after_discount = null;
        }

        /* ---------- URL ---------- */
        $product->url = strtolower(
            str_replace(' ', '-', trim($request->input('name_en')))
        );

        /* ---------- Main Image ---------- */
        if ($request->hasFile('main_image')) {
            $imagePath = $request->file('main_image')
                ->storePublicly('pictures/products');
            $product->main_image = $imagePath;
        }

        $product->save();

        /* ---------- Categories ---------- */
        $product->categories()->sync(
            $request->input('categories', [])
        );

        Picture::where('product_id', $product->id)
            ->whereNotIn('id', $request->input('existing_pictures', []))
            ->delete();

        foreach ($request->input('existing_pictures_order', []) as $id => $order) {
            Picture::where('id', $id)
                ->where('product_id', $product->id)
                ->update(['order' => $order]);
        }

        if ($request->hasFile('pictures')) {
            foreach ($request->file('pictures') as $index => $file) {
                $imagePath = $file->storePublicly('pictures/products');
                Picture::create([
                    'product_id' => $product->id,
                    'order' => $request->input("pictures_order.$index") ?? ($index + 1),
                    'path' => $imagePath,
                ]);
            }
        }

        // if ($request->hasFile('pictures')) {
        //     foreach ($request->file('pictures') as $index => $file) {
        //         $imagePath = $file->storePublicly('pictures/products');
        //         Picture::create([
        //             'product_id' => $product->id,
        //             'order' => $request->input("pictures_order.$index") ?? ($index + 1),
        //             'path' => $imagePath,
        //         ]);
        //     }
        // }

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index');
    }

    public function importOptions(Request $request) {

        $request->validate([
            'prod_file' => 'required'
        ]);
        $file = $request->file('prod_file');
        $fileContents = file($file->getPathname());
        //dd($fileContents);
        foreach ($fileContents as $line) {
            $data = str_getcsv($line);
            $option = array(
                'en' => $data[1],
                'ar' => $data[0]
            );
            $attoption = new AttOption();
            $attoption->value = $option;
            $attoption->attribute_id = 1;
            $attoption->save();
        }
    }

    public function updateUrls(Request $request) {
        $products = Product::where('url', 'like', '%?%')->orWhere('url', 'like', '%&%')->get();
        foreach ($products as $product) {
            $updatedUrl = str_replace(['?', '&'], '-', $product->url);
            $product->update(['url' => $updatedUrl]);
        }
    }

    public function import(Request $request) {

        $request->validate([
            'prod_file' => 'required'
        ]);
        $file = $request->file('prod_file');
        $fileContents = file($file->getPathname());
        //dd($fileContents);
        foreach ($fileContents as $line) {
            $data = str_getcsv($line);
            $url = strtolower(str_replace(' ', '-', trim($data[3])));
            $name = array(
                'en' => $data[3],
                'ar' => $data[2]
            );
            
            $description = array(
                'en' => $data[10],
                'ar' => $data[10]
            );
            //dd($data[23]);
            $images = explode(",", $data[6]);
            $categories = explode(",", $data[5]);
            //dd($images);
            $product = new Product();
            $product->name = $name;
            $product->sku = $data[13];
            $product->url = $url;
            $product->description = $description;
            $product->weight = intval($data[20]);
            $product->brand_id = intval($data[23]);
            $product->is_new = 0;
            $product->is_featured = 0;
            $product->main_image = $images[0];

            $product->save();

            if (count($images) > 1) {
                // Loop through the elements starting from index 1
                for ($i = 1; $i < count($images); $i++) {
                    Picture::create([
                        'product_id' => $product->id,
                        'order' => $i,
                        'path' => $images[$i]
                    ]);
                }
            }

            foreach ($categories as $category) {
                $cat = Category::findOrFail(intval($category));
                ProductCategory::create([
                    'product_id' => $product->id,
                    'category_id' => $cat->id
                ]);
            }

            $po = new PriceOption();
            $po->price = floatval($data[8]);
            $po->unit = 'item';
            $po->currency = 'SR';
            $po->min_qty = 1;
            if($data[15]!= "") {
                $po->is_discount = 1;
                $po->discount_price = floatval($data[15]);
                if($po->discount_price != null && $po->discount_price >0) {
                    $po->discount = round((($po->price - $po->discount_price) / $po->price) * 100, 1);
                }
            }
            $po->product_id = $product->id;
            $po->group_id = 1;

            $po->save();

            $inventory = new Inventory();
            $inventory->in_stock = $data[22]=="yes" ? 1 : 0;
            $inventory->qty = intval($data[9]);
            $inventory->unit = "item";
            $inventory->product_id = $product->id;
            
            $inventory->save();

            if($data[38] != "") {
                $opt = AttOption::findOrFail(intval($data[38]));
                ProductOption::create([
                    'product_id' => $product->id,
                    'option_id' => $opt->id,
                    'attribute_id' => 1
                ]);
            }
            
        }
    }
}
