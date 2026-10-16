<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = [
        'chat_id',
        'user_id',
        'message',
        'read_at'
    ];


    public function getCreatedAtAttribute($value)
    {
        $date = Carbon::parse($value);
        $now = Carbon::now();

        // 1. If it happened today, show "3 hours ago" or "20 minutes ago"
        if ($date->isToday()) {
            return $date->diffForHumans();
        }

        // 2. If it happened this week (but not today), show "Saturday 3:00 PM"
        if ($date->isCurrentWeek()) {
            return $date->isoFormat('dddd h:mm A'); 
        }

        // 3. If it exceeds 1 week, show full date and time "2026-07-07 13:00:00"
        return $date->format('Y-m-d H:i:s');
    }


    public function chat(){
        return $this->belongsTo(Chat::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function attachments() { 
        return $this->hasMany(MessageAttachment::class, 'message_id'); 
    }
}
