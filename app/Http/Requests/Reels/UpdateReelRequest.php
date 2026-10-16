<?php

namespace App\Http\Requests\Reels;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class UpdateReelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'thumbnail'  => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'caption'    => ['nullable', 'string', 'max:1000'],
            'hashtags'   => ['nullable', 'array'],
            'hashtags.*' => ['string', 'max:100'],
            'status'     => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'thumbnail.image'  => 'The thumbnail must be an image.',
            'thumbnail.mimes'  => 'Supported thumbnail formats: jpeg, png, jpg, webp.',
            'thumbnail.max'    => 'The thumbnail may not be greater than 5 MB.',
            'caption.max'      => 'Caption may not exceed 1000 characters.',
            'status.boolean'   => 'Status must be true or false.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'code'    => 422,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422)
        );
    }
}
