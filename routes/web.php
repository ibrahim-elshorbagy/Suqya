<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Site\OAuth\ProviderCallbackController;
use App\Http\Controllers\Site\OAuth\ProviderRedirectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Socialite Authentication Routes
Route::get('/auth/{provider}/redirect', ProviderRedirectController::class)->name('auth.redirect');
Route::get('/auth/{provider}/callback', ProviderCallbackController::class)->name('auth.callback');

// Home redirect
Route::redirect('/', '/login')->name('home');

// Profile routes - accessible to all authenticated users (admin, tenant, tenant users)
Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
  Route::post('/profile/image', [ProfileController::class, 'uploadProfileImage'])->name('profile.image.update');
});

// Load other route files
require __DIR__ . '/platform/auth.php';
require __DIR__ . '/admin/admin.php';
require __DIR__ . '/tenant-user/auth.php';
require __DIR__ . '/tenant-user/dashboard.php';
