<?php
// app/Http/Middleware/VerifyTenantOwnership.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyTenantOwnership
{
  public function handle(Request $request, Closure $next)
  {
    $slug = $request->route('slug');
    $user = Auth::user();

    // Check if user is authenticated and has tenant role
    if (!$user || !$user->hasRole('tenant')) {
      abort(403, 'Unauthorized access');
    }

    // Verify that the slug matches the user's tenant
    if ($user->tenant->slug !== $slug) {
      abort(403, 'You do not have permission to access this tenant');
    }

    return $next($request);
  }
}
