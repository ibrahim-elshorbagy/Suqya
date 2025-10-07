<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Admin\Site\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class SiteSettingsController extends Controller
{
  public function index()
  {
    $settings = SiteSetting::all()->pluck('value', 'key')->toArray();

    // Get all available timezones
    $timezones = collect(timezone_identifiers_list())->map(function ($timezone) {
      return [
        'value' => $timezone,
        'label' => $timezone
      ];
    })->toArray();

    return inertia('Admin/Site/SiteSettings', [
      'settings' => $settings,
      'timezones' => $timezones
    ]);
  }

  public function update(Request $request)
  {
    $request->validate([
      'settings' => 'required|array',
      'env_settings' => 'array', // Optional array of settings that should go to .env
      'files.site_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
      'files.site_favicon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,ico',
      'files.welcome_icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,ico',
    ]);

    // Define mapping of setting key to environment variable name
    $envMappings = [
      'site_name' => 'APP_NAME',
      'timezone' => 'APP_TIMEZONE',
      'site_email' => 'MAIL_FROM_ADDRESS',
      'site_email_name' => 'MAIL_FROM_NAME',
      'mail_host' => 'MAIL_HOST',
      'mail_port' => 'MAIL_PORT',
      'mail_username' => 'MAIL_USERNAME',
      'mail_password' => 'MAIL_PASSWORD',
      'google_client_id' => 'GOOGLE_CLIENT_ID',
      'google_client_secret' => 'GOOGLE_CLIENT_SECRET',
      // Add more mappings as needed
    ];

    foreach ($request->settings as $key => $value) {
      // Handle file uploads for logo, favicon, and welcome icon
      if ($key === 'site_logo' || $key === 'site_favicon' || $key === 'welcome_icon') {
        if ($request->hasFile("files.{$key}")) {
          $file = $request->file("files.{$key}");

          // Delete old file if exists
          $oldSetting = SiteSetting::where('key', $key)->first();
          if ($oldSetting && $oldSetting->value && Storage::disk('public')->exists($oldSetting->value)) {
            Storage::disk('public')->delete($oldSetting->value);
          }

          // Store new file
          $path = $file->store('site-assets', 'public');
          $value = $path;
        } else {
          // Skip if no file uploaded, keep existing value
          continue;
        }
      }

      // Handle environment variables dynamically
      if ($request->has('env_settings') && in_array($key, $request->env_settings) && isset($envMappings[$key])) {
        $this->updateEnvFile($envMappings[$key], $value);
      }

      // Update or create setting
      SiteSetting::updateOrCreate(
        ['key' => $key],
        ['value' => $value]
      );
    }

    // Clear cache
    Artisan::call('cache:clear');
    Artisan::call('config:clear');

    return back()->with([
      'title' => __('website_response.settings_updated_title'),
      'message' => __('website_response.settings_updated_message'),
      'status' => 'success'
    ]);
  }

  private function updateEnvFile($key, $value)
  {
    $path = base_path('.env');
    if (file_exists($path)) {
      // Escape quotes and special characters
      $escapedValue = '"' . str_replace('"', '\"', trim($value)) . '"';
      $content = file_get_contents($path);

      if (strpos($content, $key) !== false) {
        // Update existing key
        $content = preg_replace(
          '/^' . preg_quote($key, '/') . '=.*$/m',
          $key . '=' . $escapedValue,
          $content
        );
      } else {
        // Add new key
        $content .= "\n" . $key . '=' . $escapedValue;
      }

      file_put_contents($path, $content);
    }
  }
}
