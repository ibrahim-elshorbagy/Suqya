<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Tenant\Tenant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class TenantFactorySeeder extends Seeder
{
    public function run(): void
    {
        $tenantRole = Role::where('name', 'tenant')->first();

        for ($i = 3; $i <= 102; $i++) { // Start from 3 to avoid collision with existing seeders
            $owner = User::create([
                'name' => "Tenant Owner $i",
                'email' => "tenant$i@example.com",
                'password' => Hash::make('password'),
            ]);

            $tenant = Tenant::create([
                'name' => "Water Company $i",
                'slug' => "water-company-$i",
                'phone' => "1234567$i",
                'address' => "City $i",
                'owner_id' => $owner->id,
            ]);

            $owner->update(['tenant_id' => $tenant->id]);

            setPermissionsTeamId($tenant->id);
            $owner->assignRole($tenantRole);
            setPermissionsTeamId(null);
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
