<?php

namespace App\Http\Middleware;

use App\Models\Admin\Site\SiteSetting;
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
      'site_settings' => function () {
        // Only share safe, public settings - NEVER sensitive data like SMTP, OAuth secrets
        $publicSettings = [
          'site_name',
          'site_description',
          'site_keywords',
          'site_logo',
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
