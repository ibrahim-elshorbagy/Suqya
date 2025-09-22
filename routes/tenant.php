<?php

use App\Http\Controllers\Tenant\Info\TenantInfoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:tenant'])->group(function () {
  Route::get('/tenant/info', [TenantInfoController::class, 'index'])->name('tenant.info');
  Route::patch('/tenant/basic-info', [TenantInfoController::class, 'updateBasicInfo'])->name('tenant.basic-info.update');
  Route::patch('/tenant/contact-info', [TenantInfoController::class, 'updateContactInfo'])->name('tenant.contact-info.update');
  Route::patch('/tenant/location-info', [TenantInfoController::class, 'updateLocationInfo'])->name('tenant.location-info.update');
  Route::post('/tenant/logo', [TenantInfoController::class, 'uploadLogo'])->name('tenant.logo.update');
  Route::post('/tenant/generate-qr', [TenantInfoController::class, 'generateQrCode'])->name('tenant.generate-qr');
  Route::post('/tenant/documents', [TenantInfoController::class, 'uploadDocuments'])->name('tenant.documents.update');

});
