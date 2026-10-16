<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostImage extends Model
{
    protected $fillable = [
        'post_id',
        'image',
    ];

    protected $appends = [
        'url'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];
    public function getUrlAttribute()
    {
        return $this->image ? asset($this->image) : null;
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
