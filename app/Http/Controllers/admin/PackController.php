<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Pack;
use App\Models\PackCategory;
use App\Models\Picture;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PackController extends Controller
{
    public function index()
    {
        return inertia('Admin/Pack/Index', [
            'packs' => Pack::with('products', 'pictures', 'categories')->latest()->paginate(30),
        ]);
    }

    public function create()
    {
        return inertia('Admin/Pack/Create', [
            'products' => Product::orderBy('name->en')->get(['id', 'name', 'main_image', 'unit']),
            'categories' => PackCategory::orderBy('name->en')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePack($request);

        $pack = new Pack($this->packData($request));
        $pack->url = $this->uniqueUrl($request->input('url') ?: $request->input('name_en'));
        $pack->main_image = $request->file('main_image')->storePublicly('pictures/packs');
        $pack->save();

        $this->syncProducts($pack, $validated['products'] ?? []);
        $pack->categories()->sync($validated['categories'] ?? []);
        $this->storePictures($request, $pack);

        return redirect()->route('admin.packs.index')->with('success', 'Pack created successfully!');
    }

    public function edit(Pack $pack)
    {
        $pack->load('products', 'pictures', 'categories');

        return inertia('Admin/Pack/Edit', [
            'pack' => $pack,
            'products' => Product::orderBy('name->en')->get(['id', 'name', 'main_image', 'unit']),
            'categories' => PackCategory::orderBy('name->en')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Pack $pack)
    {
        $validated = $this->validatePack($request, $pack);

        $pack->fill($this->packData($request));
        $pack->url = $this->uniqueUrl($request->input('url') ?: $request->input('name_en'), $pack->id);

        if ($request->hasFile('main_image')) {
            $pack->main_image = $request->file('main_image')->storePublicly('pictures/packs');
        }

        $pack->save();
        $this->syncProducts($pack, $validated['products'] ?? []);
        $pack->categories()->sync($validated['categories'] ?? []);
        $this->syncPictures($request, $pack);

        return redirect()->route('admin.packs.index')->with('success', 'Pack updated successfully!');
    }

    public function destroy(Pack $pack)
    {
        $pack->delete();

        return redirect()->route('admin.packs.index')->with('success', 'Pack deleted successfully!');
    }

    private function validatePack(Request $request, ?Pack $pack = null): array
    {
        $validated = $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'name_fr' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'price' => 'required|numeric|min:0|max:99999999.99',
            'discount_price' => 'nullable|numeric|gt:0|lt:price|max:99999999.99',
            'discount_percentage' => 'nullable|numeric|gt:0|lt:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_new' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'stock' => 'required|integer|min:0',
            'weight' => 'required|numeric|min:0|max:99999999.99',
            'main_image' => ($pack ? 'nullable' : 'required') . '|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'products' => 'nullable|array',
            'products.*.product_id' => 'required_with:products|exists:products,id',
            'products.*.quantity' => 'nullable|integer|min:0',
            'products.*.weight' => 'nullable|numeric|min:0|max:99999999.99',
            'categories' => 'nullable|array',
            'categories.*' => 'integer|exists:pack_categories,id',
            'pictures' => 'nullable|array',
            'pictures.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'pictures_order' => 'nullable|array',
            'pictures_order.*' => 'nullable|integer|min:1',
            'existing_pictures' => 'nullable|array',
            'existing_pictures.*' => 'integer|exists:pictures,id',
            'existing_pictures_order' => 'nullable|array',
            'existing_pictures_order.*' => 'nullable|integer|min:1',
        ]);

        $this->validateDiscount($request);

        return $validated;
    }

    private function packData(Request $request): array
    {
        $discount = $this->discountData($request);

        return [
            'name' => [
                'en' => $request->input('name_en'),
                'ar' => $request->input('name_ar'),
                'fr' => $request->input('name_fr'),
            ],
            'description' => [
                'en' => $request->input('description_en'),
                'ar' => $request->input('description_ar'),
                'fr' => $request->input('description_fr'),
            ],
            'price' => $request->input('price'),
            'discount_price' => $discount['discount_price'],
            'discount_percentage' => $discount['discount_percentage'],
            'start_date' => $discount['discount_price'] ? $request->input('start_date') : null,
            'end_date' => $discount['discount_price'] ? $request->input('end_date') : null,
            'is_new' => $request->boolean('is_new'),
            'is_featured' => $request->boolean('is_featured'),
            'stock' => $request->input('stock', 0),
            'weight' => $request->input('weight'),
        ];
    }

    private function validateDiscount(Request $request): void
    {
        $price = (float) $request->input('price', 0);
        $hasDiscount = $request->filled('discount_price') || $request->filled('discount_percentage');

        if ($hasDiscount && $price <= 0) {
            throw ValidationException::withMessages([
                'discount_price' => 'Set a price greater than 0 before adding a discount.',
            ]);
        }
    }

    private function discountData(Request $request): array
    {
        $price = (float) $request->input('price', 0);
        $discountPrice = $request->filled('discount_price') ? (float) $request->input('discount_price') : null;
        $discountPercentage = $request->filled('discount_percentage') ? (float) $request->input('discount_percentage') : null;

        if ($price <= 0 || (!$discountPrice && !$discountPercentage)) {
            return [
                'discount_price' => null,
                'discount_percentage' => null,
            ];
        }

        if (!$discountPrice && $discountPercentage) {
            $discountPrice = $price - ($price * $discountPercentage / 100);
        }

        if (!$discountPercentage && $discountPrice) {
            $discountPercentage = (($price - $discountPrice) / $price) * 100;
        }

        return [
            'discount_price' => round($discountPrice, 2),
            'discount_percentage' => round($discountPercentage, 2),
        ];
    }

    private function syncProducts(Pack $pack, array $products): void
    {
        $syncData = [];

        foreach ($products as $product) {
            $productId = $product['product_id'] ?? null;

            if (!$productId) {
                continue;
            }

            $syncData[$productId] = [
                'quantity' => $product['quantity'] ?? null,
                'weight' => $product['weight'] ?? null,
            ];
        }

        $pack->products()->sync($syncData);
    }

    private function storePictures(Request $request, Pack $pack): void
    {
        if (!$request->hasFile('pictures')) {
            return;
        }

        foreach ($request->file('pictures') as $index => $file) {
            Picture::create([
                'pack_id' => $pack->id,
                'order' => $request->input("pictures_order.$index") ?? ($index + 1),
                'path' => $file->storePublicly('pictures/packs'),
            ]);
        }
    }

    private function syncPictures(Request $request, Pack $pack): void
    {
        Picture::where('pack_id', $pack->id)
            ->whereNotIn('id', $request->input('existing_pictures', []))
            ->delete();

        foreach ($request->input('existing_pictures_order', []) as $id => $order) {
            Picture::where('id', $id)
                ->where('pack_id', $pack->id)
                ->update(['order' => $order]);
        }

        $this->storePictures($request, $pack);
    }

    private function uniqueUrl(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base ?: Str::random(8);
        $url = $base;
        $counter = 2;

        while (Pack::where('url', $url)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists()) {
            $url = "{$base}-{$counter}";
            $counter++;
        }

        return $url;
    }
}
