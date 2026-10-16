<?php

namespace App\Services\API;

use App\Concerns\ApiResponse;
use App\Repositories\BlockRepository;
use App\Repositories\FollowRepository;

class BlockService
{
    /**
     * Create a new class instance.
     */
    use ApiResponse;

    public function __construct(protected BlockRepository $repository, protected FollowRepository $followRepository)
    {
        //
    }

    public function getBlockedUsers($request){
        $userId = auth()->user()->id;
        
        $blockedUser = $this->repository->all($userId, $request->per_page);
        if(empty($blockedUser)){
            return $this->errorResponse('Blocked user fetched successfully', 404);
        }

        return $blockedUser;
    }

    public function blockUser($request){
        $userId = auth()->user()->id;
        $blockedUserId = $request->blocked_user_id;

        //First block the user
        $blockedUser = $this->repository->blockUser($userId, $blockedUserId);
        if(!$blockedUser){
            return $this->errorResponse('User is already blocked', 400);
        }
        if(empty($blockedUser)){
            return $this->errorResponse('Blocked user not found', 404);
        }

        //Check if the another user already blocked the authenticated user
        // $isBlockedByAnother = $this->repository->isUserBlocked($blockedUserId, $userId);
        // if($isBlockedByAnother){
        //     return $this->errorResponse('You are already blocked by this user', 404);
        // }

        //then unfollow the user if they are following each other
        $this->followRepository->unfollowUser($userId, $blockedUserId);
        //then remove the user from other users follow list 
        $this->followRepository->unfollowUser($blockedUserId, $userId);

        return $this->successResponse('User blocked successfully', $blockedUser, 200);
    }

    public function unblockUser($request){
        $userId = auth()->user()->id;
        $blockedUserId = $request->blocked_user_id;

        $unblockedUser = $this->repository->unblockUser($userId, $blockedUserId);
        if(!$unblockedUser){
            return $this->errorResponse('Unblocked user not found', 404);
        }

        return $this->successResponse('Unblocked user fetched successfully', $unblockedUser, 200);
    }

    public function isUserBlocked($request){
        $userId = auth()->user()->id;
        $blockedUserId = $request->blocked_user_id;

        $isBlocked = $this->repository->isUserBlocked($userId, $blockedUserId);
        if(!$isBlocked){
            return $this->errorResponse('User is not blocked', 404);
        }

        return $this->successResponse('User is blocked', ['is_blocked' => true], 200);
    }
}
