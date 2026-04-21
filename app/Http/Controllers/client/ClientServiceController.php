<?php

namespace App\Http\Controllers\client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class ClientServiceController extends Controller
{
    public function list()
    {
        $categories = Category::where('parent_id',null)->where('type','menu')->with('children')->get();
        $eventCategories = Category::where('parent_id',null)->where('type','event')->with('children')->get();
        $services = Service::all();
        return inertia('Client/Services', [
            'categories' => $categories,
            'services' => $services,
            'eventCategories' => $eventCategories
        ]);
    }

    public function jsonIndex(): JsonResponse
    {
        $services = Service::all();
        return response()->json($services);
    }

    public function show($url)
    {
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $service = Service::where('url', $url)->first();
        if (!$service) {
            abort(404, 'Service not found');
        }
        $categories = Category::where('parent_id',null)->where('type','menu')->with('children')->get();
        $eventCategories = Category::where('parent_id',null)->where('type','event')->with('children')->get();

        return inertia('Client/ServiceDetails', [
            'categories' => $categories,
            'service' => $service,
            'eventCategories' => $eventCategories
        ]);
    }
}
