<?php

namespace App\Http\Controllers\Site\OAuth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class ProviderCallbackController extends Controller
{
  /**
   * Handle the incoming request.
   */
  public function __invoke(string $provider)
  {
    if (!config("services.{$provider}")) {
      return redirect()->route('login')->with([
        'title' => __('website_response.oauth_provider_invalid_title'),
        'message' => __('website_response.oauth_provider_invalid_message'),
        'status' => 'error'
      ]);
    }

    try {
      $socialUser = Socialite::driver($provider)->user();

      if (!$socialUser->getEmail()) {
        return redirect()->route('login')->with([
          'title' => __('website_response.oauth_authentication_failed_title'),
          'message' => __('website_response.oauth_authentication_failed_message', ['provider' => ucfirst($provider)]),
          'status' => 'error'
        ]);
      }

      $user = User::updateOrCreate([
        'provider_id' => $socialUser->getId(),
        'provider_name' => $provider,
      ], [
        'name' => $socialUser->getName(),
        'email' => $socialUser->getEmail(),
        'email_verified_at' => now(),
        'password' => Hash::make(Str::random(32)),
        'provider_token' => $socialUser->token ?? null,
        'provider_refresh_token' => $socialUser->refreshToken ?? null,
      ]);

      Auth::login($user);

      // Check if there's a stored redirect URL from OAuth flow
      $redirectUrl = session()->pull('oauth_redirect');
      if ($redirectUrl && $redirectUrl !== '/') {
        return redirect($redirectUrl)->with([
          'title' => __('website_response.oauth_login_success_title'),
          'message' => __('website_response.oauth_login_success_message', ['provider' => ucfirst($provider)]),
          'status' => 'success'
        ]);
      }

      return redirect(route('dashboard'))->with([
        'title' => __('website_response.oauth_login_success_title'),
        'message' => __('website_response.oauth_login_success_message', ['provider' => ucfirst($provider)]),
        'status' => 'success'
      ]);
    } catch (\Exception $e) {
      Log::error('OAuth authentication failed', [
        'provider' => $provider,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);

      return redirect()->route('login')->with([
        'title' => __('website_response.oauth_authentication_failed_title'),
        'message' => __('website_response.oauth_authentication_failed_message', ['provider' => ucfirst($provider)]),
        'status' => 'error'
      ]);
    }
  }

}
