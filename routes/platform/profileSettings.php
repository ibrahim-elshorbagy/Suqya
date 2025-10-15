<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Profile routes - accessible to all authenticated users (without slug)
Route::middleware(['auth', 'verified'])->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
  Route::post('/profile/image', [ProfileController::class, 'uploadProfileImage'])->name('profile.image.update');
});

// Profile GET route with slug for tenant users (only the page view)
Route::prefix('{slug}')->middleware(['validate.tenant.slug', 'auth', 'verified'])->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('tenant.profile.edit');
});
