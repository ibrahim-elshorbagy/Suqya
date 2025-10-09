<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
  /**
   * Display the login view.
   */
  public function create(): Response
  {
    return Inertia::render('Auth/Login', [
      'canResetPassword' => Route::has('password.request'),
      'status' => session('status'),
    ]);
  }

  /**
   * Handle an incoming authentication request.
   */
  public function store(LoginRequest $request): RedirectResponse
  {
    $request->authenticate();

    $request->session()->regenerate();

    return redirect()->intended($request->user()->getDashboardRoute());
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
