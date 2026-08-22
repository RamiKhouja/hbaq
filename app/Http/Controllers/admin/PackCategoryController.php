<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\PackCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PackCategoryController extends Controller
{
    public function index()
    {
        return inertia('Admin/PackCategory/Index', [
            'categories' => PackCategory::with('parent')->orderBy('name->en')->get(),
        ]);
    }

    public function create()
    {
        return inertia('Admin/PackCategory/Create', [
            'parentCats' => PackCategory::orderBy('name->en')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateCategory($request);
        $category = new PackCategory($this->categoryData($request));
        $category->url = $this->uniqueUrl($request->input('name_en'));

        if ($request->hasFile('image')) {
            $category->image = $request->file('image')->storePublicly('pictures/pack-categories');
        }

        $category->save();

        return redirect()->route('admin.pack-categories.index')->with('success', 'Pack category created successfully!');
    }

    public function edit(PackCategory $packCategory)
    {
        return inertia('Admin/PackCategory/Edit', [
            'category' => $packCategory,
            'parentCats' => PackCategory::whereKeyNot($packCategory->id)->orderBy('name->en')->get(),
        ]);
    }

    public function update(Request $request, PackCategory $packCategory)
    {
        $this->validateCategory($request, $packCategory);
        $packCategory->fill($this->categoryData($request));
        $packCategory->url = $this->uniqueUrl($request->input('name_en'), $packCategory->id);

        if ($request->hasFile('image')) {
            $packCategory->image = $request->file('image')->storePublicly('pictures/pack-categories');
        }

        $packCategory->save();

        return redirect()->route('admin.pack-categories.index')->with('success', 'Pack category updated successfully!');
    }

    public function destroy(PackCategory $packCategory)
    {
        $packCategory->delete();

        return redirect()->route('admin.pack-categories.index')->with('success', 'Pack category deleted successfully!');
    }

    private function validateCategory(Request $request, ?PackCategory $category = null): array
    {
        return $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'name_fr' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'menu_show' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'parent_id' => ['nullable', Rule::exists('pack_categories', 'id'), Rule::notIn([$category?->id])],
            'type' => 'nullable|string|max:255',
        ]);
    }

    private function categoryData(Request $request): array
    {
        return [
            'name' => ['en' => $request->input('name_en'), 'fr' => $request->input('name_fr'), 'ar' => $request->input('name_ar')],
            'description' => ['en' => $request->input('description_en'), 'fr' => $request->input('description_fr'), 'ar' => $request->input('description_ar')],
            'menu_show' => $request->boolean('menu_show'),
            'parent_id' => $request->input('parent_id'),
            'type' => $request->input('type', 'menu'),
        ];
    }

    private function uniqueUrl(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value) ?: Str::random(8);
        $url = $base;
        $suffix = 2;

        while (PackCategory::where('url', $url)->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))->exists()) {
            $url = "{$base}-{$suffix}";
            $suffix++;
        }

        return $url;
    }
}
