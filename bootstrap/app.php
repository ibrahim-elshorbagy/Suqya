<?php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
  ->withRouting(
    web: __DIR__ . '/../routes/web.php',
    commands: __DIR__ . '/../routes/console.php',
    health: '/up',
  )
  ->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [
      \App\Http\Middleware\SetLocale::class,
      \App\Http\Middleware\HandleInertiaRequests::class,
      \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
    ]);

    // EXCLUDE locale cookie from encryption
    $middleware->encryptCookies(except: [
      'locale',
    ]);

    $middleware->alias([
      'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
      'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
    ]);
  })
  ->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
      $status = $response->getStatusCode();

      if (app()->environment(['local', 'testing']) && $status === 500) {
        return $response;
      }

      if (in_array($status, [500, 503, 404, 403, 401, 429, 419])) {
        // Now this will work - cookie is unencrypted


        // Get site settings for error page
        $publicSettings = [
          'site_name',
          'site_description',
          'site_keywords',
          'site_logo',
          'site_favicon',
          'welcome_text',
        ];

        $siteSettings = \App\Models\Admin\Site\SiteSetting::whereIn('key', $publicSettings)
          ->pluck('value', 'key')
          ->toArray();

        return Inertia::render('ErrorPage', [
          'status' => $status,
          'site_settings' => $siteSettings,
        ])
          ->toResponse($request)
          ->setStatusCode($status);
      }

      return $response;
    });
  })
  ->create();
