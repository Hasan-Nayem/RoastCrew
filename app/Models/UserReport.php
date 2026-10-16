<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserReport extends Model
{
    protected $fillable = [
        'reporter_id',
        'reported_user_id',
        'description',
        'status',
        'reviewer_id',
        'reviewd_at',
        'admin_note',
    ];

    protected $casts = [
        'status' => 'string',
        'reviewd_at' => 'datetime',
    ];

    public function getReviewdAtAttribute($value)
    {
        return $value ? \Carbon\Carbon::parse($value)->format('Y-m-d H:i:s') : 'Not reviewed yet';
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id', 'id');
    }

    public function reportedUser()
    {
        return $this->belongsTo(User::class, 'reported_user_id', 'id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id', 'id');
    }
}

