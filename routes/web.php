<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CheckMaintenanceMode;
use App\Models\PageSetting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/maintenance', function () {
    $content = PageSetting::query()->where('key', 'homepage')->value('value');

    return response()->view('maintenance', ['maintenance' => $content['settings']['maintenance'] ?? []])
        ->header('Cache-Control', 'no-store, private')
        ->header('X-Robots-Tag', 'noindex');
})->name('maintenance');

Route::middleware(CheckMaintenanceMode::class)->group(function () {
    Route::get('/', function () {
        $setting = PageSetting::query()->where('key', 'homepage')->first();

        return view('welcome', [
            'savedContent' => $setting?->value ?? [],
        ]);
    });

    Route::get('/services', function () {
        $setting = PageSetting::query()->where('key', 'homepage')->first();

        return view('welcome', [
            'savedContent' => $setting?->value ?? [],
            'pageTitle' => 'Office Services | OLSHCO',
        ]);
    })->name('services');

    Route::get('/about', function () {
        $setting = PageSetting::query()->where('key', 'homepage')->first();

        return view('welcome', [
            'savedContent' => $setting?->value ?? [],
            'pageTitle' => 'About OLSHCO | Our Lady of the Sacred Heart College',
        ]);
    })->name('about');

    Route::get('/faculty-staff', function () {
        $setting = PageSetting::query()->where('key', 'homepage')->first();

        return view('welcome', [
            'savedContent' => $setting?->value ?? [],
            'pageTitle' => 'Faculty and Staff Directory | OLSHCO',
        ]);
    })->name('faculty-staff');

    Route::get('/services/{office}', function (string $office) {
        $setting = PageSetting::query()->where('key', 'homepage')->first();

        return view('welcome', [
            'savedContent' => $setting?->value ?? [],
            'pageTitle' => 'Office Services | OLSHCO',
        ]);
    })->name('services.office');

    Route::get('/homepage-content', [AdminController::class, 'publicContent'])->name('homepage.content');
    Route::post('/contact/messages', [ContactController::class, 'store'])
        ->middleware('throttle:contact-messages')
        ->name('contact.messages.store');
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminController::class, 'login'])->middleware('throttle:admin-login');
    Route::get('/forgot-password', [AdminController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [AdminController::class, 'sendResetLink'])->middleware('throttle:5,1')->name('password.email');
    Route::get('/reset-password/{token}', [AdminController::class, 'showResetPassword'])->name('password.reset');
    Route::post('/reset-password', [AdminController::class, 'resetPassword'])->middleware('throttle:5,1')->name('password.update');
    Route::get('/email/verify', fn () => view('admin.verify-email'))->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', function (Request $request): RedirectResponse {
        $user = User::query()->findOrFail($request->route('id'));
        abort_unless(hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification())), 403);
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return redirect()->route('admin.login')->with('status', 'Email verified. You can now sign in.');
    })->middleware(['signed', 'throttle:6,1'])->name('verification.verify');

    Route::middleware(['auth', 'fresh-session'])->group(function () {
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/users/edit', [AdminController::class, 'dashboard'])->middleware('admin')->name('users.edit');
        Route::get('/settings/edit', [AdminController::class, 'dashboard'])->middleware('admin')->name('settings.edit');
        Route::get('/{section}/edit', [AdminController::class, 'dashboard'])->name('section.edit');
        Route::put('/content', [AdminController::class, 'updateContent'])->name('content.update');
        Route::put('/settings/maintenance', [AdminController::class, 'updateMaintenance'])->middleware('admin')->name('settings.maintenance.update');
        Route::post('/uploads/program-image', [AdminController::class, 'uploadProgramImage'])->middleware('admin')->name('uploads.program-image');
        Route::post('/uploads/hymn-audio', [AdminController::class, 'uploadHymnAudio'])->middleware('admin')->name('uploads.hymn-audio');
        Route::get('/users', [UserController::class, 'index'])->middleware('admin')->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->middleware('admin')->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->middleware('admin')->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('admin')->name('users.destroy');
        Route::get('/audit-logs', [AuditLogController::class, 'index'])->middleware('admin')->name('audit-logs.index');
        Route::post('/logout', [AdminController::class, 'logout'])->name('logout');
    });
});
