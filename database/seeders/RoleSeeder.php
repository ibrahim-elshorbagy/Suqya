<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Tenant\Tenant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
  public function run(): void
  {

    // Reset Cache
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    // Roles
    $SystemAdminRole = Role::firstOrCreate(['name' => 'admin']);
    $TenantRole = Role::firstOrCreate(['name' => 'tenant']);

    // Admin
    $admin = User::firstOrCreate(
      ['id' => 1],
      [
        'name' => 'Jordan WebMaster',
        'email' => 'a@a.a',
        'password' => Hash::make('a'),
      ]
    );

    // Fake Tenant For System Admin
    $systemTenant = Tenant::create(
      [
        'id' => 1,
        'name' => 'admin tenant',
        'phone' => null,
        'address' => 'Egypt',
        'owner_id' => $admin->id,
      ]
    );

    $admin->update(['tenant_id' => $systemTenant->id]);

    // Admin Context
    setPermissionsTeamId($systemTenant->id);
    $admin->assignRole($SystemAdminRole);
    setPermissionsTeamId(null);

    // Test Tenant
    // Every Tenant Must Have Owner
    //
    $tenantOwner = User::create(
      [
        'id' => 2,
        'name' => 'Tenant Owner',
        'email' => 't@t.t',
        'password' => Hash::make('t'),
      ]
    );

    $tenant = Tenant::create(
      [
        'id' => 2,
        'name' => 'Water Company 1',
        'slug' => 'water-company',
        'phone' => '123456789',
        'address' => 'Amman, Jordan',
        'currency_id' => 1, // USD
        'owner_id' => $tenantOwner->id,
      ]
    );

    $tenantOwner->update(['tenant_id' => $tenant->id]);

    // Context For Tenant
    setPermissionsTeamId($tenant->id);
    $tenantOwner->assignRole($TenantRole);
    setPermissionsTeamId(null);

    // Reset Cache
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

  }
}
