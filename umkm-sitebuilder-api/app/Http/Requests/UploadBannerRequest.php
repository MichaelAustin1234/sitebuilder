<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadBannerRequest extends FormRequest
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
            'banner' => [
                'required',
                'image',                      // harus berupa gambar
                'mimes:jpg,jpeg,png,webp',    // hanya format ini yang diterima
                'max:4096',                   // maksimal 4 MB (banner biasanya lebih besar)
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'banner.required' => 'File banner wajib diunggah.',
            'banner.image'    => 'File harus berupa gambar.',
            'banner.mimes'    => 'Format gambar harus JPG, PNG, atau WebP.',
            'banner.max'      => 'Ukuran banner maksimal 4 MB.',
        ];
    }
}

