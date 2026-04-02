<?php

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Validasi gagal → 422 dengan format standar {success, message, data}
        $exceptions->render(function (ValidationException $e): JsonResponse {
            return response()->json([
                'success' => false,
                'message' => 'Data yang dikirim tidak valid.',
                'data'    => [
                    'errors' => $e->errors(),
                ],
            ], 422);
        });

        // Unauthenticated → 401 dengan format standar
        $exceptions->render(function (AuthenticationException $_e): JsonResponse {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum login atau sesi telah berakhir.',
                'data'    => null,
            ], 401);
        });

        // Unauthorized (policy gagal) → 403 dengan format standar
        $exceptions->render(function (AuthorizationException $_e): JsonResponse {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke resource ini.',
                'data'    => null,
            ], 403);
        });
    })->create();
