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
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('categories', 'prices')->paginate(20);
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
            'unit' => 'string',
            'stock' => 'nullable|numeric|min:0|max:99999999.99',
            'is_featured' => 'nullable|boolean',
            'is_new' => 'nullable|boolean',
            'is_season' => 'nullable|boolean',
            'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'product_prices' => 'required|array|min:1',
            'product_prices.*.price' => 'required|numeric|min:0|max:99999999.99',
            'product_prices.*.min_qty' => 'nullable|integer|min:0',
            'product_prices.*.max_qty' => 'nullable|integer|min:1',
            'product_prices.*.discount_price' => 'nullable|numeric|min:0|max:99999999.99',
            'product_prices.*.discount_percentage' => 'nullable|numeric|between:0,100',
            'product_prices.*.start_date' => 'nullable|date',
            'product_prices.*.end_date' => 'nullable|date',
        ]);
        $this->validateProductPrices($request->input('product_prices', []));

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

        $product = new Product();
        $product->name = $name;
        $product->description = $description;
        $product->unit= $request->input('unit');
        $product->stock = $request->input('stock', 0);
        $product->is_new = $request->input('is_new');
        $product->is_featured = $request->input('is_featured');
        $product->is_season = $request->input('is_season');
        $product->url = strtolower(str_replace(' ', '-', trim($request->input('name_en'))));
        if ($request->hasFile('main_image')) {
            $imagePath = $request->file('main_image')->storePublicly('pictures/products');
            $product->main_image = $imagePath;
        }
        
        $product->save();
        $this->syncProductPrices($product, $request->input('product_prices', []));

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
        $product = Product::with('categories', 'pictures', 'prices')->find($product->id);
        return inertia('Admin/Product/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product = Product::with('categories', 'pictures', 'prices')->find($product->id);
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

            'unit' => 'string',
            'stock' => 'nullable|numeric|min:0|max:99999999.99',

            'is_featured' => 'nullable|boolean',
            'is_new' => 'nullable|boolean',
            'is_season' => 'nullable|boolean',

            'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'product_prices' => 'required|array|min:1',
            'product_prices.*.id' => 'nullable|integer|exists:product_prices,id',
            'product_prices.*.price' => 'required|numeric|min:0|max:99999999.99',
            'product_prices.*.min_qty' => 'nullable|integer|min:0',
            'product_prices.*.max_qty' => 'nullable|integer|min:1',
            'product_prices.*.discount_price' => 'nullable|numeric|min:0|max:99999999.99',
            'product_prices.*.discount_percentage' => 'nullable|numeric|between:0,100',
            'product_prices.*.start_date' => 'nullable|date',
            'product_prices.*.end_date' => 'nullable|date',

        ]);
        $this->validateProductPrices($request->input('product_prices', []));

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

        /* ---------- Basic Fields ---------- */
        $product->unit = $request->input('unit');
        $product->stock = $request->input('stock', 0);

        $product->is_featured = $request->input('is_featured');
        $product->is_new = $request->input('is_new');
        $product->is_season = $request->input('is_season');

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
        $this->syncProductPrices($product, $request->input('product_prices', []));

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

    private function syncProductPrices(Product $product, array $prices): void
    {
        $keptIds = [];

        foreach ($prices as $price) {
            $data = [
                'price' => $price['price'] ?? 0,
                'min_qty' => $price['min_qty'] ?? 0,
                'max_qty' => $price['max_qty'] ?? 1,
                'discount_price' => $price['discount_price'] ?? null,
                'discount_percentage' => $price['discount_percentage'] ?? null,
                'start_date' => $price['start_date'] ?? null,
                'end_date' => $price['end_date'] ?? null,
            ];

            if (!empty($price['id'])) {
                $productPrice = $product->prices()->where('id', $price['id'])->first();

                if ($productPrice) {
                    $productPrice->update($data);
                    $keptIds[] = $productPrice->id;
                }
            } else {
                $productPrice = $product->prices()->create($data);
                $keptIds[] = $productPrice->id;
            }
        }

        $product->prices()
            ->when(count($keptIds) > 0, fn ($query) => $query->whereNotIn('id', $keptIds))
            ->delete();
    }

    private function validateProductPrices(array $prices): void
    {
        $errors = [];

        foreach ($prices as $index => $price) {
            $fieldPrefix = "product_prices.$index";
            $basePrice = floatval($price['price'] ?? 0);
            $minQty = intval($price['min_qty'] ?? 0);
            $maxQty = intval($price['max_qty'] ?? 1);
            $discountPrice = isset($price['discount_price']) ? floatval($price['discount_price']) : 0;

            if ($maxQty < $minQty) {
                $errors["$fieldPrefix.max_qty"] = 'Max qty must be greater than or equal to min qty.';
            }

            if ($discountPrice > 0 && $basePrice <= 0) {
                $errors["$fieldPrefix.discount_price"] = 'Set a price before adding a discount.';
            }

            if ($discountPrice > 0 && $discountPrice >= $basePrice) {
                $errors["$fieldPrefix.discount_price"] = 'Discount price must be less than price.';
            }

            if (
                !empty($price['start_date']) &&
                !empty($price['end_date']) &&
                strtotime($price['end_date']) < strtotime($price['start_date'])
            ) {
                $errors["$fieldPrefix.end_date"] = 'End date must be after or equal to start date.';
            }
        }

        if (count($errors) > 0) {
            throw ValidationException::withMessages($errors);
        }
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
            $product->brand_id = intval($data[23]);
            $product->is_new = 0;
            $product->is_featured = 0;
            $product->is_season = 0;
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
