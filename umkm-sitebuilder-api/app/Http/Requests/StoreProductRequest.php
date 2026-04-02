<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Otorisasi dikontrol via Policy di controller
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'price'       => ['required', 'numeric', 'min:0', 'max:999999999.99'],
            'stock'       => ['required', 'integer', 'min:0'],
            'category'    => ['required', 'string', 'in:makanan,minuman,pakaian,aksesoris,kecantikan,kesehatan,elektronik,rumah_tangga,otomotif,olahraga,pendidikan,lainnya'],
            'image_url'   => ['nullable', 'url', 'max:500'],
            'is_active'   => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required'     => 'Nama produk wajib diisi.',
            'name.max'          => 'Nama produk maksimal 255 karakter.',
            'price.required'    => 'Harga produk wajib diisi.',
            'price.numeric'     => 'Harga harus berupa angka.',
            'price.min'         => 'Harga tidak boleh negatif.',
            'price.max'         => 'Harga maksimal Rp 999.999.999.',
            'stock.required'    => 'Stok produk wajib diisi.',
            'stock.integer'     => 'Stok harus berupa bilangan bulat.',
            'stock.min'         => 'Stok tidak boleh negatif.',
            'category.required' => 'Kategori produk wajib dipilih.',
            'category.in'       => 'Kategori produk tidak valid.',
            'image_url.url'     => 'URL gambar tidak valid.',
            'is_active.boolean' => 'Status aktif harus berupa true atau false.',
        ];
    }
}
