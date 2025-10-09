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
    Schema::table('tenants', function (Blueprint $table) {
      $table->string('favicon')->nullable()->after('logo');
      $table->string('welcome_message_title')->nullable()->after('favicon');
      $table->string('welcome_message_desc')->nullable()->after('welcome_message_title');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('tenants', function (Blueprint $table) {
      //
    });
  }
};
