<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  @php
    $slug = request()->route('slug');
    $tenant = null;

    if ($slug) {
        $tenant = \App\Models\Tenant\Tenant::where('slug', $slug)->first();
    }

    if ($tenant) {
        // Use tenant info
        $siteName = $tenant->name;
        $siteDescription = $siteSettings['site_description'] ?? '';
        $siteKeywords = $siteSettings['site_keywords'] ?? '';
        $welcomeText = $tenant->welcome_message_title ?? '';
        $siteFavicon = $tenant->favicon;
        $faviconUrl =
            $siteFavicon && \Illuminate\Support\Facades\Storage::disk('public')->exists($siteFavicon)
                ? \Illuminate\Support\Facades\Storage::url($siteFavicon)
                : asset('favicon.ico');
    } else {
        // Use global site settings
        $publicSettingKeys = ['site_name', 'site_description', 'site_keywords', 'welcome_text', 'site_favicon'];
        $siteSettings = \App\Models\Admin\Site\SiteSetting::whereIn('key', $publicSettingKeys)
            ->pluck('value', 'key')
            ->toArray();

        $siteName = $siteSettings['site_name'] ?? config('app.name', 'سُقيا');
        $siteDescription = $siteSettings['site_description'] ?? '';
        $siteKeywords = $siteSettings['site_keywords'] ?? '';
        $welcomeText = $siteSettings['welcome_text'] ?? '';
        $siteFavicon = $siteSettings['site_favicon'] ?? null;
        $faviconUrl =
            $siteFavicon && \Illuminate\Support\Facades\Storage::disk('public')->exists($siteFavicon)
                ? \Illuminate\Support\Facades\Storage::url($siteFavicon)
                : asset('favicon.ico');
    }
  @endphp

  <title inertia>{{ $siteName }}</title>

  <!-- Primary Meta -->
  <meta name="title" content="{{ $siteName }}">
  @if ($siteDescription)
    <meta name="description" content="{{ $siteDescription }}">
  @endif
  @if ($siteKeywords)
    <meta name="keywords" content="{{ $siteKeywords }}">
  @else
    <meta name="keywords" content="{{ $siteName }}, {{ $welcomeText }}, {{ config('app.name') }}">
  @endif
  <meta name="author" content="{{ $siteName }}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{{ $siteName }}">
  <meta property="og:description" content="{{ $siteDescription }}">
  <meta property="og:site_name" content="{{ $siteName }}">
  <meta property="og:locale" content="{{ app()->getLocale() }}">
  <meta property="og:url" content="{{ url()->current() }}">
  <meta property="og:image" content="{{ $faviconUrl }}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{{ $siteName }}">
  <meta name="twitter:description" content="{{ $siteDescription }}">
  <meta name="twitter:image" content="{{ $faviconUrl }}">

  <!-- Favicons (all use same image) -->
  <link rel="icon" type="image/x-icon" href="{{ $faviconUrl }}">
  <link rel="shortcut icon" href="{{ $faviconUrl }}">
  <link rel="apple-touch-icon" href="{{ $faviconUrl }}">
  <link rel="icon" type="image/png" sizes="32x32" href="{{ $faviconUrl }}">
  <link rel="icon" type="image/png" sizes="16x16" href="{{ $faviconUrl }}">
  <link rel="manifest" href="/site.webmanifest">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap"
    rel="stylesheet">

  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <!-- Dark mode script -->
  <script>
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)')
        .matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.translations = @json(__('website', [], 'ar'));
  </script>

  <!-- Scripts -->
  @routes
  @viteReactRefresh
  @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
  @inertiaHead
</head>

<body class="font-sans antialiased">
  @inertia
</body>

</html>
