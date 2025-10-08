<?php
// app/Services/Dashboard/ClientDashboardService.php

namespace App\Services\Dashboard;

use Inertia\Response;

class ClientDashboardService
{
  public function render(): Response
  {
    return inertia('Dashboard');
  }

}
