<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReelAd extends Model
{
    protected $fillable = [
        'title',
        'asset_id',
        'video_url',
        'thumbnail_url',
        'target_url',
        'status',
        'views',
        'clicks',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
}
