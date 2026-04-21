<?php

namespace App\Http\Controllers\Admin;

use App\Models\Contact;
use App\Models\Email;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Controller;

class ContactController extends Controller
{

    public function index()
    {
        // Get all the contacts from the database
        $contacts = Contact::all();

        // Return a view with the contacts data
        return inertia('Admin/Contact/index', [
            'contacts' => $contacts,
        ]);
    }

    public function show(Contact $contact)
    {
        // Return a view with the contact data
        return inertia('Admin/Contact/Show', [
            'contact' => $contact,
        ]);
    }

    public function destroy(Contact $contact)
    {
        // Delete the contact from the database
        $contact->delete();

        // Redirect to the contacts index page with a success message
        return redirect()->route('admin.contacts.index')->with('success', 'the message has been deleted successfully');
    }
    public function destroyAll() {
        $contacts = Contact::all();
        foreach ($contacts as $contact) {
            $contact->delete();
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'phone' => 'nullable|string',
            'email' => 'required|email',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Contact created successfully!',
            'data' => $contact,
        ], 201);
    }

    public function unread(): JsonResponse
    {
        $unreadContacts = Contact::where('is_read', false)->get();

        return response()->json([
            'success' => true,
            'data' => $unreadContacts,
        ]);
    }

    public function read(Request $request): JsonResponse
    {
        Contact::query()->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Contacts marked as read successfully.',
        ]);
    }
}
