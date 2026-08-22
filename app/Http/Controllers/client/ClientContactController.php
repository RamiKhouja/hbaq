<?php

namespace App\Http\Controllers\client;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Models\Contact;
use App\Mail\ContactMail;


class ClientContactController extends Controller
{
    //
    public function create() {
        return inertia('Client/Contact/create');
    }

    public function store(Request $request)  {
        $request->validate([
            'name' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'required|email',
            'subject' => 'nullable|string',
            'message' => ['required'],
        ]);
        $contact = new Contact;
        $contact->name = $request->input('name', 'Website visitor');
        $contact->phone = $request->input('phone');
        $contact->email = $request->input('email');
        $contact->subject = $request->input('subject', 'New contact message');
        $contact->message = $request->input('message');
        $contact->save();

        $details = [
            'name' => $request->input('name', 'Website visitor'),
            'phone' => $request->input('phone'),
            'email' => config('mail.from.address'),
            'subject' => $request->input('subject', 'New contact message'),
            'message' => $request->input('message'),
            'from' => $request->input('email')
        ];

        Mail::to($details['email'])->send(new ContactMail($details));

        return redirect()->route('contact.create')->with('success', 'sent-success');
        
    }
}
