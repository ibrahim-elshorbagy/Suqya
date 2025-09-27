<?php

namespace App\Models\Tenant;

use App\Models\Admin\Site\Currency;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
  protected $guarded = ['id'];

  public function owner()
  {
    return $this->belongsTo(User::class, 'owner_id');
  }

  public function currency()
  {
    return $this->belongsTo(Currency::class);
  }
}
