<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadLogoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Auth dikontrol via middleware auth:sanctum di route
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'logo' => [
                'required',
                'image',                      // harus berupa gambar
                'mimes:jpg,jpeg,png,webp',    // hanya format ini yang diterima
                'max:2048',                   // maksimal 2 MB (dalam KB)
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'logo.required' => 'File logo wajib diunggah.',
            'logo.image'    => 'File harus berupa gambar.',
            'logo.mimes'    => 'Format gambar harus JPG, PNG, atau WebP.',
            'logo.max'      => 'Ukuran logo maksimal 2 MB.',
        ];
    }
}
