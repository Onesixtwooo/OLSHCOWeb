<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\PageSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class AdminController extends Controller
{
    public function showLogin(): View|RedirectResponse
    {
        return view('admin.auth', [
            'mode' => 'login',
            'noAdmins' => User::query()->doesntExist(),
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            AuditLog::record('auth.login_failed', metadata: ['email' => $credentials['email']]);

            return back()->withErrors(['email' => 'The email or password is incorrect.'])->onlyInput('email');
        }

        if (config('auth.require_email_verification') && ! Auth::user()->hasVerifiedEmail()) {
            Auth::user()->sendEmailVerificationNotification();
            Auth::logout();

            return redirect()->route('admin.verification.notice')->with('status', 'Please verify your email address before signing in. A new verification link was sent.');
        }

        $request->session()->regenerate();
        $request->session()->put('auth_session_version', Auth::user()->session_version);
        AuditLog::record('auth.login', Auth::user());

        return redirect()->intended(route('admin.dashboard'));
    }

    public function showForgotPassword(): View
    {
        return view('admin.forgot-password');
    }

    public function sendResetLink(Request $request): RedirectResponse
    {
        $validated = $request->validate(['email' => ['required', 'email', 'max:190']]);
        $status = Password::sendResetLink(['email' => $validated['email']]);

        return back()->with('status', __($status));
    }

    public function showResetPassword(string $token): View
    {
        return view('admin.reset-password', ['token' => $token, 'email' => request('email')]);
    }

    public function resetPassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:10', 'confirmed'],
        ]);

        $status = Password::reset($validated, function (User $user, string $password): void {
            $user->forceFill([
                'password' => $password,
                'email_verified_at' => $user->email_verified_at ?? now(),
                'remember_token' => Str::random(60),
                'session_version' => $user->session_version + 1,
            ])->save();
        });

        if ($status === Password::PASSWORD_RESET) {
            AuditLog::record('auth.password_reset', User::query()->where('email', $validated['email'])->first());
        }

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('admin.login')->with('status', __($status))
            : back()->withErrors(['email' => __($status)])->withInput($request->only('email'));
    }

    public function logout(Request $request): RedirectResponse
    {
        AuditLog::record('auth.logout', $request->user());
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
            'isAdmin' => auth()->user()?->isAdmin() ?? false,
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
        $content = $validated['content'];
        $setting = PageSetting::query()->firstOrCreate(['key' => 'homepage'], ['value' => []]);

        // Settings are managed by administrators through dedicated endpoints.
        if (! $request->user()->isAdmin()) {
            $savedContent = $setting->value ?? [];
            if (array_key_exists('settings', $savedContent)) {
                $content['settings'] = $savedContent['settings'];
            } else {
                unset($content['settings']);
            }
        }

        $setting->update(['value' => $content]);
        AuditLog::record('content.updated', metadata: ['section' => 'homepage']);

        return response()->json(['message' => 'Homepage changes saved.']);
    }

    public function updateMaintenance(Request $request): JsonResponse
    {
        $maintenance = $request->validate([
            'enabled' => ['required', 'boolean'],
            'title' => ['nullable', 'string', 'max:120'],
            'message' => ['nullable', 'string', 'max:1000'],
        ]);
        $maintenance['title'] = $maintenance['title'] ?? '';
        $maintenance['message'] = $maintenance['message'] ?? '';

        $setting = PageSetting::query()->firstOrCreate(['key' => 'homepage'], ['value' => []]);
        $content = $setting->value ?? [];
        $content['settings']['maintenance'] = $maintenance;
        $setting->update(['value' => $content]);
        AuditLog::record('settings.maintenance_updated', metadata: ['enabled' => $maintenance['enabled']]);

        return response()->json(['message' => 'Maintenance settings saved.', 'maintenance' => $maintenance]);
    }

    public function uploadProgramImage(Request $request): JsonResponse
    {
        $validated = $request->validate(['image' => ['required', 'file', 'max:8192']]);
        $image = $validated['image'];
        $mime = $image->getMimeType();
        $imageInfo = @getimagesize($image->getRealPath());
        $imageTypes = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
        if (! isset($imageTypes[$mime]) || $imageInfo === false || $imageInfo[0] > 6000 || $imageInfo[1] > 6000) {
            throw ValidationException::withMessages(['image' => 'Upload a valid JPG, PNG, or WebP image no larger than 6000 by 6000 pixels.']);
        }
        $path = $image->storeAs('program-images', Str::uuid().'.'.$imageTypes[$mime], 'public');
        AuditLog::record('upload.program_image', metadata: ['mime' => $mime, 'size' => $image->getSize()]);

        return response()->json(['url' => Storage::disk('public')->url($path)]);
    }

    public function uploadHymnAudio(Request $request): JsonResponse
    {
        $validated = $request->validate(['audio' => ['required', 'file', 'max:51200']]);
        $audio = $validated['audio'];
        $mime = $audio->getMimeType() ?: '';
        $audioTypes = [
            'audio/mpeg' => 'mp3', 'audio/wav' => 'wav', 'audio/x-wav' => 'wav',
            'audio/ogg' => 'ogg', 'audio/mp4' => 'm4a', 'audio/aac' => 'aac',
            'video/mp4' => 'mp4', 'video/webm' => 'webm', 'video/quicktime' => 'mov',
        ];
        if (! isset($audioTypes[$mime])) {
            throw ValidationException::withMessages(['audio' => 'Upload a supported audio or video file.']);
        }
        $path = $audio->storeAs('school-hymn', Str::uuid().'.'.$audioTypes[$mime], 'public');
        AuditLog::record('upload.hymn_media', metadata: ['mime' => $mime, 'size' => $audio->getSize()]);

        return response()->json(['url' => Storage::disk('public')->url($path), 'mime' => $mime, 'type' => str_starts_with($mime, 'video/') ? 'video' : 'audio']);
    }
}
