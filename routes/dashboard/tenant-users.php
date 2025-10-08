<?php
// routes/dashboard/tenant-users.php

use App\Http\Controllers\Dashboard\DashboardController;
use Illuminate\Support\Facades\Route;

// Tenant users dashboards (client, employee, driver)
Route::prefix('{slug}')->middleware(['validate.tenant.slug', 'auth'])->group(function () {

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
