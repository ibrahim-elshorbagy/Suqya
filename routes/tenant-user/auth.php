<?php
// routes/tenant-user/auth.php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use Illuminate\Support\Facades\Route;

// Tenant user authentication - using SAME controllers as platform
Route::prefix('{slug}')->middleware('validate.tenant.slug')->group(function () {

  Route::middleware('guest:tenant_user')->group(function () {
    // Login
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])
        ->name('tenant-user.login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);

    // Forgot Password
    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('tenant-user.password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('tenant-user.password.email');

    // Reset Password
    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('tenant-user.password.reset');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->name('tenant-user.password.store');
  });

});
