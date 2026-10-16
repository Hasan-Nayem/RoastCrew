<?php

use App\Http\Controllers\API\Chat\ChatController;
use Illuminate\Support\Facades\Route;


Route::controller(ChatController::class)->prefix('chat')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/', 'all');
    Route::post('/create', 'create');
    Route::post('/send-message', 'messageWithProduct');
    Route::post('/{chat}/messages', 'sendMessage');
    Route::get('/{chat}/messages', 'getMessages'); //history
});
