<?php
// routes/dashboard/tenant-users.php

use App\Http\Controllers\Dashboard\DashboardController;
use Illuminate\Support\Facades\Route;

// Tenant owner dashboard
Route::prefix('{slug}')->middleware(['validate.tenant.slug', 'auth', 'verified', 'role:tenant', 'verify.tenant.ownership'])->group(function () {
  Route::get('/dashboard', [DashboardController::class, 'tenant'])->name('tenant.dashboard');
});


// Tenant users dashboards (client, employee, driver)
Route::prefix('{slug}')->middleware(['validate.tenant.slug', 'auth', 'verified'])->group(function () {

  // Client Dashboard
  Route::middleware('role:client')->group(function () {
    Route::get('/client/dashboard', [DashboardController::class, 'client'])->name('client.dashboard');
  });

  // Employee Dashboard
  Route::middleware('role:employee')->group(function () {
    Route::get('/employee/dashboard', [DashboardController::class, 'employee'])->name('employee.dashboard');
  });

  // Driver Dashboard
  Route::middleware('role:driver')->group(function () {
    Route::get('/driver/dashboard', [DashboardController::class, 'driver'])->name('driver.dashboard');
  });
});


