<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Tenant\Tenant;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
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

}
