<?php

namespace App\Http\Middleware;

use App\Models\Admin\Site\SiteSetting;
use App\Models\Tenant\Tenant;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
  /**
   * The root template that is loaded on the first page visit.
   *
   * @var string
   */
  protected $rootView = 'app';

  /**
   * Determine the current asset version.
   */
  public function version(Request $request): ?string
  {
    return parent::version($request);
  }

  /**
   * Define the props that are shared by default.
   *
   * @return array<string, mixed>
   */

  public function share(Request $request): array
  {
    $user = $request->user();

    if ($user) {
      // If logged in, set tenant context
      setPermissionsTeamId($user->tenant_id);

      $roles = $user->getRoleNames();
      $permissions = $user->getAllPermissions()->pluck('name');

      // Load tenant information for the user
      $user->load('tenant');
    } else {
      $roles = collect();
      $permissions = collect();
    }

    return [
      ...parent::share($request),

      'auth' => [
        'user' => $user,
        'roles' => $roles,
        'permissions' => $permissions,
      ],

      'impersonate_admin_id' => session('impersonate_admin_id'),

      'flash' => [
        'title' => session('title'),
        'message' => session('message'),
        'status' => session('status'), // success / error / warning
        'type' => session('type'),
      ],

      // 'translations' => fn() => __('website'),
      'available_locales' => ['en', 'ar'],
      'locale' => fn() => app()->getLocale(),

      'site_settings' => function () use ($request) {
        // Check if route has slug parameter (tenant route)
        $slug = $request->route('slug');

        if ($slug) {
          // This is a tenant route - fetch tenant info
          $tenant = Tenant::where('slug', $slug)->first();

          if ($tenant) {
            // Get the missing fields from main site settings
            $fallbackSettings = SiteSetting::whereIn('key', ['site_keywords', 'footer_text', 'timezone'])
              ->pluck('value', 'key')
              ->toArray();

            // Map tenant fields to match site_settings structure
            return [
              'site_name' => $tenant->name,
              'site_description' => '',
              'site_keywords' => $fallbackSettings['site_keywords'] ?? null,
              'site_logo' => $tenant->logo,
              'welcome_icon' => $tenant->favicon,
              'site_favicon' => $tenant->favicon,
              'welcome_text' => $tenant->welcome_message_title,
              'footer_text' => $fallbackSettings['footer_text'] ?? null,
              'timezone' => $fallbackSettings['timezone'] ?? null,
              // Contact info from tenant
              'support_whatsapp' => $tenant->whatsapp,
              'support_phone' => $tenant->phone,
              'support_mobile' => $tenant->phone, // Same as phone
              'support_email' => $tenant->email,
              'company_address' => $tenant->full_address,
              'business_latitude' => $tenant->latitude,
              'business_longitude' => $tenant->longitude,
            ];
          }
        }

        // No slug or tenant not found - use global site settings
        $publicSettings = [
          'site_name',
          'site_description',
          'site_keywords',
          'site_logo',
          "welcome_icon",
          'site_favicon',
          'welcome_text',
          'footer_text',
          'timezone',
          // Contact info (public)
          'support_whatsapp',
          'support_phone',
          'support_mobile',
          'support_email',
          'company_address',
          'business_latitude',
          'business_longitude'
        ];

        return SiteSetting::whereIn('key', $publicSettings)
          ->pluck('value', 'key')
          ->toArray();
      }
    ];
  }

}
