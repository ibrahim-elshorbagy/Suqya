<?php
// routes/dashboard/admin.php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Site\SiteSettingsController;
use Illuminate\Support\Facades\Route;

// Admin Dashboard
Route::middleware(['auth', 'role:admin'])->group(function () {
  Route::get('/dashboard', [DashboardController::class, 'admin'])->name('dashboard');
});

// Admin routes - using Spatie permission with /admin prefix
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {

  // Test routes
  Route::get('/test/map', [AdminController::class, 'TestMap'])->name('test.map');

  // Site Settings
  Route::prefix('site-settings')->name('site-settings.')->group(function () {
    Route::get('/', [SiteSettingsController::class, 'index'])->name('index');
    Route::post('/', [SiteSettingsController::class, 'update'])->name('update');
  });

});
