<?php
// routes/dashboard/admin.php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\Management\UserManagementController;
use App\Http\Controllers\Admin\SubscriptionSystem\PlansController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Site\SiteSettingsController;
use Illuminate\Support\Facades\Route;


// Return to admin (accessible to all authenticated users who were impersonated)
Route::middleware(['auth'])->group(function () {
  Route::post('/admin/return-to-admin', [AdminController::class, 'returnToAdmin'])->name('admin.return_to_admin');
});


// Admin routes - using Spatie permission with /admin prefix
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {

  // User Impersonation
  Route::post('/login-as/{user}', [AdminController::class, 'loginAs'])->name('login_as');

  // User Management
  Route::prefix('users')->name('users.')->group(function () {
    Route::get('/', [UserManagementController::class, 'index'])->name('index');
    Route::post('/', [UserManagementController::class, 'store'])->name('store');
    Route::put('/{user}', [UserManagementController::class, 'update'])->name('update');
    Route::delete('/{user}', [UserManagementController::class, 'destroy'])->name('destroy');

    // Tenant View
    Route::get('/tenant/{user}', [UserManagementController::class, 'viewTenant'])->name('view-tenant');

    // Bulk Actions
    Route::prefix('bulk')->name('bulk.')->group(function () {
      Route::patch('/block', [UserManagementController::class, 'bulkBlock'])->name('block');
      Route::patch('/unblock', [UserManagementController::class, 'bulkUnblock'])->name('unblock');
      Route::delete('/delete', [UserManagementController::class, 'bulkDelete'])->name('delete');
    });
  });
});
