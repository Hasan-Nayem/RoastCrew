<?php

use App\Http\Controllers\API\Block\BlockController;
use App\Http\Controllers\API\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::controller(BlockController::class)->prefix('block')->middleware(['auth:sanctum'])->group(function () {
    // Route::get('/', 'index');
    Route::post('/block-user', 'blockUser');
    Route::post('/unblock-user', 'unblockUser');
    Route::post('/is-user-blocked', 'isUserBlocked');
    Route::get('/get-blocked-users', 'getBlockedUsers');
});
