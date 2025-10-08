<?php
// app/Services/Dashboard/AdminDashboardService.php

namespace App\Services\Dashboard;

use Inertia\Response;

class AdminDashboardService
{
  public function render(): Response
  {
    return inertia('Dashboard');
  }

}
