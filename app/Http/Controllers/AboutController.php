<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\About;
use App\Models\Ceo;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AboutController extends Controller
{
    public function index() {
        $about = About::first();
        $users = User::whereNotIn('role', ['user', 'admin'])->get();
        $categories = Category::where('parent_id',null)->where('type','menu')->with('children')->get();
        $eventCategories = Category::where('parent_id',null)->where('type','event')->with('children')->get();
        return inertia('Client/About', [
            'about' => $about,
            'users' => $users,
            'categories' => $categories,
            'eventCategories' => $eventCategories
        ]);
    }

    public function create()
    {
        $about = About::first();
        return inertia('Admin/About/Create', ['abt' => $about]);
    }

    public function adminIndex()
    {
        $about = About::first();
        return inertia('Admin/About/Index', ['about' => $about]);
    }

    public function store(Request $request)
    {
        $about = About::firstOrNew();

        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_fr' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',

            // image required only if no record exists
            'image' => $about->exists
                ? 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
                : 'required|image|mimes:jpeg,png,jpg,gif|max:2048',

            'short_description_en' => 'required|string',
            'short_description_fr' => 'required|string',
            'short_description_ar' => 'required|string',

            'paragraph_1_en' => 'required|string',
            'paragraph_1_fr' => 'required|string',
            'paragraph_1_ar' => 'required|string',

            'title_2_en' => 'nullable|string|max:255',
            'title_2_fr' => 'nullable|string|max:255',
            'title_2_ar' => 'nullable|string|max:255',

            'paragraph_2_en' => 'nullable|string',
            'paragraph_2_fr' => 'nullable|string',
            'paragraph_2_ar' => 'nullable|string',

            // FIXED validation
            'picture_1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'picture_2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'picture_3' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'picture_4' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'picture_5' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // JSON Fields
        $about->title = json_encode([
            'en' => $request->title_en,
            'ar' => $request->title_ar,
            'fr' => $request->title_fr,
        ]);

        $about->short_description = json_encode([
            'en' => $request->short_description_en,
            'ar' => $request->short_description_ar,
            'fr' => $request->short_description_fr,
        ]);

        $about->paragraph_1 = json_encode([
            'en' => $request->paragraph_1_en,
            'ar' => $request->paragraph_1_ar,
            'fr' => $request->paragraph_1_fr,
        ]);

        $about->title_2 = json_encode([
            'en' => $request->title_2_en,
            'ar' => $request->title_2_ar,
            'fr' => $request->title_2_fr,
        ]);

        $about->paragraph_2 = json_encode([
            'en' => $request->paragraph_2_en,
            'ar' => $request->paragraph_2_ar,
            'fr' => $request->paragraph_2_fr,
        ]);

        // Main image (only replace if new uploaded)
        if ($request->hasFile('image')) {
            $about->image = $request->file('image')
                ->storePublicly('pictures/about');
        }

        // FIXED Pictures loop
        for ($i = 1; $i <= 5; $i++) {
            if ($request->hasFile("picture_$i")) {
                $about->{"picture_$i"} = $request
                    ->file("picture_$i")
                    ->storePublicly('pictures/about');
            }
        }

        $about->save();

        return redirect('/admin/about')
            ->with('success', 'About section saved successfully!');
    }



    public function createCeo()
    {
        $ceo = Ceo::first();
        return inertia('Admin/Ceo/Create', ['abt' => $ceo]);
    }

    public function storeCeo(Request $request)
    {

        //Log::info('The Store function called', ['request' => $request->all()]);
        
        // $validated = $request->validate([
        //     'title_en' => 'required|string|max:255',
        //     'title_fr' => 'required|string|max:255',
        //     'title_ar' => 'required|string|max:255',
        //     'name_en' => 'required|string|max:255',
        //     'name_fr' => 'required|string|max:255',
        //     'name_ar' => 'required|string|max:255',
        //     'paragraph_1_en' => 'required|string',
        //     'paragraph_1_fr' => 'required|string',
        //     'paragraph_1_ar' => 'required|string',
        //     'paragraph_2_en' => 'nullable|string',
        //     'paragraph_2_fr' => 'nullable|string',
        //     'paragraph_2_ar' => 'nullable|string',
        // ]);

        //Log::info('The Store function called', ['validated' => $validated]);

        $ceo = Ceo::firstOrNew();

        $ceo->title = json_encode([
            'en' => $request->input('title_en'),
            'ar' => $request->input('title_ar'),
            'fr' => $request->input('title_fr'),
        ]);

        $ceo->name = json_encode([
            'en' => $request->input('name_en'),
            'ar' => $request->input('name_ar'),
            'fr' => $request->input('name_fr'),
        ]);
    
        $ceo->paragraph_1 = json_encode([
            'en' => $request->input('paragraph_1_en'),
            'ar' => $request->input('paragraph_1_ar'),
            'fr' => $request->input('paragraph_1_fr'),
        ]);
    
        $ceo->paragraph_2 = json_encode([
            'en' => $request->input('paragraph_2_en'),
            'ar' => $request->input('paragraph_2_ar'),
            'fr' => $request->input('paragraph_2_fr'),
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->storePublicly('pictures/ceo');
            $ceo->image = $imagePath;
        }

        $ceo->save();

        return redirect()->route('admin.ceo.create')->with('success', 'Ceo information updated successfully!');
    }
}
