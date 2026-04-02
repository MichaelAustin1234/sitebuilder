<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class CloudinaryService
{
    private ?Cloudinary $cloudinary = null;

    public function __construct()
    {
        $config = config('services.cloudinary');

        // Hanya inisialisasi Cloudinary jika semua kredensial terisi
        if (
            ! empty($config['cloud_name']) &&
            ! empty($config['api_key']) &&
            ! empty($config['api_secret'])
        ) {
            try {
                $configuration = Configuration::instance([
                    'cloud' => [
                        'cloud_name' => $config['cloud_name'],
                        'api_key'    => $config['api_key'],
                        'api_secret' => $config['api_secret'],
                    ],
                    'url' => [
                        'secure' => $config['secure'] ?? true,
                    ],
                ]);

                $this->cloudinary = new Cloudinary($configuration);
            } catch (\Throwable) {
                // Gagal inisialisasi — akan fallback ke local storage
                $this->cloudinary = null;
            }
        }
    }

    /**
     * Upload file ke Cloudinary, atau fallback ke local storage jika gagal.
     *
     * @param  UploadedFile  $file    File yang diupload
     * @param  string        $folder  Folder tujuan (mis: "umkm/logos")
     * @return array{secure_url: string, public_id: string}
     *
     * @throws RuntimeException
     */
    public function upload(UploadedFile $file, string $folder = 'umkm/logos'): array
    {
        // Coba Cloudinary terlebih dahulu
        if ($this->cloudinary !== null) {
            try {
                $result = $this->cloudinary->uploadApi()->upload(
                    $file->getRealPath(),
                    [
                        'folder'          => $folder,
                        'resource_type'   => 'image',
                        'allowed_formats' => ['jpg', 'jpeg', 'png', 'webp'],
                        'quality'         => 'auto',
                        'fetch_format'    => 'auto',
                    ]
                );

                return [
                    'secure_url' => (string) $result['secure_url'],
                    'public_id'  => (string) $result['public_id'],
                ];
            } catch (\Throwable $e) {
                // Log peringatan dan lanjut ke local storage
                logger()->warning('Cloudinary upload gagal, fallback ke local storage.', [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Fallback: simpan ke local storage Laravel (storage/app/public/)
        return $this->uploadToLocal($file, $folder);
    }

    /**
     * Simpan file ke local disk (storage/app/public/{folder}/).
     *
     * @return array{secure_url: string, public_id: string}
     * @throws RuntimeException
     */
    private function uploadToLocal(UploadedFile $file, string $folder): array
    {
        try {
            $ext      = $file->getClientOriginalExtension() ?: 'jpg';
            $filename = Str::uuid() . '.' . $ext;
            $path     = $folder . '/' . $filename; // mis: "umkm/logos/uuid.jpg"

            Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));

            $url = config('app.url') . '/storage/' . $path;

            return [
                'secure_url' => $url,
                'public_id'  => $path,
            ];
        } catch (\Throwable $e) {
            throw new RuntimeException('Gagal menyimpan gambar: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Hapus gambar dari Cloudinary berdasarkan public_id.
     *
     * @param  string  $publicId  Public ID gambar (mis: "umkm/logos/abc123")
     * @return bool
     */
    public function delete(string $publicId): bool
    {
        // Jika menggunakan local storage, hapus file dari disk
        if ($this->cloudinary === null) {
            try {
                return Storage::disk('public')->delete($publicId);
            } catch (\Throwable) {
                return false;
            }
        }

        try {
            $result = $this->cloudinary->uploadApi()->destroy($publicId, [
                'resource_type' => 'image',
            ]);

            return ($result['result'] ?? '') === 'ok';
        } catch (\Throwable $e) {
            // Log tapi jangan lempar exception — gambar lama mungkin sudah tidak ada
            logger()->warning('Gagal menghapus gambar Cloudinary.', [
                'public_id' => $publicId,
                'error'     => $e->getMessage(),
            ]);

            return false;
        }
    }
}

