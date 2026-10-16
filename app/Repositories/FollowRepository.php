<?php

namespace App\Repositories;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Pagination\LengthAwarePaginator;

class FollowRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getFollowersList(string $id, ?string $search = null, int $perPage = 20)
    {
        $user = User::find($id);

        if (! $user) {
            return collect();
        }

        $query = $this->withRelationshipStatus(
            $user->followers()->select('users.*'),
            auth()->id() ?? (int) $id
        )
            ->latest('follows.created_at');

        if (! empty($search)) {
            $query->where(function ($query) use ($search) {
                $term = '%' . trim($search) . '%';

                $query->where('users.first_name', 'like', $term)
                    ->orWhere('users.last_name', 'like', $term);
            });
        }

        return $this->paginateWithMutualStatus($query, $perPage);
    }

    public function getFollowingList(string $id, ?string $search = null, int $perPage = 20)
    {
        $user = User::find($id);

        if (! $user) {
            return collect();
        }

        $query = $this->withRelationshipStatus(
            $user->following()->select('users.*'),
            auth()->id() ?? (int) $id
        )
            ->latest('follows.created_at');

        if (! empty($search)) {
            $query->where(function ($query) use ($search) {
                $term = '%' . trim($search) . '%';

                $query->where('users.first_name', 'like', $term)
                    ->orWhere('users.last_name', 'like', $term);
            });
        }

        return $this->paginateWithMutualStatus($query, $perPage);
    }

    public function follow(int $userId, int $leaderId): Follow|false
    {
        if (
            Follow::where('leader_id', $leaderId)
            ->where('follower_id', $userId)
            ->exists()
        ) {
            return false;
        }

        return Follow::create([
            'leader_id' => $leaderId,
            'follower_id' => $userId,
        ]);
    }

    public function getRelationshipStatus(int $viewerId, int $profileId): array
    {
        $isFollowing = Follow::where('leader_id', $profileId)
            ->where('follower_id', $viewerId)
            ->exists();

        $isFollowedBy = Follow::where('leader_id', $viewerId)
            ->where('follower_id', $profileId)
            ->exists();

        return [
            'is_following' => $isFollowing,
            'is_followed_by' => $isFollowedBy,
            'is_mutual' => $isFollowing && $isFollowedBy,
        ];
    }

    public function unfollowUser(int $followerId, int $leaderId): bool
    {
        return Follow::where('follower_id', $followerId)
            ->where('leader_id', $leaderId)
            ->delete() > 0;
    }

    private function withRelationshipStatus(BelongsToMany $query, int $viewerId): BelongsToMany
    {
        return $query->addSelect([
            'is_following' => Follow::query()
                ->selectRaw('COUNT(*)')
                ->whereColumn('leader_id', 'users.id')
                ->where('follower_id', $viewerId),
            'is_followed_by' => Follow::query()
                ->selectRaw('COUNT(*)')
                ->where('leader_id', $viewerId)
                ->whereColumn('follower_id', 'users.id'),
        ]);
    }

    private function paginateWithMutualStatus(BelongsToMany $query, int $perPage): LengthAwarePaginator
    {
        $paginator = $query->paginate($perPage);

        $paginator->getCollection()->each(function (User $user): void {
            $user->setAttribute(
                'is_mutual',
                $user->is_following && $user->is_followed_by
            );
        });

        return $paginator;
    }

    public function findFollow(int $followerId, int $leaderId)
    {
        return Follow::where('follower_id', $followerId)
            ->where('leader_id', $leaderId)
            ->first();
    }
}
