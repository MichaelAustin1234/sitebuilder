<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUmkmSiteRequest extends FormRequest
{
    /** Kategori usaha yang diizinkan */
    public const CATEGORIES = [
        'kuliner', 'fashion', 'kecantikan', 'kesehatan',
        'elektronik', 'otomotif', 'pendidikan', 'jasa', 'lainnya',
    ];

    public function authorize(): bool
    {
        return true; // Guard dilakukan di route via auth:sanctum
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'category'    => ['nullable', 'string', 'in:' . implode(',', self::CATEGORIES)],
            'phone_wa'    => ['nullable', 'string', 'regex:/^(\+62|62|0)8[1-9][0-9]{6,10}$/'],
            'address'     => ['nullable', 'string', 'max:500'],
            'logo_url'    => ['nullable', 'url', 'max:500'],
            'banner_url'  => ['nullable', 'url', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required'  => 'Nama toko wajib diisi.',
            'name.max'       => 'Nama toko maksimal 100 karakter.',
            'category.in'    => 'Kategori tidak valid. Pilih: ' . implode(', ', self::CATEGORIES) . '.',
            'phone_wa.regex' => 'Nomor WhatsApp harus format Indonesia (08xx, +62xx, atau 62xx).',
            'logo_url.url'   => 'Logo URL harus berupa URL yang valid.',
            'banner_url.url' => 'Banner URL harus berupa URL yang valid.',
        ];
    }
}
