<?php

namespace App\Http\Controllers\Tenant\Info;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;


use Inertia\Inertia;
use Inertia\Response;
use App\Models\Admin\Site\Currency;



class TenantInfoController extends Controller
{
  public function index(): Response
  {
    $user = auth()->user();
    $tenant = $user->tenant->load('currency');

    return Inertia::render('Tenant/Info/Info', [
      'tenant' => $tenant,
      'currencies' => Currency::all(['id', 'name', 'code']),
    ]);
  }

  public function updateBasicInfo(Request $request): RedirectResponse
  {
    $user = auth()->user();
    $tenant = $user->tenant;

    if (!$tenant) {
      return back()->with([
        'title' => __('website_response.error_title'),
        'message' => __('website_response.tenant_not_found_message'),
        'status' => 'error'
      ]);
    }

    $request->validate([
      'name' => 'required|string|max:255',
      'slug' => [
        'required',
        'string',
        'max:255',
        'regex:/^[a-zA-Z-_]+$/u',
        new \App\Rules\AllowedTenantSlug,
        Rule::unique('tenants', 'slug')->ignore($tenant->id)
      ],
      'currency_id' => 'nullable|exists:currencies,id',
      'favicon' => [
        'nullable',
        'file',
        'image',
        'mimes:jpeg,jpg,png,gif,webp,ico',
        'max:10240', // 10MB max
        'dimensions:min_width=16,min_height=16,max_width=512,max_height=512'
      ],
      'welcome_message_title' => 'nullable|string|max:255',
      'welcome_message_desc' => 'nullable|string|max:255',
    ], [
      'slug.regex' => __('validation.tenant_slug'),
      'favicon.image' => __('website.invalid_file_type'),
      'favicon.mimes' => __('website.invalid_file_type'),
      'favicon.max' => __('website.file_too_large'),
      'favicon.dimensions' => __('website.invalid_favicon_dimensions'),
    ]);

    $updates = $request->only(['name', 'slug', 'currency_id', 'welcome_message_title', 'welcome_message_desc']);

    // Handle favicon upload
    if ($request->hasFile('favicon')) {
      try {
        $file = $request->file('favicon');

        // Additional security checks
        $realMimeType = $file->getClientMimeType();
        $allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/x-icon', 'image/vnd.microsoft.icon'];

        if (!in_array($realMimeType, $allowedMimes)) {
          return back()->with([
            'title' => __('website_response.error_title'),
            'message' => __('website.invalid_file_type'),
            'status' => 'error'
          ]);
        }

        // Delete old favicon if exists
        if ($tenant->favicon && Storage::disk('public')->exists($tenant->favicon)) {
          Storage::disk('public')->delete($tenant->favicon);
        }

        // Generate unique filename to prevent conflicts
        $filename = 'favicon_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('tenants/' . $tenant->id . '/favicon', $filename, 'public');

        $updates['favicon'] = $path;

      } catch (\Exception $e) {
        Log::error('Favicon upload failed: ' . $e->getMessage());
        return back()->with([
          'title' => __('website_response.error_title'),
          'message' => __('website_response.file_upload_failed_message'),
          'status' => 'error'
        ]);
      }
    }

    $tenant->update($updates);

    return to_route('tenant.info', ['slug' => $tenant->slug])->with([
      'title' => __('website_response.tenant_basic_info_updated_title'),
      'message' => __('website_response.tenant_basic_info_updated_message'),
      'status' => 'success'
    ]);
  }

  public function updateContactInfo(Request $request): RedirectResponse
  {
    $user = auth()->user();
    $tenant = $user->tenant;

    if (!$tenant) {
      return back()->with([
        'title' => __('website_response.error_title'),
        'message' => __('website_response.tenant_not_found_message'),
        'status' => 'error'
      ]);
    }

    $request->validate([
      'phone' => 'nullable|string|max:255',
      'whatsapp' => 'nullable|string|max:255',
      'email' => 'nullable|email|max:255',
    ]);

    $tenant->update($request->only(['phone', 'whatsapp', 'email']));

    return back()->with([
      'title' => __('website_response.tenant_contact_info_updated_title'),
      'message' => __('website_response.tenant_contact_info_updated_message'),
      'status' => 'success'
    ]);
  }

