<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    // First, drop the existing unique index on email
    Schema::table('users', function (Blueprint $table) {
      $table->dropUnique(['email']); // remove normal unique
    });

    // Now add composite unique index
    Schema::table('users', function (Blueprint $table) {
      $table->unique(['email', 'tenant_id']);
    });
  }

  public function down(): void
  {
    // Drop composite index
    Schema::table('users', function (Blueprint $table) {
      $table->dropUnique(['email', 'tenant_id']);
    });

    // Add unique back on email
    Schema::table('users', function (Blueprint $table) {
      $table->unique('email');
    });
  }
};
