<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUmkmSiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // Semua field opsional pada update (PATCH semantics)
            'name'            => ['sometimes', 'string', 'max:100'],
            'description'     => ['nullable', 'string', 'max:1000'],
            'category'        => ['nullable', 'string', 'in:' . implode(',', StoreUmkmSiteRequest::CATEGORIES)],
            'phone_wa'        => ['nullable', 'string', 'regex:/^(\+62|62|0)8[1-9][0-9]{6,10}$/'],
            'address'         => ['nullable', 'string', 'max:500'],
            'logo_url'        => ['nullable', 'url', 'max:500'],
            'banner_url'      => ['nullable', 'url', 'max:500'],
            // Kustomisasi tema
            'primary_color'   => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'tagline'         => ['nullable', 'string', 'max:150'],
            'operating_hours' => ['nullable', 'string', 'max:200'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.max'             => 'Nama toko maksimal 100 karakter.',
            'category.in'          => 'Kategori tidak valid. Pilih: ' . implode(', ', StoreUmkmSiteRequest::CATEGORIES) . '.',
            'phone_wa.regex'       => 'Nomor WhatsApp harus format Indonesia (08xx, +62xx, atau 62xx).',
            'logo_url.url'         => 'Logo URL harus berupa URL yang valid.',
            'banner_url.url'       => 'Banner URL harus berupa URL yang valid.',
            'primary_color.regex'  => 'Warna harus dalam format hex 6 digit, contoh: #6366f1.',
            'tagline.max'          => 'Tagline maksimal 150 karakter.',
            'operating_hours.max'  => 'Jam operasional maksimal 200 karakter.',
        ];
    }
}
