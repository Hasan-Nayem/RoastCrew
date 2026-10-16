<?php

namespace App\Repositories;

use App\Models\UserBlock;

class BlockRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function all($userId , $perPage = 10){
        $blockedUser = UserBlock::where('user_id', $userId)->with('blockedUser:id,first_name,last_name,email,avatar')->paginate($perPage);
        return $blockedUser;
    }

    public function blockUser(int $userId, int $blockedUserId){
        $exists = $this->isUserBlocked($userId, $blockedUserId);

        if ($exists) {
            return null; // User is already blocked
        }

        $blockedUser = UserBlock::create([
            'user_id' => $userId,
            'blocked_user_id' => $blockedUserId
        ]);

        return $blockedUser->load('blockedUser:id,first_name,last_name,email,avatar');
    }

    public function isUserBlocked(int $userId, int $blockedUserId): bool
    {
        return UserBlock::where('user_id', $userId)
            ->where('blocked_user_id', $blockedUserId)
            ->exists();
    }

    public function unblockUser(int $userId, int $blockedUserId): bool
    {
        return UserBlock::where('user_id', $userId)
            ->where('blocked_user_id', $blockedUserId)
            ->delete() > 0;
    }
}
