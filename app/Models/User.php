<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

// #[Fillable(['name', 'email', 'password'])]
// #[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable, HasApiTokens;

    protected $fillable = [
        'name',
        "first_name",
        "last_name",
        "bio",
        "user_name",
        'email',
        'password',
        'provider_id',
        'avatar',
        'role',
        'email_verified_at',
        'remember_token',
        'phone',
        'date_of_birth',
        'destroy',
        'address',
        'city',
        'state',
        'gender',
        "email_notifications",
        "push_notifications",
        "sms_notifications",
        "match_notifications",
        "message_notifications",
        "like_notifications",
        "marketing_notifications",
        'status',
    ];

    protected $hidden = ['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
            'sms_notifications' => 'boolean',
            'match_notifications' => 'boolean',
            'message_notifications' => 'boolean',
            'like_notifications' => 'boolean',
            'marketing_notifications' => 'boolean',
            'is_following' => 'boolean',
            'is_followed_by' => 'boolean',
            'is_mutual' => 'boolean',
        ];
    }

    protected $appends = ['is_profile_completed'];

    public function getIsProfileCompletedAttribute(): bool
    {
        return (bool)($this->first_name && $this->last_name && $this->gender);
    }

    public function getAvatarAttribute($value)
    {
        if (!$value) {
            return null;
        }
        if (request()->is('api/*')) {
            return asset($value);
        }
        return $value;
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function posts()
    {
        return $this->hasmany(Post::class);
    }

    public function reactedPosts()
    {
        return $this->belongsToMany(Post::class, 'post_reactions');
    }

    public function receivedReactions()
    {
        return $this->hasManyThrough(PostReaction::class, Post::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function chat()
    {
        return $this->hasMany(Chat::class, 'creator_id', 'id');
    }

    public function createdChats()
    {
        return $this->hasMany(Chat::class, 'creator_id');
    }

    public function chats()
    {
        return $this->belongsToMany(Chat::class, 'chat_members', 'user_id', 'chat_id')->withTimestamps();
    }

    // Following
    public function following()
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'leader_id');
    }

    // Follower
    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'leader_id', 'follower_id');
    }

    public function sellerReviews()
    {
        return $this->hasMany(UserReview::class, 'seller_id');
    }
}
