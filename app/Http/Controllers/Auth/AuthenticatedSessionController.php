<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Tenant\Tenant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
  /**
   * Display the platform login view (for admins and tenant owners).
   */
  public function create(): Response
  {
    return Inertia::render('Auth/Login', [
      'canResetPassword' => Route::has('password.request'),
      'status' => session('status'),
      'isMainLogin' => true,
    ]);
  }

  /**
   * Handle platform login (Admin + Tenant Owner only).
   * Tenant owners can login here regardless of their tenant_id.
   */
  public function store(LoginRequest $request): RedirectResponse
  {
    $credentials = $request->only('email', 'password');

    // First, find the user by email
    $user = User::where('email', $credentials['email'])->first();

    if (!$user) {
      throw ValidationException::withMessages([
        'email' => [__('auth.failed')],
      ]);
    }

    // Set the team context to check roles properly
    setPermissionsTeamId($user->tenant_id);

    // Check if user is admin or tenant owner
    $isAdminOrOwner = $user->hasRole('admin') || $user->hasRole('tenant');

    // Reset team context
    setPermissionsTeamId(null);

    if ($isAdminOrOwner) {
      // Allow login for admin or tenant owner
      if (
        !Auth::guard('web')->attempt([
          'email' => $credentials['email'],
          'password' => $credentials['password'],
          'tenant_id' => $user->tenant_id,
        ], $request->boolean('remember'))
      ) {
        throw ValidationException::withMessages([
          'email' => [__('auth.failed')],
        ]);
      }

      $request->session()->regenerate();
      return redirect()->intended($user->getDashboardRoute());
    }

    // User exists but is NOT admin or tenant owner
    if ($user->tenant) {
      $loginUrl = url('/' . $user->tenant->slug . '/login');

      throw ValidationException::withMessages([
        'email' => [
          __('website_response.login_use_company_page', [
            'url' => $loginUrl
          ])
        ],
      ]);
    }

    // User has no tenant and no appropriate role
    throw ValidationException::withMessages([
      'email' => [__('auth.failed')],
    ]);
  }

  /**
   * Display tenant login page.
   */
  public function tenantLogin(Request $request, $slug): Response
  {
    $tenant = Tenant::where('slug', $slug)->firstOrFail();

    return Inertia::render('Auth/Login', [
      'canResetPassword' => Route::has('tenant-user.password.request'),
      'status' => session('status'),
      'tenant' => $tenant->only('name', 'logo', 'slug'),
      'isMainLogin' => false,
    ]);
  }

  /**
   * Handle tenant user login (All users including tenant owner).
   */
  public function tenantStore(LoginRequest $request, $slug): RedirectResponse
  {
    $credentials = $request->only('email', 'password');
    $tenant = Tenant::where('slug', $slug)->firstOrFail();

    // Look for users in THIS specific tenant
    $user = User::where('email', $credentials['email'])
      ->where('tenant_id', $tenant->id)
      ->first();

    if (!$user) {
      throw ValidationException::withMessages([
        'email' => [__('auth.failed')],
      ]);
    }

    // Attempt login with tenant_id constraint
    if (
      !Auth::guard('web')->attempt([
        'email' => $credentials['email'],
        'password' => $credentials['password'],
        'tenant_id' => $tenant->id,
      ], $request->boolean('remember'))
    ) {
      throw ValidationException::withMessages([
        'email' => [__('auth.failed')],
      ]);
    }

    $request->session()->regenerate();
    return redirect()->intended($user->getDashboardRoute());
  }

  /**
   * Destroy an authenticated session.
   */
  public function destroy(Request $request): RedirectResponse
  {
    $user = $request->user();

    // Save tenant slug before logout (if user is not admin and has tenant)
    $tenantSlug = null;
    if ($user && !$user->hasRole('admin') && $user->tenant) {
      $tenantSlug = $user->tenant->slug;
    }

    Auth::guard('web')->logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    // Redirect based on saved tenant slug
    if ($tenantSlug) {
      return redirect()->route('tenant-user.login', ['slug' => $tenantSlug]);
    }

    return redirect('/');
  }

}
