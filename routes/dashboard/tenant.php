<?php
// routes/dashboard/tenant.php

use App\Http\Controllers\Dashboard\DashboardController;
use Illuminate\Support\Facades\Route;

// Tenant owner dashboard
Route::prefix('{slug}')->middleware(['validate.tenant.slug', 'auth', 'role:tenant', 'verify.tenant.ownership'])->group(function () {
  Route::get('/dashboard', [DashboardController::class, 'tenant'])->name('tenant.dashboard');
});
