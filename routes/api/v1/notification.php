<?php

use App\Http\Controllers\API\Chat\ChatController;
use App\Http\Controllers\Notification\NotificationController;
use Illuminate\Support\Facades\Route;


Route::controller(NotificationController::class)->prefix('notifications')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/', 'index'); // Pointed to index to get all notifications
    Route::get('/unread', 'unreadNotifications'); // Fixed typo
    Route::get('/unread/count', 'unreadCount'); // Cleaner URI structure
    Route::get('/mark-all-as-read', 'markAllAsRead');
    Route::get('/{id}/mark-as-read', 'markAsRead'); // Added {id} parameter
});

