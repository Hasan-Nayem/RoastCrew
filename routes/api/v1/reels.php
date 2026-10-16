<?php

use App\Http\Controllers\API\Reels\ReelsApiController;
use Illuminate\Support\Facades\Route;

Route::controller(ReelsApiController::class)->prefix('reels')->middleware('auth:sanctum')->group(function () {
    // Route::post('/create-upload', 'createUpload');
    // Route::get('/mux/upload/{uploadId}', 'getUpload');
    // Route::post('/chunk-upload', 'chunkUpload');
    // Route::post('/mux/upload/chunk', 'uploadChunk');
    // Route::get('/mux/upload/chunk/{id}', 'showAsset');
    // Route::delete('/mux/delete/chunk/{id}', 'deleteChunkAsset');

    Route::get('/', 'index');
    Route::get('/my-list', 'mylist');
    Route::post('/store', 'store');
    Route::get('/show/{id}', 'show');
    Route::post('/update/{id}', 'update');
    Route::delete('/delete/{id}', 'delete');

    // Likes
    Route::post('/{id}/like', 'toggleLike');

    // Comments
    Route::get('/{id}/comments', 'comments');
    Route::post('/{id}/comments', 'addComment');
    Route::post('/{reelId}/comments/{commentId}/update', 'updateComment');
    Route::delete('/{reelId}/comments/{commentId}', 'deleteComment');

    // Views & Shares
    Route::post('/{id}/view', 'incrementView');
    Route::post('/{id}/share', 'share');
});
