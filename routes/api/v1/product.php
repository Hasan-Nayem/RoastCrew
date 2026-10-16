<?php

use App\Http\Controllers\API\Product\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Product Routes (authenticated)
|--------------------------------------------------------------------------
*/
Route::controller(ProductController::class)->prefix('products')->middleware(['auth:sanctum'])
    ->name('api.products.')
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/show/{id}', 'show')->name('show');
    });

/*
|--------------------------------------------------------------------------
| My Products Routes (authenticated owner actions)
|--------------------------------------------------------------------------
*/
Route::controller(ProductController::class)->prefix('my-products')->middleware(['auth:sanctum'])
    ->name('api.my-products.')
    ->group(function () {
        Route::get('/', 'myProducts')->name('index');
        Route::post('/store', 'store')->name('store');
        Route::put('/update/{id}', 'update')->name('update');
        Route::delete('/delete/{id}', 'destroy')->name('destroy');
    });

Route::get('/category', [ProductController::class, 'productCategory']);
Route::get('/categorized-product/{id}', [ProductController::class, 'categorizedProduct']);
