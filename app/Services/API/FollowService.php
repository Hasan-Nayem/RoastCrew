<?php

namespace App\Services\API;

use App\Models\User;
use App\Repositories\BlockRepository;
use App\Repositories\FollowRepository;

class FollowService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected FollowRepository $repository, protected NotificationService $notificationService, protected BlockRepository $blockRepository)
    {
        //
    }

    public function follower($request)
    {
        $userId = auth()->user()->id;
        $perPage = $request->query('per_page', 20);
        $followerList = $this->repository->getFollowersList($userId, $request->search, $perPage);
        return $followerList;
    }

    public function following($request)
    {
        $userId = auth()->user()->id;
        $perPage = $request->query('per_page', 20);
        $followingList = $this->repository->getFollowingList($userId, $request->search, $perPage);
        return $followingList;
    }

    public function followUser($request)
    {
        $userId = auth()->id();
        $leaderId = $request->id;

        $leader = User::find($leaderId);

        if (!$leader) {
            return [
                'success' => false,
                'message' => 'User not found.',
            ];
        }

        if ($userId == $leaderId) {
            return [
                'success' => false,
                'message' => 'You cannot follow yourself.',
            ];
        }

        // Check block status
        if ($this->blockRepository->isUserBlocked($userId, $leaderId)) {
            return [
                'success' => false,
                'message' => "You've blocked this user.",
            ];
        }

        if ($this->blockRepository->isUserBlocked($leaderId, $userId)) {
            return [
                'success' => false,
                'message' => 'You cannot follow this user.',
            ];
        }

        // Toggle follow
        $existingFollow = $this->repository->findFollow($userId, $leaderId);

        if ($existingFollow) {
            $existingFollow->delete();

            return [
                'success' => true,
                'action'  => 'unfollow',
                'message' => 'User unfollowed successfully.',
            ];
        }

        $follow = $this->repository->follow($userId, $leaderId);

        $this->notificationService->notify($receiver = $leader, $actor = auth()->user(), 'follow_user', $follow);

        return [
            'success' => true,
            'action'  => 'follow',
            'message' => 'User followed successfully.',
            'data'    => $follow,
        ];
    }

    public function getRelationshipStatus(int $viewerId, int $profileId): array
    {
        return $this->repository->getRelationshipStatus($viewerId, $profileId);
    }

    public function unfollowUser(int $followerId, int $leaderId): bool
    {
        return $this->repository->unfollowUser($followerId, $leaderId);
    }
}
