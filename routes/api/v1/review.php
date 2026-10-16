<?php

use App\Http\Controllers\API\Product\ProductController;
use App\Http\Controllers\API\Review\UserReviewController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Product Routes (authenticated)
|--------------------------------------------------------------------------
*/

Route::controller(UserReviewController::class)->prefix('seller-review')->middleware(['auth:sanctum'])
    ->name('api.seller-review.')
    ->group(function () {
        Route::get('/{id}', 'index')->name('index');
        Route::post('/store', 'store')->name('store');
        Route::delete('/delete/{id}', 'destroy')->name('destroy');
    });


