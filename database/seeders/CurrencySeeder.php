<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Admin\Site\Currency;

class CurrencySeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $currencies = [
      // USD
      ['name' => 'الدولار الأمريكي', 'code' => 'USD'],

      // Arab Countries Currencies in Arabic
      ['name' => 'الريال السعودي', 'code' => 'SAR'],
      ['name' => 'درهم الإمارات العربية المتحدة', 'code' => 'AED'],
      ['name' => 'الدينار الكويتي', 'code' => 'KWD'],
      ['name' => 'الريال القطري', 'code' => 'QAR'],
      ['name' => 'الدينار البحريني', 'code' => 'BHD'],
      ['name' => 'الريال العماني', 'code' => 'OMR'],
      ['name' => 'الدينار الأردني', 'code' => 'JOD'],
      ['name' => 'الليرة اللبنانية', 'code' => 'LBP'],
      ['name' => 'الدينار العراقي', 'code' => 'IQD'],
      ['name' => 'الليرة السورية', 'code' => 'SYP'],
      ['name' => 'الجنيه المصري', 'code' => 'EGP'],
      ['name' => 'الجنيه السوداني', 'code' => 'SDG'],
      ['name' => 'الدينار الليبي', 'code' => 'LYD'],
      ['name' => 'الدينار التونسي', 'code' => 'TND'],
      ['name' => 'الدينار الجزائري', 'code' => 'DZD'],
      ['name' => 'الدرهم المغربي', 'code' => 'MAD'],
      ['name' => 'الأوقية الموريتانية', 'code' => 'MRU'],
      ['name' => 'الفرنك الجيبوتي', 'code' => 'DJF'],
      ['name' => 'الشلن الصومالي', 'code' => 'SOS'],
      ['name' => 'الريال اليمني', 'code' => 'YER'],
      ['name' => 'الدرهم الفلسطيني', 'code' => 'PAD'],
    ];
    
    Currency::insert($currencies);
  }
}
