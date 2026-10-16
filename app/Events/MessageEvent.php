<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $message;
    public int $chat_id;
    public string $timestamp;

    // public function __construct(string $body, string $sender, int $chatId)

    public function __construct($message, int $chatId)
    {

        $this->message = $message;
        $this->chat_id = $chatId;
        $this->timestamp = now()->toISOString();
        // Log::info($chatId);
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('chat.' . $this->chat_id),
        ];
    }
}
