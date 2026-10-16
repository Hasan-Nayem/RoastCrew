<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use function PHPUnit\Framework\isEmpty;

class Chat extends Model
{
    protected $fillable = [
        'creator_id',
        'product_id',
        'title',
        'image',
        'type',
    ];

    protected $casts = [
        'is_blocked_by_me' => 'boolean',
        'is_blocked_by_other' => 'boolean',
    ];

    protected $appends = [
        'image_url',
    ];

    public function getImageUrlAttribute(){
        return $this->image? asset($this->image): null;
    }

    public function user(){
        return $this->belongsTo(User::class, 'creator_id', 'id');
    }

    public function product(){
        return $this->belongsTo(Product::class);
    }

    public function chatMember(){
        return $this->hasMany(ChatMember::class);
    }

    public function otherMember() {
        return $this->hasOne(ChatMember::class);
    }

    public function chatMessages(){
        return $this->hasMany(ChatMessage::class);
    }

    public function latestChatMessage(){
        return $this->hasOne(ChatMessage::class)->latestOfMany('created_at') 
        ->withDefault([
            'message' => 'Start a new conversation', 
            'id' => null
        ]);
    }

    public function getIsBlockedByMeAttribute(): bool
    {
        return (bool)($this->attributes['is_blocked_by_me'] ?? false);
    }

    public function getIsBlockedByOtherAttribute(): bool
    {
        return (bool)($this->attributes['is_blocked_by_other'] ?? false);
    }

    
}
