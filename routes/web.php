<?php


// Socialite Authentication Routes
require __DIR__ . '/platform/socialite.php';

// Profile Settings (for all authenticated users)
require __DIR__ . '/platform/profileSettings.php';

// Auth For Admin/New Tenant
require __DIR__ . '/platform/auth.php';

// Tenant's dashboard
require __DIR__ . '/dashboard/tenant-dashboard.php';

// Tenant Only
require __DIR__ . '/tenant/auth.php';
require __DIR__ . '/tenant/settings.php';

// Admin Only
require __DIR__ . '/admin/Management/UserManagement.php';
require __DIR__ . '/admin/admin.php';

