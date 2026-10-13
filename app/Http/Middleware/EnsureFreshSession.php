<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureFreshSession
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $sessionVersion = $request->session()->get('auth_session_version');
        if ($user && $sessionVersion === null && Auth::guard()->viaRemember()) {
            // A valid remember token represents a fresh authentication.
            $request->session()->put('auth_session_version', $user->session_version);
        } elseif ($user && ($sessionVersion === null || (int) $sessionVersion !== (int) $user->session_version)) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('admin.login')->withErrors(['email' => 'Your session expired. Please sign in again.']);
        }

        return $next($request);
    }
}
