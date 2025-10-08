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
      $table->string('name'); // Company name
      $table->string('slug')->unique(); // For custom URL like suqya.net/tenantname
      $table->foreignId('currency_id')->nullable()->constrained('currencies')->cascadeOnDelete();  //Owner of the tenant

      // QR Code
      $table->string('qr_code')->nullable(); // QR code image path for tenant URL
      $table->string('commercial_registration')->nullable(); //File Path
      $table->string('profession_license')->nullable(); //File Path

      // Contact Information
      $table->string('phone')->nullable();
      $table->string('whatsapp')->nullable(); // WhatsApp number
      $table->string('email')->nullable();
      $table->string('address')->nullable();

      // Location Details
      $table->string('country')->nullable();
      $table->string('city')->nullable();
      $table->string('area')->nullable(); // District/Area
      $table->string('full_address')->nullable(); // Complete address
      $table->decimal('latitude', 10, 8)->nullable(); // For location mapping
      $table->decimal('longitude', 11, 8)->nullable(); // For location mapping

      // Business Information
      $table->string('logo')->nullable(); // Company logo path

      $table->index(['slug']);
      $table->index(['country', 'city', 'area']);

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
