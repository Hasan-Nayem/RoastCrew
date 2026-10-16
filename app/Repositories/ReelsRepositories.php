<?php

namespace App\Repositories;

use App\Models\Reel;
use App\Models\ReelComment;
use App\Models\ReelLike;
use App\Models\UserBlock;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ReelsRepositories
{
    protected $authId;

    public function __construct()
    {
        $this->authId = Auth::id();
    }

    public function adminList($items = 10, $search = null)
    {
        $query = Reel::with(['user:id,first_name,last_name,avatar'])->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('caption', 'like', '%' . $search . '%')
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('first_name', 'like', '%' . $search . '%')
                            ->orWhere('last_name', 'like', '%' . $search . '%')
                            ->orWhereRaw('SOUNDEX(first_name) = SOUNDEX(?)', [$search])
                            ->orWhereRaw('SOUNDEX(last_name) = SOUNDEX(?)', [$search]);
                    });
            });
        }

        return $query->paginate($items);
    }

    public function list($order, $items = 10)
    {
        $blockedUserIds = UserBlock::query()->select('blocked_user_id')->where('user_id', $this->authId);

        $blockingUserIds = UserBlock::query()->select('user_id')->where('blocked_user_id', $this->authId);

        $query = Reel::with([
            'user:id,first_name,last_name,avatar',
            'reelComments.user:id,first_name,last_name,avatar',
            'reelLikes',
        ])
            ->where('status', true)
            ->where('user_id', '!=', $this->authId)
            ->whereNotIn('user_id', $blockedUserIds)
            ->whereNotIn('user_id', $blockingUserIds);

        switch ($order) {
            case 'oldest':
                $query->oldest();
                break;

            case 'popular':
                $query->orderByDesc('views');
                break;

            case 'most_liked':
                $query->orderByDesc('likes');
                break;

            default:
                $query->latest();
                break;
        }

        // return $query->paginate($items);
        return $query->get();
    }

    public function mylist($order, $items)
    {
        $query = Reel::with([
            'user:id,first_name,last_name,avatar',
            'reelComments.user:id,first_name,last_name,avatar',
            'reelLikes',
        ])
            ->where('status', true)
            ->where('user_id', '=', $this->authId);

        switch ($order) {
            case 'oldest':
                $query->oldest();
                break;

            case 'popular':
                $query->orderByDesc('views');
                break;

            case 'most_liked':
                $query->orderByDesc('likes');
                break;

            default:
                $query->latest();
                break;
        }

        return $query->paginate($items);
    }

    public function findById($id): ?Reel
    {
        return Reel::with([
            'user:id,first_name,last_name,avatar',
            'reelComments.user:id,first_name,last_name,avatar',
            'reelLikes',
        ])->find($id);
    }

    public function create(array $data): Reel
    {
        return Reel::create($data);
    }

    public function update($id, array $data): ?Reel
    {
        $reel = Reel::find($id);

        if (! $reel) {
            return null;
        }

        $reel->update($data);

        return $reel->refresh()->load('user:id,first_name,last_name,avatar');
    }

    public function delete($id): bool
    {
        $reel = Reel::find($id);

        if (! $reel) {
            return false;
        }

        // Delete video and thumbnail from storage
        if ($reel->video) {
            Storage::disk('public')->delete($reel->video);
        }
        if ($reel->thumbnail) {
            Storage::disk('public')->delete($reel->thumbnail);
        }

        return (bool) $reel->delete();
    }

    /**
     * Toggle like: returns ['liked' => bool, 'likes_count' => int].
     */
    public function toggleLike(int $userId, int $reelId): ?array
    {
        $reel = Reel::find($reelId);

        if (! $reel) {
            return null;
        }

        $existing = ReelLike::where('user_id', $userId)
            ->where('reel_id', $reelId)
            ->first();

        if ($existing) {
            $existing->delete();
            $reel->decrement('likes');

            return ['liked' => false, 'likes_count' => $reel->fresh()->likes];
        }

        ReelLike::create(['user_id' => $userId, 'reel_id' => $reelId]);
        $reel->increment('likes');

        return ['liked' => true, 'likes_count' => $reel->fresh()->likes];
    }

    public function addComment(int $reelId, int $userId, string $comment): ?ReelComment
    {
        $reel = Reel::find($reelId);

        if (! $reel) {
            return null;
        }

        $newComment = ReelComment::create([
            'reel_id' => $reelId,
            'user_id' => $userId,
            'comment' => $comment,
        ]);

        $reel->increment('comments');

        return $newComment->load('user:id,first_name,last_name,avatar');
    }

    public function getComments(int $reelId)
    {
        $reel = Reel::find($reelId);

        if (! $reel) {
            return null;
        }

        return ReelComment::where('reel_id', $reelId)
            ->with('user:id,first_name,last_name,avatar')
            ->latest()
            ->get();
    }

    public function deleteComment(int $reelId, int $commentId, int $userId): bool
    {
        $comment = ReelComment::where('id', $commentId)
            ->where('reel_id', $reelId)
            ->where('user_id', $userId)
            ->first();

        if (! $comment) {
            return false;
        }

        $comment->delete();

        $reel = Reel::find($reelId);
        if ($reel && $reel->comments > 0) {
            $reel->decrement('comments');
        }

        return true;
    }

    public function incrementView(int $reelId): ?Reel
    {
        $reel = Reel::find($reelId);

        if (! $reel) {
            return null;
        }

        $reel->increment('views');

        return $reel->fresh();
    }

    public function incrementShare(int $reelId): ?Reel
    {
        $reel = Reel::find($reelId);

        if (! $reel) {
            return null;
        }

        $reel->increment('shares');

        return $reel->fresh();
    }
}
