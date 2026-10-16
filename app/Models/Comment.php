<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'user_id',
        'post_id',
        'content',
    ];

    protected $hidden = [

    ];

    protected $appends = [
        'is_my_comment'
    ];

    public function getIsMyCommentAttribute(){
        return $this->user_id == auth()->id()? true : false;
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function post(){
        return $this->belongsTo(Post::class);
    }
}
