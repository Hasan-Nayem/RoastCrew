<?php

namespace App\Services\API;

use App\Models\Comment;
use App\Repositories\CommentRepository;

class CommentService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected CommentRepository $repository)
    {
        //
    }

    public function postExists(string $postId): bool
    {
        return $this->repository->postExists($postId);
    }

    public function getPostComments(string $postId)
    {
        return $this->repository->allByPost($postId);
    }

    public function getPostComment(string $postId, string $id): ?Comment
    {
        return $this->repository->findForPost($postId, $id);
    }

    public function create(string $postId, array $data): Comment
    {
        $data['post_id'] = $postId;
        $data['user_id'] = auth()->id();

        return $this->repository->create($data);
    }

    public function update(string $postId, string $id, array $data): ?Comment
    {
        return $this->repository->update($postId, $id, $data);
    }

    public function delete(string $postId, string $id): bool
    {
        return $this->repository->delete($postId, $id);
    }

    public function canModify(Comment $comment): bool
    {
        return (int) $comment->user_id === (int) auth()->id();
    }
}
