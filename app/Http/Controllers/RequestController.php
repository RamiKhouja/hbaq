<?php

namespace App\Http\Controllers;

use App\Models\Request;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RequestController extends Controller
{
    // Get all requests
    public function index()
    {
        $requests = Request::with('services')->get();
        return response()->json($requests);
    }

    // Create a new request
    public function store(HttpRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:15',
            'message' => 'nullable|string',
            'date' => 'required|date',
            'total' => 'nullable',
            'status' => 'nullable|string',
            'payed' => 'nullable',
            'nb_persons'=>'nullable',
            'payment_method' => 'required|string',
            'services' => 'nullable|array',
            'services.*' => 'exists:services,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $newRequest = Request::create($validator->validated());

        // Attach services if provided
        if ($request->has('services')) {
            $newRequest->services()->attach($request->services);
        }

        return response()->json($newRequest->load('services'), 201);
    }

    // Get a specific request
    public function show($id)
    {
        $request = Request::with('services')->find($id);

        if (!$request) {
            return response()->json(['error' => 'Request not found'], 404);
        }

        return response()->json($request);
    }

    // Update a specific request
    public function update(HttpRequest $request, $id)
    {
        $existingRequest = Request::find($id);

        if (!$existingRequest) {
            return response()->json(['error' => 'Request not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email' . $id,
            'phone' => 'sometimes|required|string|max:15',
            'message' => 'nullable|string',
            'date' => 'sometimes|required|date',
            'total' => 'nullable',
            'status' => 'nullable|string',
            'payed' => 'nullable',
            'nb_persons' => 'nullable',
            'services' => 'nullable|array',
            'services.*' => 'exists:services,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $existingRequest->update($validator->validated());

        // Sync services if provided
        if ($request->has('services')) {
            $existingRequest->services()->sync($request->services);
        }

        return response()->json($existingRequest->load('services'));
    }

    // Delete a specific request
    public function destroy($id)
    {
        $request = Request::find($id);

        if (!$request) {
            return response()->json(['error' => 'Request not found'], 404);
        }

        $request->services()->detach(); // Detach related services
        $request->delete();

        return response()->json(['message' => 'Request deleted successfully']);
    }

    public function paymentUpdate(HttpRequest $request, $id) {
        
        $paymentRef = $request->query('payment_ref');
        
        if (!$paymentRef) {
            return response()->json(['error' => 'payment_ref is required'], 400);
        }
        
        $url = "https://api.konnect.network/api/v2/payments/{$paymentRef}";
        try {
            $response = Http::get($url);
            $data = $response->json();
            
            if (isset($data['payment']['transactions'][0])) {
                $status = $data['payment']['transactions'][0]['status'] ?? 'unknown';
                if($status== "success") {
                    $req = Request::find($id);
                    if (!$req) {
                        return response()->json(['error' => 'Request not found'], 404);
                    }
                    $req->status = 'payed';
                    $req->save();
                    return redirect()->route('request.details', [
                        'request' => $id,
                        'success' => 'true',
                    ])->with('success', 'Services request created successfully!');
                }
            }
            return response()->json(['error' => 'Invalid response structure'], 400);

        } catch (\Exception $e) {
            Log::error('Error calling Konnect API', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch payment details'], 500);
        }
    }

    public function requestDetails($id) {
        $request = Request::with('services')->find($id);
        return inertia('Client/RequestDetails',[
            'request'=>$request
        ]);
    }

    public function markAllAsRead()
    {
        $requests = Request::where('is_read', false )->get();
        foreach ($requests as $request) {
            $request->is_read = true;
            $request->save();
        }
        return response()->json(['message' => 'All requests marked as read']);
    }

    public function unread()
    {
        $unreadRequests = Request::where('is_read', false)->get();
        return response()->json([
            'success' => true,
            'data' => $unreadRequests,
        ]);
    }
}

