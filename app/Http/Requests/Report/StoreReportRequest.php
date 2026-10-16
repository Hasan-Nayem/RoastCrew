<?php

namespace App\Http\Requests\Report;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
class StoreReportRequest extends FormRequest
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
            // 'reporter_id' => 'required|exists:users,id',
            'reported_user_id' => 'required|exists:users,id',
            'description' => 'sometimes|nullable|string',
            'status' => 'nullable|in:pending,resolved,declined',
            'reviewer_id' => 'nullable|exists:users,id',
            'reviewd_at' => 'sometimes|nullable|date',
            'admin_note' => 'sometimes|nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'reported_user_id.required' => 'The reported user ID is required.',
            'reported_user_id.exists' => 'The reported user ID must exist in the users table.',
            'description.string' => 'The description must be a string.',
            'status.in' => 'The status must be one of the following: pending, resolved, declined.',
            'reviewer_id.exists' => 'The reviewer ID must exist in the users table.',
            'reviewd_at.date' => 'The reviewed at field must be a valid date.',
            'admin_note.string' => 'The admin note must be a string.',
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
