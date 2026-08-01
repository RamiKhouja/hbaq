<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PackageController extends Controller
{
    public function index()
    {
        return inertia('Admin/Package/Index', [
            'packages' => Package::latest()->paginate(30),
        ]);
    }

    public function create()
    {
        return inertia('Admin/Package/Create');
    }

    public function store(Request $request)
    {
        $validated = $this->validatePackage($request);
        $data = $this->packageData($request);
        $data['image'] = $request->file('image')->storePublicly('pictures/packages');
        Package::create($data);

        return redirect()->route('admin.packages.index')->with('success', 'Package created successfully!');
    }

    public function edit(Package $package)
    {
        return inertia('Admin/Package/Edit', ['package' => $package]);
    }

    public function update(Request $request, Package $package)
    {
        $this->validatePackage($request, $package);
        $data = $this->packageData($request);

        if ($request->hasFile('image')) {
            $oldImage = $package->image;
            $data['image'] = $request->file('image')->storePublicly('pictures/packages');
            if ($oldImage) {
                Storage::delete($oldImage);
            }
        }

        $package->update($data);

        return redirect()->route('admin.packages.index')->with('success', 'Package updated successfully!');
    }

    public function destroy(Package $package)
    {
        $image = $package->image;
        $package->delete();
        if ($image) {
            Storage::delete($image);
        }

        return redirect()->route('admin.packages.index')->with('success', 'Package deleted successfully!');
    }

    private function validatePackage(Request $request, ?Package $package = null): array
    {
        return $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'name_fr' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'price' => 'required|numeric|min:0|max:99999999.99',
            'is_active' => 'nullable|boolean',
            'image' => ($package ? 'nullable' : 'required').'|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);
    }

    private function packageData(Request $request): array
    {
        return [
            'name' => ['en' => $request->name_en, 'ar' => $request->name_ar, 'fr' => $request->name_fr],
            'description' => [
                'en' => $request->description_en,
                'ar' => $request->description_ar,
                'fr' => $request->description_fr,
            ],
            'price' => $request->price,
            'is_active' => $request->boolean('is_active'),
        ];
    }
}
