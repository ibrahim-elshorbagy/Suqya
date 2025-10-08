<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Route;

class AllowedTenantSlug implements Rule
{
  public function passes($attribute, $value)
  {
    // Get all registered route paths
    $routes = collect(Route::getRoutes())->map(function ($route) {
      return $route->uri();
    })->toArray();

    // Extract first segment from all routes
    $reservedPaths = collect($routes)->map(function ($uri) {
      return explode('/', trim($uri, '/'))[0] ?? null;
    })->filter()->unique()->toArray();

    // Additional reserved keywords
    $reservedKeywords = [
      'login',
      'register',
      'password',
      'forgot-password',
      'reset-password',
      'verify-email',
      'email',
      'logout',
      'dashboard',
      'profile',
      'admin',
      'api',
      'auth',
      'confirm-password',
      'tenant',
      'user',
      'settings',
      'preferences',
      'account',
      'billing',
      'subscription',
      'plans',
      'home',
      'about',
      'contact',
      'support',
      'help',
      'docs',
      'documentation',
      'blog',
      'news',
      'pricing',
      'features',
      'terms',
      'privacy',
      'legal',
      'cookies',
      'sitemap',
      'robots',
      'favicon',
      'assets',
      'images',
      'css',
      'js',
      'fonts',
      'downloads',
      'files',
      'uploads',
      'storage',
      'public',
      'vendor',
      'test',
      'testing',
      'debug',
      'app',
      'application',
      'system',
      'config',
      'configuration',
      'my',
      'portal',
      'client',
      'customer',
      'service',
      'services',
      'status',
      'health',
    ];

    $allReserved = array_merge($reservedPaths, $reservedKeywords);

    return !in_array(strtolower($value), array_map('strtolower', $allReserved));
  }

  public function message()
  {
    return trans('website_response.tenant_slug_reserved');
  }
}
