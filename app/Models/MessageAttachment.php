<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageAttachment extends Model
{
    protected $fillable = [
        'chat_id',
        'user_id',
        'message_id',
        'attachment',
    ];
    
    protected $appends = [

    ];

    public function getAttachmentAttribute($value)
    {
        if (request()->is('api/*') && !empty($value)) {
            return asset('storage/'.$value);
        }
        return $value;
    }

    public function chat(){
        return $this->belongsTo(Chat::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function message(){
        return $this->belongsTo(ChatMessage::class, 'message_id', 'id');
    }

    // public function getAttachmentUrlAttribute(){
    //     return $this->attachment? asset('storage/'.$this->attachment) : null;
    // }
}
