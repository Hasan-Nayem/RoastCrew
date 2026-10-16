<?php

namespace App\Http\Requests\Chat;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreChatMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'product_id' => 'nullable|exists:products,id',
            'message' => 'required_without:attachments|nullable|string',
            'attachments' => 'required_without:message|nullable|array',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf,docx,zip|max:10240',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Receiver ID is required',
            'user_id.exists' => 'Receiver not exist',
            'product_id.exists' => 'Product not exist',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'code' => 422,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
