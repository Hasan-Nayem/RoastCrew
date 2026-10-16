<?php

use App\Http\Controllers\API\Follow\FollowController;
use Illuminate\Support\Facades\Route;


Route::controller(FollowController::class)->prefix('follow')->middleware('auth:sanctum')->group(function () {
    Route::get('follower-list', 'getFollowers');
    Route::get('following-list', 'getFollowing');
    Route::post('{id}', 'followUser');
    Route::post('toggle/{id}', 'toggleFollow');
    Route::get('relationship-status/{id}', 'getRelationshipStatus');
    Route::post('unfollow/{id}', 'unfollowUser');
    Route::delete('delete/{id}', 'deleteFromFollowerList');
});
