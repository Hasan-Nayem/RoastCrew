<?php

namespace App\Http\Requests\Post;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'            => ['required', 'string', 'max:255'],
            'descriptions'     => ['nullable', 'string'],
            'track_id'         => ['nullable', 'exists:tracks,id'],
            'address'          => ['nullable', 'string', 'max:255'],
            'distance'         => ['nullable', 'string', 'min:0'],
            'duration'         => ['nullable', 'string', 'min:0'],
            'pace'             => ['nullable', 'string', 'min:0'],
            'elevation'        => ['nullable', 'string', 'min:0'],
            // 'start_latitude'   => ['nullable', 'string', 'between:-90,90'],
            // 'start_longitude'  => ['nullable', 'string', 'between:-180,180'],
            // 'end_latitude'     => ['nullable', 'string', 'between:-90,90'],
            // 'end_longitude'    => ['nullable', 'string', 'between:-180,180'],
            'is_published'     => ['nullable', 'boolean'],
            'images'           => ['nullable', 'array'],
            'images.*'         => ['image', 'max:10240'], // max 2MB per image
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'          => 'The post title is required.',
            'title.max'               => 'The title may not be greater than 255 characters.',
            'track_id.exists'         => 'The selected track does not exist.',
            'distance.string'        => 'The distance must be a number.',
            'distance.min'            => 'The distance must be at least 0.',
            'duration.string'        => 'The duration must be a number.',
            'duration.min'            => 'The duration must be at least 0.',
            'pace.string'            => 'The pace must be a number.',
            'pace.min'                => 'The pace must be at least 0.',
            'elevation.string'       => 'The elevation must be a number.',
            'elevation.min'           => 'The elevation must be at least 0.',
            // 'start_latitude.required' => 'The start latitude is required.',
            'start_latitude.between'  => 'The start latitude must be between -90 and 90.',
            // 'start_longitude.required' => 'The start longitude is required.',
            'start_longitude.between' => 'The start longitude must be between -180 and 180.',
            // 'end_latitude.required'   => 'The end latitude is required.',
            'end_latitude.between'    => 'The end latitude must be between -90 and 90.',
            // 'end_longitude.required'  => 'The end longitude is required.',
            'end_longitude.between'   => 'The end longitude must be between -180 and 180.',
            'address.string'          => 'The address must be a string.',
            'address.max'             => 'The address may not be greater than 255 characters.',
            'is_published.boolean'    => 'The published status must be true or false.',
            'images.array'            => 'Images must be provided as an array.',
            'images.*.image'          => 'Each image must be a valid image file (jpeg, png, jpg, gif, svg, etc.).',
            'images.*.max'            => 'Each image may not be greater than 2 MB.',
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
