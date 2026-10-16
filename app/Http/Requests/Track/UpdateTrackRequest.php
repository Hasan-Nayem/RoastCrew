<?php

namespace App\Http\Requests\Track;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class UpdateTrackRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'distance' => 'required|numeric',
            'duration' => 'required|string|max:255',
            'pace' => 'required|string|max:255',
            'elevation' => 'required|numeric',
            'start_latitude' => 'required|numeric',
            'start_longitude' => 'required|numeric',
            'end_latitude' => 'required|numeric',
            'end_longitude' => 'required|numeric',
            'status' => 'required|boolean',
            'is_featured' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required',
            'images.array' => 'Images must be an array',
            'images.max' => 'You can upload up to 5 images',
            'images.*.image' => 'Each file must be an image',
            'images.*.mimes' => 'Each image must be a jpeg, png, jpg, gif, or webp',
            'images.*.max' => 'Each image must be less than 2MB',
            'distance.required' => 'Distance is required',
            'duration.required' => 'Duration is required',
            'pace.required' => 'Pace is required',
            'elevation.required' => 'Elevation is required',
            'start_latitude.required' => 'Start latitude is required',
            'start_longitude.required' => 'Start longitude is required',
            'end_latitude.required' => 'End latitude is required',
            'end_longitude.required' => 'End longitude is required',
            'status.required' => 'Status is required',
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
