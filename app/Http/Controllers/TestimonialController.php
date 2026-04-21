<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TestimonialController extends Controller
{
    /**
     * Display a listing of the testimonials.
     */
    public function index()
    {
        $testimonials = Testimonial::paginate(30);
        return inertia('Admin/Testimonials/Index', [
            'feedbacks' => $testimonials,
        ]);
    }

    /**
     * Store a newly created testimonial in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'phone' => 'nullable|string',
            'message' => 'required|string',
        ]);

        $picturePath = null;
        if ($request->hasFile('picture')) {
            $picturePath = $request->file('picture')->storePublicly('pictures/testimonials');
        }

        $testimonial = Testimonial::create([
            'name' => $validatedData['name'],
            'picture' => $picturePath,
            'phone' => $validatedData['phone'],
            'message' => $validatedData['message'],
            'is_approved' => false, // Default to false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Testimonial created successfully!',
            'testimonial' => $testimonial,
        ]);
    }

    /**
     * Remove the specified testimonial from storage.
     */
    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return redirect()->route('admin.testimonials.index')->with('success', 'Testimonial deleted successfully!');
    }

    /**
     * Toggle the approval status of a testimonial.
     */
    public function toggleApproval(Testimonial $testimonial)
    {
        $testimonial->is_approved = !$testimonial->is_approved;
        $testimonial->save();

        return redirect()->route('admin.testimonials.index')->with(
            'success',
            'Testimonial approval status updated successfully!'
        );
    }
}
