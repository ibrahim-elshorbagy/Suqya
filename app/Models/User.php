<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Tenant\Tenant;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Contracts\Role;
use Spatie\Permission\Models\Role as ModelsRole;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
  /** @use HasFactory<\Database\Factories\UserFactory> */
  use HasFactory, Notifiable;
  use HasRoles;

  /**
   * The attributes that are mass assignable.
   *
   * @var list<string>
   */
  protected $guarded = ['id'];
  /**
   * The attributes that should be hidden for serialization.
   *
   * @var list<string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
      'blocked' => 'boolean',
    ];
  }
  public function scopeWithTenantRole(Builder $query): Builder
  {
    $tenantRole = ModelsRole::where('name', 'tenant')->first();

    return $query->whereIn('id', function ($subQuery) use ($tenantRole) {
      $subQuery->select('model_id')
        ->from('model_has_roles')
        ->where('role_id', $tenantRole->id)
        ->where('model_type', User::class);
    });
  }
  public function tenant()
  {
    return $this->belongsTo(Tenant::class);
  }

  public function getDashboardRoute(): string
  {
    // Add this for debugging
    Log::info('User roles: ' . json_encode($this->getRoleNames()));
    Log::info('Tenant relationship: ' . ($this->tenant ? $this->tenant->slug : 'null'));

    // Admin - goes to main admin dashboard
    if ($this->hasRole('admin')) {
      return route('dashboard', absolute: false);
    }

    // Tenant owner - goes to their tenant dashboard
    if ($this->hasRole('tenant') && $this->tenant) {
      return route('tenant.dashboard', ['slug' => $this->tenant->slug], absolute: false);
    }

    // Client - goes to client dashboard
    if ($this->hasRole('client') && $this->tenant) {
      return route('client.dashboard', ['slug' => $this->tenant->slug], absolute: false);
    }

    // Employee - goes to employee dashboard
    if ($this->hasRole('employee') && $this->tenant) {
      return route('employee.dashboard', ['slug' => $this->tenant->slug], absolute: false);
    }

    // Driver - goes to driver dashboard
    if ($this->hasRole('driver') && $this->tenant) {
      return route('driver.dashboard', ['slug' => $this->tenant->slug], absolute: false);
    }

    // Default fallback
    return route('dashboard', absolute: false);
  }


}
