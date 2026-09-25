<?php

namespace App\Http\Controllers;

use App\Models\PageSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;

class AdminController extends Controller
{
    public function showLogin(): View|RedirectResponse
    {
        if (User::query()->doesntExist()) {
            return redirect()->route('admin.setup');
        }

        return view('admin.auth', ['mode' => 'login']);
    }

    public function showSetup(): View|RedirectResponse
    {
        if (User::query()->exists()) {
            return redirect()->route('admin.login');
        }

        return view('admin.auth', ['mode' => 'setup']);
    }

    public function setup(Request $request): RedirectResponse
    {
        abort_if(User::query()->exists(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'password' => ['required', 'string', 'min:10', 'confirmed'],
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('admin.dashboard');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors(['email' => 'The email or password is incorrect.'])->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }

    public function dashboard(): View
    {
        $setting = PageSetting::query()->where('key', 'homepage')->first();

        return view('admin.dashboard', [
            'savedContent' => $setting?->value ?? [],
        ]);
    }

    public function publicContent(): JsonResponse
    {
        $setting = PageSetting::query()->where('key', 'homepage')->first();

        return response()->json($setting?->value ?? []);
    }

    public function updateContent(Request $request): JsonResponse
    {
        $validated = $request->validate(['content' => ['required', 'array']]);

        PageSetting::query()->updateOrCreate(
            ['key' => 'homepage'],
            ['value' => $validated['content']],
        );

        return response()->json(['message' => 'Homepage changes saved.']);
    }

    public function uploadProgramImage(Request $request): JsonResponse
    {
        $validated = $request->validate(['image' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192']]);
        $path = $validated['image']->store('program-images', 'public');
        return response()->json(['url' => Storage::disk('public')->url($path)]);
    }

    public function uploadHymnAudio(Request $request): JsonResponse
    {
        $validated = $request->validate(['audio' => ['required', 'file', 'mimes:mp3,wav,ogg,m4a,aac,mp4,webm,mov', 'max:51200']]);
        $path = $validated['audio']->store('school-hymn', 'public');
        $mime = $validated['audio']->getMimeType() ?: '';
        return response()->json(['url' => Storage::disk('public')->url($path), 'mime' => $mime, 'type' => str_starts_with($mime, 'video/') ? 'video' : 'audio']);
    }
}
