<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Semua user boleh register — tidak perlu cek authorization.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi untuk registrasi.
     *
     * password:confirmed → butuh field `password_confirmation` yang sama
     * password:min:8     → minimum 8 karakter
     */
    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    /**
     * Pesan error dalam Bahasa Indonesia.
     */
    public function messages(): array
    {
        return [
            'name.required'          => 'Nama wajib diisi.',
            'name.max'               => 'Nama maksimal 255 karakter.',
            'email.required'         => 'Email wajib diisi.',
            'email.email'            => 'Format email tidak valid.',
            'email.unique'           => 'Email sudah terdaftar.',
            'password.required'      => 'Password wajib diisi.',
            'password.min'           => 'Password minimal 8 karakter.',
            'password.confirmed'     => 'Konfirmasi password tidak cocok.',
        ];
    }
}

