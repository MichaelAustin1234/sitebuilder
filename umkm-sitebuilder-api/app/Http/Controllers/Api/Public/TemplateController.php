<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\JsonResponse;

class TemplateController extends Controller
{
    /**
     * GET /api/v1/public/templates
     * Kembalikan semua template yang aktif.
     */
    public function index(): JsonResponse
    {
        $templates = Template::active()
            ->orderBy('id')
            ->get(['id', 'name', 'slug', 'description', 'thumbnail_url']);

        return response()->json([
            'success' => true,
            'message' => 'Daftar template berhasil diambil.',
            'data'    => ['templates' => $templates],
        ]);
    }
}
