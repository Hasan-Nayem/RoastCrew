<?php

namespace App\Http\Requests\Reels;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreReelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'video'    => ['required', 'file', 'mimes:mp4,mov,avi,mkv,webm', 'max:102400'], // max 100MB
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'caption'  => ['nullable', 'string', 'max:1000'],
            'hashtags' => ['nullable', 'array'],
            'hashtags.*' => ['string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'video.required'   => 'A video file is required.',
            'video.file'       => 'The uploaded file must be a valid video.',
            'video.mimes'      => 'Supported video formats: mp4, mov, avi, mkv, webm.',
            'video.max'        => 'The video may not be greater than 100 MB.',
            'thumbnail.image'  => 'The thumbnail must be an image.',
            'thumbnail.mimes'  => 'Supported thumbnail formats: jpeg, png, jpg, webp.',
            'thumbnail.max'    => 'The thumbnail may not be greater than 5 MB.',
            'caption.max'      => 'Caption may not exceed 1000 characters.',
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