  public function updateLocationInfo(Request $request): RedirectResponse
  {
    $user = auth()->user();
    $tenant = $user->tenant;

    if (!$tenant) {
      return back()->with([
        'title' => __('website_response.error_title'),
        'message' => __('website_response.tenant_not_found_message'),
        'status' => 'error'
      ]);
    }

    $request->validate([
      'country' => 'nullable|string|max:255',
      'city' => 'nullable|string|max:255',
      'area' => 'nullable|string|max:255',
      'full_address' => 'nullable|string|max:1000',
      'latitude' => 'nullable|numeric|between:-90,90',
      'longitude' => 'nullable|numeric|between:-180,180',
    ]);

    $tenant->update($request->only(['country', 'city', 'area', 'full_address', 'latitude', 'longitude']));

    return back()->with([
      'title' => __('website_response.tenant_location_info_updated_title'),
      'message' => __('website_response.tenant_location_info_updated_message'),
      'status' => 'success'
    ]);
  }

  public function uploadLogo(Request $request): RedirectResponse
  {
    $user = auth()->user();
    $tenant = $user->tenant;

    if (!$tenant) {
      return back()->with([
        'title' => __('website_response.error_title'),
        'message' => __('website_response.tenant_not_found_message'),
        'status' => 'error'
      ]);
    }

    // Strict validation for logo
    $request->validate([
      'logo' => [
        'required',
        'file',
        'image',
        'mimes:jpeg,jpg,png,gif,webp',
        'max:10240', // 10MB max
        'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000'
      ],
    ], [
      'logo.required' => __('website.invalid_file_type'),
      'logo.image' => __('website.invalid_file_type'),
      'logo.mimes' => __('website.invalid_file_type'),
      'logo.max' => __('website.file_too_large'),
      'logo.dimensions' => __('website.invalid_file_type'),
    ]);

    try {
      $file = $request->file('logo');

      // Additional security checks
      $realMimeType = $file->getClientMimeType();
      $allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

      if (!in_array($realMimeType, $allowedMimes)) {
        return back()->with([
          'title' => __('website_response.error_title'),
          'message' => __('website.invalid_file_type'),
          'status' => 'error'
        ]);
      }

      // Delete old logo if exists
      if ($tenant->logo && Storage::disk('public')->exists($tenant->logo)) {
        Storage::disk('public')->delete($tenant->logo);
      }

      // Generate unique filename to prevent conflicts
      $filename = uniqid() . '.' . $file->getClientOriginalExtension();
      $path = $file->storeAs('tenants/' . $tenant->id . '/logos', $filename, 'public');

      $tenant->update(['logo' => $path]);

      return back()->with([
        'title' => __('website_response.tenant_logo_updated_title'),
        'message' => __('website_response.tenant_logo_updated_message'),
        'status' => 'success'
      ]);

    } catch (\Exception $e) {
      return back()->with([
        'title' => __('website_response.error_title'),
        'message' => __('website_response.file_upload_failed_message'),
        'status' => 'error'
      ]);
    }
  }

  public function generateQrCode(Request $request): RedirectResponse
  {
    $user = auth()->user();
    $tenant = $user->tenant;

    if (!$tenant || !$tenant->slug) {
      return back()->with([
        'title' => __('website_response.error_title'),
        'message' => __('website_response.save_tenant_info_first_message'),
        'status' => 'error'
      ]);
    }

    try {
      // QR content and paths
      $url = url('/') . '/' . $tenant->slug;
      $filename = $tenant->slug . '_qr_' . time() . '.png';
      $path = 'tenants/' . $tenant->id . '/qr-codes/' . $filename;
      $fullPath = storage_path('app/public/' . $path);

      // Ensure directory exists
      if (!file_exists(dirname($fullPath))) {
        mkdir(dirname($fullPath), 0755, true);
      }

      // Delete old QR code if exists
      if ($tenant->qr_code && Storage::disk('public')->exists($tenant->qr_code)) {
        Storage::disk('public')->delete($tenant->qr_code);
      }

      // Method 1: Using the Builder constructor (current version)
      $builder = new Builder(
        writer: new PngWriter(),
        writerOptions: [],
        validateResult: false,
        data: $url,
        encoding: new \Endroid\QrCode\Encoding\Encoding('UTF-8'),
        errorCorrectionLevel: \Endroid\QrCode\ErrorCorrectionLevel::Low,
        size: 300,
        margin: 10,
        roundBlockSizeMode: \Endroid\QrCode\RoundBlockSizeMode::Margin,
        foregroundColor: new \Endroid\QrCode\Color\Color(0, 0, 0),
        backgroundColor: new \Endroid\QrCode\Color\Color(255, 255, 255)
      );

      $result = $builder->build();

      // Save to disk
      $result->saveToFile($fullPath);

      // Verify the file was created
      if (!file_exists($fullPath)) {
        throw new \Exception('QR code file was not created');
      }

      // Update tenant with the QR code path
      $tenant->update(['qr_code' => $path]);

      return back()->with([
        'title' => __('website_response.qr_code_generated_title'),
        'message' => __('website_response.qr_code_generated_message'),
        'status' => 'success'
      ]);

    } catch (\Exception $e) {
      Log::error('QR Code generation failed: ' . $e->getMessage());
      return back()->with([
        'title' => __('website_response.error_title'),
        'message' => __('website_response.qr_code_generation_failed_message') ?: 'QR code generation failed: ' . $e->getMessage(),
        'status' => 'error'
      ]);
    }
  }




