<?php
// app/Http/Middleware/ValidateTenantSlug.php

namespace App\Http\Middleware;

use App\Models\Tenant\Tenant;
use Closure;
use Illuminate\Http\Request;

class ValidateTenantSlug
{
  public function handle(Request $request, Closure $next)
  {
    $slug = $request->route('slug');

    if (!$slug) {
      abort(404);
    }

    $tenant = Tenant::where('slug', $slug)->first();

    if (!$tenant) {
      abort(404, 'Tenant not found');
    }

    // Share tenant with the request
    $request->merge(['tenant' => $tenant]);
    view()->share('tenant', $tenant);

    return $next($request);
  }
}
