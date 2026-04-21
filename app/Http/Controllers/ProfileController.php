<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function store(Request $request)
    {
        // Validate incoming request
        $validated = $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
            'address' => 'required|string|max:500',
        ]);

        $profile = Profile::where('email', $validated['email'])->first();

        if ($profile) {
            return response()->json([
                'message' => 'Profile already exists',
                'profile' => $profile
            ], 200);
        }

        // Create a new profile
        $profile = Profile::create($validated);

        // Return success response
        return response()->json([
            'message' => 'Profile created successfully',
            'profile' => $profile
        ], 201);
    }
}
