<?php

namespace App\Repositories;

use App\Models\Comment;
use App\Models\Post;

class CommentRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function postExists(string $postId): bool
    {
        return Post::whereKey($postId)->exists();
    }

    public function allByPost(string $postId)
    {
        return Comment::with('user:id,first_name,last_name,user_name,avatar,created_at')
            ->where('post_id', $postId)
            ->latest()
            ->get();
    }

    public function findForPost(string $postId, string $id): ?Comment
    {
        return Comment::with('user:id,first_name,last_name,user_name,avatar,created_at')
            ->where('post_id', $postId)
            ->find($id);
    }

    public function create(array $data): Comment
    {
        $comment = Comment::create($data);

        return $comment->load('user:id,first_name,last_name,user_name,avatar,created_at');
    }

    public function update(string $postId, string $id, array $data): ?Comment
    {
        $comment = $this->findForPost($postId, $id);

        if (!$comment) {
            return null;
        }

        $comment->update($data);

        return $comment->load('user:id,first_name,last_name,user_name,avatar,created_at');
    }

    public function delete(string $postId, string $id): bool
    {
        $comment = $this->findForPost($postId, $id);

        if (!$comment) {
            return false;
        }

        return (bool) $comment->delete();
    }
}
