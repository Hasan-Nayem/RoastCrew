<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Track extends Model
{
    protected $fillable = [
        'title',
        'description',
        'address',
        'distance',
        'duration',
        'pace',
        'elevation',
        'start_latitude',
        'start_longitude',
        'end_latitude',
        'end_longitude',
        'status',
        'is_featured',
    ];

    public function images()
    {
        return $this->hasMany(TrackImage::class);
    }
}
