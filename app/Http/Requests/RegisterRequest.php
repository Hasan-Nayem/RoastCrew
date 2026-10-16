<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
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
            "first_name"    => ['nullable', 'string', 'max:255'],
            "last_name"     => ['nullable', 'string', 'max:255'],
            'email'         => ['required', 'email'],
            'password'      => ['required', 'confirmed', 'min:8'],
            'phone'         => ['nullable', 'string', 'max:20'],
            'avatar'        => ['nullable'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'    => 'Email is required',
            'email.email'       => 'Email is invalid',
            'password.required' => 'Password is required',
            'password.confirmed'=> 'Password confirmation does not match',
            'password.min'      => 'Password must be at least 8 characters long',
        ];
    }

    public function failedValidation(Validator $validator){
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
