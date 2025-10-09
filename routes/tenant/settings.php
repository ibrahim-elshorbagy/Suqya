<?php
// routes/tenant/settings.php

use App\Http\Controllers\Tenant\Info\TenantInfoController;
use Illuminate\Support\Facades\Route;

Route::prefix('{slug}')->middleware(['validate.tenant.slug'])->group(function () {

  // Tenant owner settings - nested under dashboard/settings
  Route::prefix('dashboard')->middleware(['auth', 'role:tenant', 'verify.tenant.ownership'])->group(function () {
    Route::prefix('settings')->group(function () {

      // My Info Settings
      Route::get('/my-info', [TenantInfoController::class, 'index'])->name('tenant.info');
      Route::post('/basic-info', [TenantInfoController::class, 'updateBasicInfo'])->name('tenant.basic-info.update');
      Route::patch('/contact-info', [TenantInfoController::class, 'updateContactInfo'])->name('tenant.contact-info.update');
      Route::patch('/location-info', [TenantInfoController::class, 'updateLocationInfo'])->name('tenant.location-info.update');
      Route::post('/logo', [TenantInfoController::class, 'uploadLogo'])->name('tenant.logo.update');
      Route::post('/generate-qr', [TenantInfoController::class, 'generateQrCode'])->name('tenant.generate-qr');
      Route::post('/documents', [TenantInfoController::class, 'uploadDocuments'])->name('tenant.documents.update');
    });
  });
});
