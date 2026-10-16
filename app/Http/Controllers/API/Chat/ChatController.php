<?php

namespace App\Http\Controllers\API\Chat;

use App\Concerns\ApiResponse;
use App\Events\MessageEvent;
use App\Events\SendMessage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Chat\CreateChatRequest;
use App\Http\Requests\Chat\SendMessageRequest;
use App\Http\Requests\Chat\StoreChatMessageRequest;
use App\Models\Chat;
use App\Services\API\ChatService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    use ApiResponse;

    public function __construct(protected ChatService $service) {}

    public function all(Request $request)
    {
        $chatList = $this->service->chatList($request);
        // if($chatList->isEmpty()){
        //     return $this->successResponse('No chat found', $message);
        // }
        return $this->successResponse('Chat list retrieved', $chatList, 200);
    }

    public function create(CreateChatRequest $request)
    {
        try {
            $chat = $this->service->startChat($request->all());

            return $this->successResponse('Chat session initialized successfully', $chat, 200);
        } catch (\Exception $e) {

            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function sendMessage(SendMessageRequest $request, Chat $chat)
    {

        $message = $this->service->handleMessageSending($chat, $request->validated());

        broadcast(new MessageEvent($message, $chat->id))->toOthers();

        return $this->successResponse('Message dispatched successfully', $message, 201);
    }

    public function getMessages(Chat $chat, Request $request)
    {
        try {
            $messages = $this->service->getMessagesForChat($chat, $request);

            return $this->successResponse('Messages retrieved successfully', $messages, 200);
        } catch (AuthorizationException $e) {

            return $this->errorResponse($e->getMessage(), 403);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function messageWithProduct(StoreChatMessageRequest $request)
    {
        $result = $this->service->startChatAndSendMessage($request->validated());

        broadcast(new MessageEvent($result['message'], $result['message']->chat_id))->toOthers();

        return $this->successResponse('Message dispatched successfully', $result, 201);
    }
}
