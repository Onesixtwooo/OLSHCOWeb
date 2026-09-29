<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Bots commonly fill hidden honeypot fields; do not process those requests.
        if ($request->filled('website')) {
            return response()->json(['message' => 'Unable to send your message.'], 422);
        }

        $request->validate([
            'firstName' => ['required', 'string', 'max:80'],
            'lastName' => ['required', 'string', 'max:80'],
            'email' => ['required', 'email', 'max:190'],
            'subject' => ['required', 'string', 'in:Enrollment Inquiry,Academic Programs,Campus Visit,General Question'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        return response()->json(['message' => 'Thank you for your message! We will get back to you soon.'], 202);
    }
}
