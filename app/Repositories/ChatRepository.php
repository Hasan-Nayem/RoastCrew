<?php

namespace App\Repositories;

use App\Models\Chat;
use App\Models\ChatMember;
use App\Models\ChatMessage;
use App\Models\UserBlock;
use Illuminate\Support\Facades\DB;

class ChatRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getUserChatList(String $userId, $search, int $perPage = 20){

        $list = Chat::whereHas('chatMember', function ($query) use ($userId){
             $query->where('user_id', $userId);
        })
        ->when($search, function ($query) use ($search, $userId) {
            $query->whereHas('chatMember.user', function ($subQuery) use ($search, $userId) {
            $subQuery->where('id', '!=', $userId)
                     ->where(function ($nameQuery) use ($search) {
                        $nameQuery->where('first_name', 'like', '%' . $search . '%')
                                ->orWhere('last_name', 'like', '%' . $search . '%');
                     });
            });
        })
        ->with([
             'otherMember' => function($query) use ($userId) {
                $query->where('user_id', '!=', $userId);
            },
            'otherMember.user' => function($query) use ($userId){
                $query->select(['id', 'first_name', 'last_name', 'avatar']);

            },
            // 'product',
            'latestChatMessage'
        ]) ->latest('updated_at') 
            ->paginate($perPage);

        $list->getCollection()->transform(function (Chat $chat) use ($userId) {
            $otherMember = $chat->otherMember;
            $otherUserId = $otherMember?->user_id;

            $chat->setAttribute('is_blocked_by_me', $otherUserId
                ? UserBlock::where('user_id', $userId)
                    ->where('blocked_user_id', $otherUserId)
                    ->exists()
                : false);

            $chat->setAttribute('is_blocked_by_other', $otherUserId
                ? UserBlock::where('user_id', $otherUserId)
                    ->where('blocked_user_id', $userId)
                    ->exists()
                : false);

            $chat->setAttribute('has_unread', $chat->chatMessages()
                ->where('user_id', '!=', $userId) 
                ->whereNull('read_at')           
                ->exists());       

            return $chat;
        });
        
        return $list;
            
    }

     public function findExistingPrivateChat(int $sender, int $receiver)
    {

        $chatIds = ChatMember::whereIn('user_id', [$sender, $receiver])
            ->groupBy('chat_id')

            ->havingRaw('COUNT(chat_id) = 2')
            ->pluck('chat_id');

        return Chat::whereIn('id', $chatIds)
            ->where('type', 'single')
            ->first();
    }

    public function createPrivateChat(int $creatorId, int $receiverId, ?int $productId = null)
    {
        return DB::transaction(function () use ($creatorId, $receiverId, $productId) {
            
            $chat = Chat::create([
                'creator_id' => $creatorId,
                'product_id' => $productId,
                'type' => 'single',
            ]);

            $chat->chatMember()->createMany([
                ['user_id' => $creatorId],
                ['user_id' => $receiverId],
            ]);

            return $chat;
        });
    }

        public function createMessage(Chat $chat, int $userId, ?string $content, array $uploadedFiles = [])
    {
        return DB::transaction(function () use ($chat, $userId, $content, $uploadedFiles) {
            
            // 1. Create the main text message shell
            $message = $chat->chatMessages()->create([
                'user_id' => $userId,
                'message' => $content,
            ]);

            foreach ($uploadedFiles as $filePath) {
                $message->attachments()->create([
                    'chat_id' => $chat->id,
                    'user_id' => $userId,
                    'attachment' => $filePath, 
                ]);
            }

            $chat->touch();

            return $message->load('attachments');
        });
    }

    public function getChatMessages(Chat $chat, int $userId, int $perPage = 20)
    {
        $chat->chatMessages()->where('user_id', '!=', $userId) 
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = $chat->chatMessages()
            ->with(['user:id,first_name,last_name,user_name,avatar', 'attachments'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $otherMember = $chat->otherMember;
        $otherUserId = $otherMember?->user_id;

        $payload = $messages->toArray();
        $payload['is_blocked_by_me'] = $otherUserId
            ? UserBlock::where('user_id', $userId)
                ->where('blocked_user_id', $otherUserId)
                ->exists()
            : false;
        $payload['is_blocked_by_other'] = $otherUserId
            ? UserBlock::where('user_id', $otherUserId)
                ->where('blocked_user_id', $userId)
                ->exists()
            : false;

        return $payload;
    }
}
