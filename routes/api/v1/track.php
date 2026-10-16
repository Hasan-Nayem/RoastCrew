<?php

use App\Http\Controllers\API\Track\TrackController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'track'], function(){
    Route::get('/', [TrackController::class, 'index']);
    Route::get('/show/{id}', [TrackController::class, 'show']);
});