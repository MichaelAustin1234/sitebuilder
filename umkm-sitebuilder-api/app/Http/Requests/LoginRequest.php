<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Semua user boleh login — tidak perlu cek authorization.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi untuk login.
     */
    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Pesan error dalam Bahasa Indonesia.
     */
    public function messages(): array
    {
        return [
            'email.required'    => 'Email wajib diisi.',
            'email.email'       => 'Format email tidak valid.',
            'password.required' => 'Password wajib diisi.',
        ];
    }
}

