<?php
// app/Services/Dashboard/EmployeeDashboardService.php

namespace App\Services\Dashboard;

use Inertia\Response;

class EmployeeDashboardService
{
  public function render(): Response
  {
    return inertia('Dashboard');
  }

}
