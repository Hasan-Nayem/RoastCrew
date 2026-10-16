<?php

namespace App\Http\Controllers\API\Post;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Models\Post;
use App\Services\API\NotificationService;
use App\Services\API\PostService;
use Illuminate\Http\Request;

class PostController extends Controller
{
    use ApiResponse;

    public function __construct(protected PostService $service, protected NotificationService $notificationService) {}

    public function index()
    {
        $posts = $this->service->getPosts();


        if (!$posts) {
            return $this->errorResponse('No post found');
        }
        return $this->successResponse('Data fetched successfully', $posts, 200);
    }

    public function show(String $id)
    {
        $post = $this->service->getPostById($id);
        return $this->successResponse("Post data retrieved successfully", $post, 200);
    }

    public function myPost(Request $request)
    {
        $paginate   = $request->per_page ?? $request->items;
        $serarch    = $request->search;
        $myPost = $this->service->myPost($paginate ?? 10, $serarch);
        return $this->successResponse('Data fetched successfully', $myPost, 200);
    }

    public function store(StorePostRequest $request)
    {
        $post = $this->service->create($request);
        return $this->successResponse('Post created successfully', $post, 200);
    }

    public function update(UpdatePostRequest $request, String $id)
    {
        $post = $this->service->getPostById($id);

        if (!$post) {
            return $this->errorResponse("Post not found", 404);
        }

        $updatePost = $this->service->update($id, $request->validated(), $request->file('images', []));


        return $this->successResponse('Post updated successfully', $updatePost, 200);
    }

    public function destroy(String $id)
    {
        $post = $this->service->getPostById($id);
        if (!$post) {
            return $this->errorResponse('Post not found', 404);
        }

        $this->service->delete($id);

        return $this->successResponse('Post deleted successfully');
    }

    public function toggleLike($id)
    {
        $post = Post::findOrFail($id);
        $user = auth()->user();

        $existingReaction = $post->reactions()->where('user_id', $user->id)->first();

        if ($existingReaction) {
            $existingReaction->delete();
            $liked = false;
            $message = 'Post unliked successfully';
        } else {
            $post->reactions()->create([
                'user_id' => $user->id,
                'type' => 'like'
            ]);
            $liked = true;
            $message = 'Post liked successfully';
            $this->notificationService->notify($receiver = $post->user, $actor = auth()->user(), "post_reacted", $post);
        }

        return $this->successResponse($message, [
            'is_liked' => $liked,
            'total_likes' => $post->reactions()->count()
        ], 200);
    }
}
