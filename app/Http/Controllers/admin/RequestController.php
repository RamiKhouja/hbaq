<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request as HttpRequest;
use App\Models\Request;
use App\Models\Service;

class RequestController extends Controller
{
    public function index()
    {
        $requests = Request::with('services')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return inertia('Admin/Request/Index', [
            'requests' => $requests
        ]);
    }

    public function edit($id)
    {
        $request = Request::with('services')->findOrFail($id);

        return inertia('Admin/Request/Edit', [
            'request' => $request
        ]);
    }

    public function update(HttpRequest $request, $id)
    {
        $validated = $request->validate([
            // 'first_name' => 'required|string|max:255',
            // 'last_name' => 'required|string|max:255',
            // 'email' => 'required|email|max:255',
            // 'phone' => 'required|string|max:15',
            // 'message' => 'nullable|string',
            'date' => 'nullable|date',
            'status' => 'nullable|string',
            //'services' => 'array|exists:services,id'
        ]);

        $existingRequest = Request::findOrFail($id);
        $existingRequest->update($validated);
       // $existingRequest->services()->sync($validated['services']);

        return redirect()->route('admin.requests.index')
            ->with('success', 'Request updated successfully.');
    }

    public function destroy($id)
    {
        $request = Request::findOrFail($id);
        $request->services()->detach();
        $request->delete();

        return redirect()->route('admin.requests.index')
            ->with('success', 'Request deleted successfully.');
    }
}
