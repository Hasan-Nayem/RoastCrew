<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('v1')->group(function () {
    require base_path('routes/api/v1/auth.php');
    require base_path('routes/api/v1/user.php');
    require base_path('routes/api/v1/product.php');
    require base_path('routes/api/v1/track.php');
    require base_path('routes/api/v1/post.php');
    require base_path('routes/api/v1/chat.php');
    require base_path('routes/api/v1/follow.php');
    require base_path('routes/api/v1/settings.php');
    require base_path('routes/api/v1/notification.php');
    require base_path('routes/api/v1/block.php');
    require base_path('routes/api/v1/report.php');
    require base_path('routes/api/v1/reels.php');
    require base_path('routes/api/v1/review.php');
});
