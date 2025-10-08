<?php
// routes/tenant-user/dashboard.php

use App\Http\Controllers\Tenant\Info\TenantInfoController;
use App\Http\Controllers\TenantUser\DashboardController;
use Illuminate\Support\Facades\Route;

Route::prefix('{slug}')->middleware(['validate.tenant.slug'])->group(function () {

  // Tenant owner admin settings - nested under admin/settings
  Route::prefix('admin')->middleware(['auth', 'role:tenant', 'verify.tenant.ownership'])->group(function () {
    Route::prefix('settings')->name('tenant.')->group(function () {

      // My Info Settings
      Route::get('/my-info', [TenantInfoController::class, 'index'])->name('info');
      Route::patch('/basic-info', [TenantInfoController::class, 'updateBasicInfo'])->name('basic-info.update');
      Route::patch('/contact-info', [TenantInfoController::class, 'updateContactInfo'])->name('contact-info.update');
      Route::patch('/location-info', [TenantInfoController::class, 'updateLocationInfo'])->name('location-info.update');
      Route::post('/logo', [TenantInfoController::class, 'uploadLogo'])->name('logo.update');
      Route::post('/generate-qr', [TenantInfoController::class, 'generateQrCode'])->name('generate-qr');
      Route::post('/documents', [TenantInfoController::class, 'uploadDocuments'])->name('tenant.documents.update');
    });
  });
});
