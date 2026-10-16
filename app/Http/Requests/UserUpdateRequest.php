<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
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
            'first_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'last_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'email' => [
                'nullable',
                'email',
                Rule::unique('users', 'email')
                    ->ignore($this->user()->id),
            ],

            'phone' => [
                'nullable',
            ],

            'date_of_birth' => [
                'nullable',
                'date',
                'before:today',
            ],
            
            'gender' => [
                'nullable',
                'string',
                'in:male,female,other,Male,Female,Other',
            ],

            'address' => [
                'nullable',
                'string',
                'max:255',
            ],

            'longitude' => [
                'nullable',
                'numeric',
                'between:-180,180',
            ],

            'latitude' => [
                'nullable',
                'numeric',
                'between:-90,90',
            ],

            'city' => [
                'nullable',
                'string',
                'max:255',
            ],

            'state' => [
                'nullable',
                'string',
                'max:255',
            ],

            'avatar' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
            ],

            'user_name' => [
                'nullable'
            ],
            'bio' => [
                'nullable'
            ],

        ];
    }
}
