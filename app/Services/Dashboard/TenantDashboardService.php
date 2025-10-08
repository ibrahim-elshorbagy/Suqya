<?php
// app/Services/Dashboard/TenantDashboardService.php

namespace App\Services\Dashboard;

use Inertia\Response;

class TenantDashboardService
{
  public function render(): Response
  {
    return inertia('Dashboard');
  }
}
