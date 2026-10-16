<?php

namespace App\Services\API;

use App\Models\Chat;
use App\Repositories\ChatRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

class ChatService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected ChatRepository $repository)
    {
        //
    }

    public function chatList($request){
        $userId = auth()->user()->id;
        $search = $request->query('search');
        return $this->repository->getUserChatList($userId, $search, $request->per_page);
    }

    public function startChat(array $data)
    {
        $authUserId = auth()->id();
        $receiverId = $data['user_id'];
        $productId = $data['product_id'] ?? null; 

        if ($authUserId === (int)$receiverId) {
            throw new \Exception("You cannot start a chat with yourself.");
        }

        $existingChat = $this->repository->findExistingPrivateChat($authUserId, $receiverId);

        if ($existingChat) {
            return $existingChat; // return existed data if exist 
        }

        // create new if not exist
        return $this->repository->createPrivateChat($authUserId, $receiverId, $productId);
    }

    public function handleMessageSending(Chat $chat, array $data)
    {
        $userId = auth()->id();
        $filePaths = [];

        if (isset($data['attachments'])) {
            foreach ($data['attachments'] as $file) {
                //storage/app/public/uploads
                $path = $file->store('uploads/chat', 'public');
                $filePaths[] = $path;
            }
        }

        return $this->repository->createMessage($chat, $userId, $data['message'] ?? null, $filePaths);
    }

    public function startChatAndSendMessage(array $data): array
    {
        $chat = $this->startChat($data);
        $message = $this->handleMessageSending($chat, $data);

        return [
            'chat' => $chat,
            'message' => $message,
        ];
    }

    public function getMessagesForChat(Chat $chat, $request)
    {
        $userId = auth()->id();

        $isMember = $chat->chatMember()->where('user_id', $userId)->exists();

        if (!$isMember) {
            throw new AuthorizationException("You do not have permission to view this chat.");
        }

        return $this->repository->getChatMessages($chat, $userId, $request->per_page?? 20);
    }
}
