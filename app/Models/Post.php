<?php

namespace App\Models;

use App\Models\PostLocation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        // 'track_id',
        'title',
        'descriptions',
        'address',
        'distance',
        'duration',
        'pace',
        'elevation',
        'start_location',
        'start_latitude',
        'start_longitude',
        'end_location',
        'end_latitude',
        'end_longitude',
        'is_published',
    ];

    public function getCreatedAtAttribute($value)
    {
        if (!$value) {
            return "A long time ago";
        }
        if (request()->is('api/*')) {
            return  Carbon::parse($value)->calendar();
        }
        return $value;
    }

    public function getIsMineAttribute()
    {
        return $this->user_id == auth()->user()->id? true : false;
    }

    protected $appends = [
        'comment_count',
        'react_count',
        'is_liked',
        'is_mine'
    ];

    // public function track()
    // {
    //     return $this->belongsTo(Track::class);
    // }

    public function publisher()
    {
        return $this->belongsTo(User::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(PostImage::class);
    }

    public function latestImage()
    {
        return $this->hasOne(PostImage::class)->latestOfMany();
    }

    public function reactions()
    {
        return $this->hasMany(PostReaction::class);
    }

    public function getIsLikedAttribute()
    {
        return $this->reactions()->where('user_id', auth()->id())->exists();
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function getCommentCountAttribute()
    {
        return $this->comments()->count();   // <-- queries comments table
    }

    public function getReactCountAttribute()
    {
        return $this->reactions()->count();  // <-- queries post_reactions table
    }

    public function locations()
    {
        return $this->hasMany(PostLocation::class)->orderBy('point_order');
    }
}
