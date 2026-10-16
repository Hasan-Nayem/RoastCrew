<?php

namespace App\Http\Requests\Chat;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $chat = $this->route('chat');
        return $chat->chatMember()->where('user_id', auth()->id())->exists();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'message' => 'required_without:attachments|nullable|string',
            
            'attachments' => 'required_without:message|nullable|array',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf,docx,zip|max:10240', // 10MB limit per file
        ];
    }
}
