<?php

namespace App\Http\Controllers\API\Post;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StoreCommentRequest;
use App\Http\Requests\Post\UpdateCommentRequest;
use App\Services\API\CommentService;

class CommentController extends Controller
{
    use ApiResponse;

    public function __construct(protected CommentService $service)
    {
        
    }

    public function index(string $postId)
    {
        if (!$this->service->postExists($postId)) {
            return $this->errorResponse('Post not found', 404);
        }

        $comments = $this->service->getPostComments($postId);

        return $this->successResponse('Comments fetched successfully', $comments, 200);
    }

    public function store(StoreCommentRequest $request, string $postId)
    {
        if (!$this->service->postExists($postId)) {
            return $this->errorResponse('Post not found', 404);
        }

        $comment = $this->service->create($postId, $request->validated());

        return $this->successResponse('Comment created successfully', $comment, 201);
    }

    public function show(string $postId, string $id)
    {
        if (!$this->service->postExists($postId)) {
            return $this->errorResponse('Post not found', 404);
        }

        $comment = $this->service->getPostComment($postId, $id);

        if (!$comment) {
            return $this->errorResponse('Comment not found', 404);
        }

        return $this->successResponse('Comment fetched successfully', $comment, 200);
    }

    public function update(UpdateCommentRequest $request, string $postId, string $id)
    {
        if (!$this->service->postExists($postId)) {
            return $this->errorResponse('Post not found', 404);
        }

        $comment = $this->service->getPostComment($postId, $id);

        if (!$comment) {
            return $this->errorResponse('Comment not found', 404);
        }

        if (!$this->service->canModify($comment)) {
            return $this->errorResponse('You are not allowed to update this comment', 403);
        }

        $updatedComment = $this->service->update($postId, $id, $request->validated());

        return $this->successResponse('Comment updated successfully', $updatedComment, 200);
    }

    public function destroy(string $postId, string $id)
    {
        if (!$this->service->postExists($postId)) {
            return $this->errorResponse('Post not found', 404);
        }

        $comment = $this->service->getPostComment($postId, $id);

        if (!$comment) {
            return $this->errorResponse('Comment not found', 404);
        }

        if (!$this->service->canModify($comment)) {
            return $this->errorResponse('You are not allowed to delete this comment', 403);
        }

        $this->service->delete($postId, $id);

        return $this->successResponse('Comment deleted successfully');
    }
}
