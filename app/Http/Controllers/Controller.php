<?php

namespace App\Http\Controllers;

abstract class Controller
{
  /**
   * Add sequential row numbers to paginated collection
   */
  protected function addRowNumbers($paginatedCollection)
  {
    $paginatedCollection->getCollection()->transform(function ($item, $key) use ($paginatedCollection) {
      $item->row_number = ($paginatedCollection->perPage() * ($paginatedCollection->currentPage() - 1)) + $key + 1;
      return $item;
    });

    return $paginatedCollection;
  }
}
