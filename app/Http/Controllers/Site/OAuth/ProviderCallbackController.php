<?php

namespace App\Http\Controllers\Site\OAuth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class ProviderCallbackController extends Controller
{
  /**
   * Handle the incoming request.
   */
  public function __invoke(string $provider)
  {
    if (!config("services.{$provider}")) {
      return redirect()->route('login')->withErrors(['provider' => 'Invalid provider']);
    }

    try {
      $socialUser = Socialite::driver($provider)->user();

      $user = User::updateOrCreate([
        'provider_id' => $socialUser->id,
        'provider_name' => $provider,
      ], [
        'name' => $socialUser->name,
        'email' => $socialUser->email,
        'email_verified_at' => now(),
        'provider_token' => $socialUser->token,
        'provider_refresh_token' => $socialUser->refreshToken,
      ]);

      Auth::login($user);

      // Check if there's a stored redirect URL from OAuth flow
      $redirectUrl = session()->pull('oauth_redirect');
      if ($redirectUrl && $redirectUrl !== '/') {
        return redirect($redirectUrl);
      }

      return redirect(route('dashboard'));
    } catch (\Exception $e) {

      return redirect()->route('login')->withErrors(['provider' => 'Unable to login using ' . ucfirst($provider) . '. Please try again.']);
    }
  }

}
