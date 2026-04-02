<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\UmkmSite;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register user baru dan kembalikan token.
     *
     * POST /api/v1/auth/register
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Auto-create UmkmSite agar semua fitur dashboard langsung bisa diakses.
        // Tanpa record ini, ProductPolicy & semua policy lain menolak dengan 403.
        $base    = Str::slug($request->name);
        $slug    = $base;
        $counter = 2;
        while (UmkmSite::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        UmkmSite::create([
            'user_id'  => $user->id,
            'name'     => $request->name,
            'slug'     => $slug,
            'category' => 'lainnya',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil.',
            'data'    => [
                'user'         => $user,
                'access_token' => $token,
                'token_type'   => 'Bearer',
            ],
        ], 201);
    }

    /**
     * Login user dan kembalikan token.
     *
     * POST /api/v1/auth/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        if (! Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
                'data'    => null,
            ], 401);
        }

        /** @var User $user */
        $user  = Auth::user();

        // Auto-create UmkmSite untuk user lama yang belum punya toko
        // (user yang daftar sebelum fix di register() diterapkan).
        if (! $user->site) {
            $base    = Str::slug($user->name);
            $slug    = $base ?: 'toko-' . $user->id;
            $counter = 2;
            while (UmkmSite::where('slug', $slug)->exists()) {
                $slug = "{$base}-{$counter}";
                $counter++;
            }
            UmkmSite::create([
                'user_id'  => $user->id,
                'name'     => $user->name,
                'slug'     => $slug,
                'category' => 'lainnya',
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data'    => [
                'user'         => $user,
                'access_token' => $token,
                'token_type'   => 'Bearer',
            ],
        ]);
    }

    /**
     * Logout — hapus semua token milik user yang sedang login.
     *
     * POST /api/v1/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
            'data'    => null,
        ]);
    }

    /**
     * Kembalikan data user yang sedang login.
     *
     * GET /api/v1/auth/me
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Data user berhasil diambil.',
            'data'    => [
                'user' => $request->user(),
            ],
        ]);
    }
}

