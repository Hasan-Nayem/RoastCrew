<?php

namespace App\Http\Controllers\Web\Backend\Post;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\User;
use App\Services\API\PostService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function __construct(protected PostService $service) {}

    public function index(Request $request)
    {
        $query = Post::with([
            'user',
            'reactions',
            'comments',
            'images',
        ]);

        if ($request->filled('publisher')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->where('first_name', 'like', '%' . $request->publisher . '%')
                        ->orWhere('last_name', 'like', '%' . $request->publisher . '%');
                });
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $posts = $query->latest()
            ->paginate($request->items ?? 15)
            ->through(function ($post) {
                $post->created_at_formatted = Carbon::parse($post->created_at)->format('d M Y, h:i A');
                $post->total_likes = $post->reactions->count();
                $post->total_comments = $post->comments->count();
                $post->image = $post->images[0] ?? '';
                return $post;
            })
            ->withQueryString();

        // dd($posts);


        return Inertia::render('backend/posts/index', [
            'posts' => $posts,
            'filters' => $request->only(['publisher', 'date_from', 'date_to']),
        ]);
    }

    public function show($id)
    {
        $post = Post::with(['user', 'images'])->findOrFail($id);
        return Inertia::render('backend/posts/show', ['post' => $post]);
    }

    public function edit($id)
    {
        $post = Post::with('images')->findOrFail($id);
        $users = User::select('id', 'first_name', 'last_name', 'email')->get();
        return Inertia::render('backend/posts/edit', [
            'post' => $post,
            'users' => $users
        ]);
    }

    public function update(Request $request, $id)
    {
        $post = $this->service->getPostById($id);

        if (!$post) {
            return redirect()->route('admin.posts.index')->with('error', 'Post not found.');
        }

        $data = $request->except('images');
        $data['existing_images'] = $request->input('existing_images', []);

        $this->service->update($id, $data, $request->file('images', []));
        
        return redirect()->route('admin.posts.index')->with('success', 'Post updated successfully.');
    }

    public function delete($id)
    {
        return $this->destroy($id);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();
        return redirect()->back();
    }
}
