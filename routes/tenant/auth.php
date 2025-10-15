<?php
// routes/tenant-user/auth.php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use Illuminate\Support\Facades\Route;

// Tenant user authentication - using SAME controllers as platform
Route::prefix('{slug}')->middleware('validate.tenant.slug')->group(function () {

  Route::middleware('guest')->group(function () {
    // Login
    Route::get('/login', [AuthenticatedSessionController::class, 'tenantLogin'])
      ->name('tenant-user.login');

    Route::post('/login', [AuthenticatedSessionController::class, 'tenantStore'])
      ->name('tenant-user.login.store');

  });

});
