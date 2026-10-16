<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackImage extends Model
{
    protected $fillable = [
        'track_id',
        'image',
    ];

    protected $appends = [
        'url'
    ];

    public function getUrlAttribute()
    {
        return $this->image ? asset($this->image) : null;
    }

    public function track()
    {
        return $this->belongsTo(Track::class);
    }
}
