<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Seed 10 template (5 awal + 5 baru).
     */
    public function run(): void
    {
        $templates = [
            [
                'name'          => 'Minimalis',
                'slug'          => 'minimalist',
                'description'   => 'Desain bersih dan modern, cocok untuk semua jenis usaha. Tampilan elegan dengan warna putih dan aksen warna pilihan.',
                'thumbnail_url' => null,
                'is_active'     => true,
            ],
            [
                'name'          => 'Kuliner',
                'slug'          => 'food',
                'description'   => 'Desain hangat dan menggugah selera, dengan hero foto besar dan kartu menu yang menarik. Cocok untuk restoran, kafe, dan warung makan.',
                'thumbnail_url' => null,
                'is_active'     => true,
            ],
            [
                'name'          => 'Fashion',
                'slug'          => 'fashion',
                'description'   => 'Desain premium dengan nuansa hitam dan emas, foto produk dominan gaya lookbook. Cocok untuk toko pakaian, aksesoris, dan kecantikan.',
                'thumbnail_url' => null,
                'is_active'     => true,
            ],
            [
                'name'          => 'Profesional',
                'slug'          => 'tech',
                'description'   => 'Desain modern dan profesional dengan navbar gelap dan kartu layanan. Cocok untuk jasa digital, bengkel, laundry, salon, dan konsultasi.',
                'thumbnail_url' => null,
                'is_active'     => true,
            ],
            [
                'name'          => 'Alam & Organik',
                'slug'          => 'nature',
                'description'   => 'Desain hangat bernuansa krem dan hijau earthy. Cocok untuk produk herbal, pertanian, wellness, makanan sehat, dan tanaman.',
                'thumbnail_url' => null,
                'is_active'     => true,
            ],
            [
                'name'          => 'Kedai Kopi',
                'slug'          => 'cafe',
                'description'   => 'Desain gelap nan hangat dengan nuansa amber dan cokelat. Sempurna untuk coffee shop, kedai kopi, roastery, dan dessert café.',
                'thumbnail_url' => null,
                'is_active'     => true,
            ],
            [
                'name'          => 'Kecantikan & Spa',
                'slug'          => 'beauty',
                'description'   => 'Desain elegan feminim dengan palet rose gold dan pink blush. Cocok untuk salon, spa, skincare, nail art, dan perawatan diri.',
                'thumbnail_url' => null,
                'is_active'     => true,
            ],
            [
                'name'          => 'Warung Lokal',
                'slug'          => 'warung',
                'description'   => 'Desain hangat bernuansa merah bata dan kuning kunyit dengan daftar menu yang jelas. Cocok untuk warung makan, depot, dan masakan rumahan.',
                'thumbnail_url' => null,
                'is_active'     => true,
            ],
            [
                'name'          => 'Marketplace',
                'slug'          => 'market',
                'description'   => 'Desain marketplace modern dengan filter kategori interaktif dan grid produk bersih. Cocok untuk toko serba ada dan online shop.',
                'thumbnail_url' => null,
                'is_active'     => true,
            ],
            [
                'name'          => 'Kerajinan Tangan',
                'slug'          => 'craft',
                'description'   => 'Desain rustic artisan dengan nuansa cokelat tanah dan krem alami. Cocok untuk kerajinan tangan, batik, anyaman, pottery, dan produk tradisional.',
                'thumbnail_url' => null,
                'is_active'     => true,
            ],
        ];

        foreach ($templates as $template) {
            Template::updateOrCreate(
                ['slug' => $template['slug']],
                $template
            );
        }
    }
}
