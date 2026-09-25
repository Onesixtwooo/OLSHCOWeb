<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
    $setting = \App\Models\PageSetting::query()->where('key', 'homepage')->first();

    return view('welcome', [
        'savedContent' => $setting?->value ?? [],
    ]);
});

Route::get('/services', function () {
    $setting = \App\Models\PageSetting::query()->where('key', 'homepage')->first();

    return view('welcome', [
        'savedContent' => $setting?->value ?? [],
        'pageTitle' => 'Office Services | OLSHCO',
    ]);
})->name('services');

Route::get('/about', function () {
    $setting = \App\Models\PageSetting::query()->where('key', 'homepage')->first();

    return view('welcome', [
        'savedContent' => $setting?->value ?? [],
        'pageTitle' => 'About OLSHCO | Our Lady of the Sacred Heart College',
    ]);
})->name('about');

Route::get('/faculty-staff', function () {
    $setting = \App\Models\PageSetting::query()->where('key', 'homepage')->first();

    return view('welcome', [
        'savedContent' => $setting?->value ?? [],
        'pageTitle' => 'Faculty and Staff Directory | OLSHCO',
    ]);
})->name('faculty-staff');

Route::get('/services/{office}', function (string $office) {
    $setting = \App\Models\PageSetting::query()->where('key', 'homepage')->first();

    return view('welcome', [
        'savedContent' => $setting?->value ?? [],
        'pageTitle' => 'Office Services | OLSHCO',
    ]);
})->name('services.office');

Route::get('/homepage-content', [AdminController::class, 'publicContent'])->name('homepage.content');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/setup', [AdminController::class, 'showSetup'])->name('setup');
    Route::post('/setup', [AdminController::class, 'setup'])->middleware('throttle:5,1');
    Route::get('/login', [AdminController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth')->group(function () {
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/{section}/edit', [AdminController::class, 'dashboard'])->name('section.edit');
        Route::put('/content', [AdminController::class, 'updateContent'])->name('content.update');
        Route::post('/uploads/program-image', [AdminController::class, 'uploadProgramImage'])->name('uploads.program-image');
        Route::post('/uploads/hymn-audio', [AdminController::class, 'uploadHymnAudio'])->name('uploads.hymn-audio');
        Route::post('/logout', [AdminController::class, 'logout'])->name('logout');
    });
});