  public function uploadDocuments(Request $request): RedirectResponse
  {
    $user = auth()->user();
    $tenant = $user->tenant;

    if (!$tenant) {
      return back()->with([
        'title' => __('website_response.error_title'),
        'message' => __('website_response.tenant_not_found_message'),
        'status' => 'error'
      ]);
    }

    // Strict validation for documents
    $request->validate([
      'commercial_registration' => [
        'nullable',
        'file',
        'mimes:pdf,jpeg,jpg,png',
        'max:10240' // 10MB max
      ],
      'profession_license' => [
        'nullable',
        'file',
        'mimes:pdf,jpeg,jpg,png',
        'max:10240' // 10MB max
      ],
    ], [
      'commercial_registration.mimes' => __('website.invalid_document_type'),
      'commercial_registration.max' => __('website.document_too_large'),
      'profession_license.mimes' => __('website.invalid_document_type'),
      'profession_license.max' => __('website.document_too_large'),
    ]);

    $updates = [];

    try {
      if ($request->hasFile('commercial_registration')) {
        $file = $request->file('commercial_registration');

        // Additional security check
        $realMimeType = $file->getClientMimeType();
        $allowedMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        if (!in_array($realMimeType, $allowedMimes)) {
          return back()->with([
            'title' => __('website_response.error_title'),
            'message' => __('website.invalid_document_type'),
            'status' => 'error'
          ]);
        }

        // Delete old file if exists
        if ($tenant->commercial_registration && Storage::disk('public')->exists($tenant->commercial_registration)) {
          Storage::disk('public')->delete($tenant->commercial_registration);
        }

        $filename = 'commercial_registration_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('tenants/' . $tenant->id . '/documents', $filename, 'public');
        $updates['commercial_registration'] = $path;
      }

      if ($request->hasFile('profession_license')) {
        $file = $request->file('profession_license');

        // Additional security check
        $realMimeType = $file->getClientMimeType();
        $allowedMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        if (!in_array($realMimeType, $allowedMimes)) {
          return back()->with([
            'title' => __('website_response.error_title'),
            'message' => __('website.invalid_document_type'),
            'status' => 'error'
          ]);
        }

        // Delete old file if exists
        if ($tenant->profession_license && Storage::disk('public')->exists($tenant->profession_license)) {
          Storage::disk('public')->delete($tenant->profession_license);
        }

        $filename = 'profession_license_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('tenants/' . $tenant->id . '/documents', $filename, 'public');
        $updates['profession_license'] = $path;
      }

      if (!empty($updates)) {
        $tenant->update($updates);
      }

      return back()->with([
        'title' => __('website_response.documents_updated_title'),
        'message' => __('website_response.documents_updated_message'),
        'status' => 'success'
      ]);

    } catch (\Exception $e) {
      Log::error('Document upload failed: ' . $e->getMessage());
      return back()->with([
        'title' => __('website_response.error_title'),
        'message' => __('website_response.file_upload_failed_message'),
        'status' => 'error'
      ]);
    }
  }
}
