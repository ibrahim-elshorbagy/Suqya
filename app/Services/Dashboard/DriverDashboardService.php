<?php
// app/Services/Dashboard/DriverDashboardService.php

namespace App\Services\Dashboard;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class DriverDashboardService
{
  public function render(): Response
  {
    return inertia('Dashboard');
  }

}
