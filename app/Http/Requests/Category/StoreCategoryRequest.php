<?php

namespace App\Http\Requests\Category;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
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
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5048',
            'status'      => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Category name is required',
            'name.max'      => 'Name cannot exceed 255 characters',
            'slug.max'      => 'Slug cannot exceed 255 characters',
            'image.image'   => 'Image must be an image file',
            'image.mimes'   => 'Image must be a JPEG, PNG, JPG, GIF or SVG file',
            'status.required' => 'Status is required',
            'image.max' => 'Image must not exceed 2MB',
        ];
    }
}
