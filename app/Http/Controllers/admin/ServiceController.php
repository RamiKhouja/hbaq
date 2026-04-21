<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Category;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return inertia('Admin/Service/Index', [
            'services' => $services,
        ]);
    }

    public function create()
    {
        return inertia('Admin/Service/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
            'name_fr' => 'required|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'show_in_home' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
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

        $service = new Service();
        $service->name = $name;
        $service->description = $description;
        $service->show_in_home = $request->input('show_in_home');
        $service->url = strtolower(str_replace(' ', '-', trim($request->input('name_en'))));
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->storePublicly('pictures/services');
            $service->image = $imagePath;
        }
        
        $service->save();
        return redirect()->route('admin.services.index')->with('success', 'Service created successfully!');
    }

    public function show(Service $service)
    {
        $service = Service::find($service->id);
        return inertia('Admin/Service/Show', [
            'service' => $service
        ]);
    }

    public function edit(Service $service) {
        return inertia('Admin/Service/Edit', [
            'serv' => $service
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
            'name_fr' => 'required|string',
            'show_in_home' => 'nullable|boolean',
            'url' => 'required|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
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

        $imagePath= $service->image;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->storePublicly('pictures/services');
        }

        $service->name = $name;
        $service->url = $request->input('url');
        $service->description = $description;
        $service->show_in_home = $request->input('show_in_home');
        $service->image = $imagePath;
        $service->save();

        return redirect()->route('admin.services.index')->with('success', 'Service updated successfully!');
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return redirect()->route('admin.services.index')->with('success', 'Service deleted successfully!');
    }
}
