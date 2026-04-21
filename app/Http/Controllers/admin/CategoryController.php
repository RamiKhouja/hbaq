<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::with('parent')->get();
        return inertia('Admin/Category/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $parentCats = Category::all();
        return inertia('Admin/Category/Create', [
            'parentCats' => $parentCats,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'nullable|string',
            'name_fr' => 'required|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'menu_show' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'parent_id' => 'nullable|exists:categories,id',
            'type' => 'nullable|string'
        ]);

        $name = array(
            'en' => $request->input('name_en'),
            'fr' => $request->input('name_fr'),
            'ar' => $request->input('name_ar')
        );
        $description = array(
            'en' => $request->input('description_en'),
            'ar' => $request->input('description_ar'),
            'fr' => $request->input('description_fr')
        );

        $category = new Category();
        $category->name = $name;
        $category->description = $description;
        $category->menu_show = $request->input('menu_show');
        $category->parent_id = $request->input('parent_id');
        $category->url = strtolower(str_replace(' ', '-', trim($request->input('name_en'))));
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->storePublicly('pictures/categories');
            $category->image = $imagePath;
        }
        $category->type= $request->input('type');
        $category->save();

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $parentCats = Category::where('id', '<>', $category->id)->get();
        return inertia('Admin/Category/Edit', [
            'cat' => $category,
            'parentCats' => $parentCats
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validateData = $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'nullable|string',
            'name_fr' => 'required|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'menu_show' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'parent_id' => 'nullable|exists:categories,id',
            'type' => 'nullable|string'
        ]);

        $name = array(
            'en' => $request->input('name_en'),
            'fr' => $request->input('name_fr'),
            'ar' => $request->input('name_ar')
        );
        $description = array(
            'en' => $request->input('description_en'),
            'ar' => $request->input('description_ar'),
            'fr' => $request->input('description_fr')
        );

        $category->name = $name;
        $category->description = $description;
        $category->menu_show = $request->input('menu_show');
        $category->parent_id = $request->input('parent_id');
        $category->url = strtolower(str_replace(' ', '-', trim($request->input('name_en'))));
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->storePublicly('pictures/categories');
            $category->image = $imagePath;
        }
        $category->type= $request->input('type');
        $category->save();

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('admin.categories.index');
    }
}
