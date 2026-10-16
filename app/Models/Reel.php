<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reel extends Model
{
    protected $fillable = [
        'user_id',
        'video',
        'thumbnail',
        'caption',
        'asset_id',
        'hashtags',
        'views',
        'likes',
        'comments',
        'shares',
        'status',
    ];

    protected $casts = [
        'hashtags' => 'array',
        'status'   => 'boolean',
    ];

    protected $appends = [
        'video_url',
        'thumbnail_url',
    ];

    public function getVideoUrlAttribute()
    {
        if (request()->is('api/*')) {
            return asset($this->video);
        }
        return $this->video;
    }

    public function getThumbnailUrlAttribute()
    {
        if (request()->is('api/*')) {
            return asset($this->thumbnail);
        }
        return $this->thumbnail;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reelLikes()
    {
        return $this->hasMany(ReelLike::class);
    }

    public function reelComments()
    {
        return $this->hasMany(ReelComment::class);
    }
}
