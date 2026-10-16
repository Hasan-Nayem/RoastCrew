<?php

use App\Http\Controllers\API\Post\CommentController;
use App\Http\Controllers\API\Post\PostController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Product Routes (authenticated)
|--------------------------------------------------------------------------
*/

Route::controller(PostController::class)->prefix('post')->middleware(['auth:sanctum'])
    ->name('api.post.')
    ->group(function () {
        Route::get('/', 'index');
        Route::get('/show/{id}', 'show');
    });

/*
|--------------------------------------------------------------------------
| My Products Routes (authenticated owner actions)
|--------------------------------------------------------------------------
*/
Route::controller(PostController::class)->prefix('my-post')->middleware(['auth:sanctum'])->name('api.my-post.')->group(function () {
    Route::get('/', 'myPost');
    Route::post('/store', 'store');
    Route::patch('/update/{id}', 'update');
    Route::get('/show/{id}', 'show');
    Route::delete('/delete/{id}', 'destroy');
});

Route::post('post/{id}/toggle-like', [PostController::class, 'toggleLike'])->middleware(['auth:sanctum']);

/*
|--------------------------------------------------------------------------
| Post Comment Routes (authenticated)
|--------------------------------------------------------------------------
*/
Route::controller(CommentController::class)->prefix('post/{postId}/comments')->middleware(['auth:sanctum'])
    ->name('api.post.comments.')
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/store', 'store');
        Route::get('/show/{id}', 'show');
        Route::patch('/update/{id}', 'update');
        Route::delete('/delete/{id}', 'destroy');
    });
