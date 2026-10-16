<?php

namespace App\Http\Controllers\Notification;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

     // Fetches all notifications (read and unread) with pagination
    public function index(Request $request)
    {
        $notifications = auth()->user()->notifications()->paginate(15);
        //mark as read all notification when fetched 
        auth()->user()->unreadNotifications->markAsRead();
        return $this->successResponse('Data fetched successfully', $notifications, 200);    
    }

    // Fetches only unread notifications
    public function unreadNotifications()
    {
        $unreadNotifications = auth()->user()->unreadNotifications()->get();
        return $this->successResponse('Notifications retrieved successfully', $unreadNotifications, 200);
    }

    // Returns the total integer count of unread items
    public function unreadCount()
    {
        $unreadCount = auth()->user()->unreadNotifications()->count();
        return $this->successResponse('Unread notifications count fetched successfully', ['unread_count' => $unreadCount], 200);
    }

    // Marks a specific notification as read using the URL parameter
    public function markAsRead(Request $request, string $id)
    {
        $notification = auth()->user()->unreadNotifications()->where('id', $id)->first();
        
        if (!$notification) {
            return $this->errorResponse('Notification not found or already read', 404);
        }
        
        $notification->markAsRead();
        return $this->successResponse('Notification marked as read successfully', null, 200);
    }

    // Marks all user notifications as read at once
    public function markAllAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        return $this->successResponse('All notifications marked as read successfully', null, 200);
    }
}
