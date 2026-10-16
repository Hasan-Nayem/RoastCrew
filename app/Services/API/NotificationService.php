<?php

namespace App\Services\API;

use App\Notifications\SocialNotification;

class NotificationService
{
    /**
     * Create a new class instance.
     */
    protected $payload = [];

    public function __construct()
    {
        //
    }

    public function notify($reciever, $actor, $type, $resource){
        $message = $this->messagebuilder($type, $actor);
        $this->payload = [
            'type' => $type,
            'actor_id' => $actor->id,
            'actor_name' => $actor->first_name . ' ' . $actor->last_name,
            'actor_avatar' => $actor->avatar,
            'title' => $this->titlebuilder($type),
            'message' => $message,
            'resource' => $resource
        ];

        $reciever->notify(new SocialNotification($this->payload));
    }

    public function messagebuilder($type, $actor){
        switch ($type) {
            case 'post_reacted':
                return $actor->first_name . ' ' . $actor->last_name . ' reacted to your post';
                break;

            case 'post_commented':
                return $actor->first_name . ' ' . $actor->last_name . ' commented on your post';
                break;
            
            case 'reels_reacted':
                return $actor->first_name . ' ' . $actor->last_name . ' reacted to your reels';
                break;

            case 'reels_commented':
                return $actor->first_name . ' ' . $actor->last_name . ' commented on your reels';
                break;

            case 'follow_user':
                return $actor->first_name . ' ' . $actor->last_name . ' has started following you';
                break;
            
            case 'report_created':
                return $actor->first_name . ' ' . $actor->last_name . ' has created a report';
                break;
            
            default:
                return '';
                break;
        }
    }
    
    public function titlebuilder($type){
        switch ($type) {
            case 'post_reacted':
                return 'New Reaction on Your Post';
                break;

            case 'post_commented':
                return 'New Comment on Post';
                break;
            
            case 'reels_reacted':
                return 'New Reaction on Your Reels';
                break;

            case 'reels_commented':
                return 'New Comment on Reels';
                break;

            case 'follow_user':
                return 'New Follower';
                break;
            
            case 'report_created':
                return 'Report Created';
                break;
            
            default:
                return '';
                break;
        }
    }
}
