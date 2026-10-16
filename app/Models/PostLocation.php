<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostLocation extends Model
{
    protected $fillable = [
        "post_id",
        "point_order",
        "latitude",
        "longitude",
        "altitude",
        "recorded_at",
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
