<?php
// app/Http/Controllers/Dashboard/DashboardController.php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\AdminDashboardService;
use App\Services\Dashboard\TenantDashboardService;
use App\Services\Dashboard\ClientDashboardService;
use App\Services\Dashboard\EmployeeDashboardService;
use App\Services\Dashboard\DriverDashboardService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class DashboardController extends Controller
{
  /**
   * Redirect to appropriate dashboard based on user role
   */
  public function index(Request $request): RedirectResponse
  {
    // Add debugging log
    Log::info('DashboardController index called for user: ' . ($request->user() ? $request->user()->id : 'null'));
    return redirect($request->user()->getDashboardRoute());
  }

  public function admin(AdminDashboardService $service): Response
  {
    return $service->render();
  }

  public function tenant(TenantDashboardService $service): Response
  {
    return $service->render();
  }

  public function client(ClientDashboardService $service): Response
  {
    return $service->render();
  }

  public function employee(EmployeeDashboardService $service): Response
  {
    return $service->render();
  }

  public function driver(DriverDashboardService $service): Response
  {
    return $service->render();
  }
}
