<?php

namespace App\Http\Controllers\API\Follow;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\API\FollowService;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    use ApiResponse;

    public function __construct(protected FollowService $service) {}



    public function followUser(Request $request)
    {
        return $this->service->followUser($request);
    }

    public function toggleFollow(Request $request)
    {
        return $this->service->toggleFollowUser($request);
    }


    public function unfollowUser(Request $request, $leaderId)
    {
        $followerId = auth()->id();
        $unfollowed = $this->service->unfollowUser($followerId, $leaderId);

        if (!$unfollowed) {
            return $this->errorResponse('You are not following this user', 400);
        }

        return $this->successResponse('Unfollowed successfully', null, 200);
    }

    public function getRelationshipStatus(Request $request, $profileId)
    {
        $viewerId = auth()->id();
        $relationshipStatus = $this->service->getRelationshipStatus($viewerId, $profileId);

        return $this->successResponse('Relationship status fetched successfully', $relationshipStatus, 200);
    }

    public function getFollowers(Request $request)
    {
        $follower = $this->service->follower($request);

        return $this->successResponse('Follower list fetched successfully', $follower, 200);
    }

    public function getFollowing(Request $request)
    {
        $following = $this->service->following($request);

        return $this->successResponse('Following list fetched successfully', $following, 200);
    }


    public function deleteFromFollowerList($id)
    {
        $leaderId = auth()->id();
        $unfollowed = $this->service->unfollowUser($id, $leaderId);

        if (!$unfollowed) {
            return $this->errorResponse('This user is not following you', 400);
        }
        return $this->successResponse('User deleted from follower list successfully', null, 200);
    }
}
