<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('tenants', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->string('slug')->nullable()->unique();
      $table->string('phone')->nullable();
      $table->string('address')->nullable();

      $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();  //Owner of the tenant

      $table->timestamps();

    });

    Schema::table('users', function (Blueprint $table) {
      $table->foreignId('tenant_id')->nullable()->constrained()->nullOnDelete(); // User may belong to a tenant // As owner / employee / driver / customer
    });

  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    // Drop foreign key from tenants.owner_id before dropping tenants table
    Schema::table('tenants', function (Blueprint $table) {
      if (Schema::hasColumn('tenants', 'owner_id')) {
        $table->dropForeign(['owner_id']);
      }
    });

    // Drop foreign key and column from users table
    Schema::table('users', function (Blueprint $table) {
      if (Schema::hasColumn('users', 'tenant_id')) {
        $table->dropForeign(['tenant_id']);
        $table->dropColumn('tenant_id');
      }
    });

    // Drop tenants table
    Schema::dropIfExists('tenants');
  }
};
