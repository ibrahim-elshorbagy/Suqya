<?php

namespace App\Models\Tenant;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
  protected $guarded = ['id'];

  public function owner()
  {
    return $this->belongsTo(User::class, 'owner_id');
  }
}
