<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PreferencesController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', [HomeController::class, 'home'])->name('home');
Route::redirect('/', '/login')->name('home');

Route::get('/dashboard', function () {
  return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
  Route::post('/profile/image', [ProfileController::class, 'uploadProfileImage'])->name('profile.image.update');

  // Company update route - only for users with tenant role
  Route::patch('/company', [ProfileController::class, 'updateCompany'])
    ->middleware('role:tenant')
    ->name('company.update');
});
// User preferences routes
// Route::post('/locale', [PreferencesController::class, 'changeLocale'])->name('locale.change');

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';


