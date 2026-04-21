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
            
            'email' => 'required|string',
            'message' => ['required'],
        ]);
        $contact = new Contact;
        $contact->email = $request->input('email');
        $contact->subject = $request->input('subject');
        $contact->message = $request->input('message');
        $contact->save();

        $details = [
            'email' => 'khoujarami2@gmail.com',
            'subject' => $request->input('subject'),
            'message' => $request->input('message'),
            'from' => $request->input('email')
        ];

        Mail::to($details['email'])->send(new ContactMail($details));

        return redirect()->route('contact.create')->with('success', 'sent-success');
        
    }
}
