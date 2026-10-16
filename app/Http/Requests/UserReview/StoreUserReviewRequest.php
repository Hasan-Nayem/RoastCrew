<?php

namespace App\Http\Requests\UserReview;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreUserReviewRequest extends FormRequest
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
            'seller_id' => 'required|exists:users,id',
            'review' => 'nullable|string',
            'rating' => 'max:5|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'seller_id.required' => 'Invalid Seller ID is Required',
            'seller_id.exists' => 'Invalid Seller ID',
            'rating.max' => 'Rating cannot be below 1',
            'rating.min' => 'Rating cannot exceed 5',
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
