<?php

namespace App\Http\Controllers\Site\OAuth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
class ProviderRedirectController extends Controller
{
  public function __invoke(Request $request, string $provider)
  {
    if (!config("services.{$provider}")) {
      return redirect()->route('login')->with([
        'title' => __('website_response.oauth_provider_invalid_title'),
        'message' => __('website_response.oauth_provider_invalid_message'),
        'status' => 'error'
      ]);
    }

    try {
      // Store the redirect URL in session if it exists
      if ($request->has('redirect')) {
        session(['oauth_redirect' => $request->get('redirect')]);
      }

      return Socialite::driver($provider)->redirect();
    } catch (\Exception $e) {
      Log::error('OAuth redirect failed', [
        'provider' => $provider,
        'error' => $e->getMessage()
      ]);

      return redirect()->route('login')->with([
        'title' => __('website_response.oauth_general_error_title'),
        'message' => __('website_response.oauth_general_error_message'),
        'status' => 'error'
      ]);
    }
  }
}
