<?php

namespace App\Http\Requests\Block;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
class BlockUserRequest extends FormRequest
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
            // 'user_id' => 'required|exists:user,id',
            'blocked_user_id'  => 'required|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            // 'user_id.required' => 'User id is requried',
            // 'user_id.exists'      => 'User does not exists',
            'blocked_user_id.exists'   => 'User does not exists',
            'blocked_user_id.required'      => 'User id is requried',
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
