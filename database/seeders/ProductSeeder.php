<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ProductSeeder extends Seeder
{
    /**
     * Seed the initial grocery catalogue.
     *
     * Image download links and matching destination filenames are documented in
     * docs/seed-product-images.md. Running this seeder again updates the seeded
     * products and prices instead of creating duplicates.
     */
    public function run(): void
    {
        $products = $this->products();
        $categoryIds = collect($products)->pluck('category_id')->unique()->values();
        $missingCategoryIds = $categoryIds->diff(Category::whereIn('id', $categoryIds)->pluck('id'));

        if ($missingCategoryIds->isNotEmpty()) {
            throw new RuntimeException(
                'ProductSeeder requires category IDs: '.$missingCategoryIds->implode(', ')
            );
        }

        DB::transaction(function () use ($products): void {
            foreach ($products as $data) {
                $price = $data['price'];
                $categoryId = $data['category_id'];
                unset($data['price'], $data['category_id']);

                $product = Product::updateOrCreate(
                    ['url' => $data['url']],
                    $data
                );

                $product->categories()->syncWithoutDetaching([$categoryId]);
                $product->prices()->updateOrCreate(
                    ['min_qty' => 1, 'max_qty' => 1],
                    $price
                );
            }
        });
    }

    private function products(): array
    {
        return [
            // Fruits (category 16)
            $this->product(16, 'Apple', 'Pomme', 'تفاح', 'apple', 4.90, 120, 'kg', 'apple.jpg', true, false, 4.20, 14),
            $this->product(16, 'Banana', 'Banane', 'موز', 'banana', 6.20, 95, 'kg', 'banana.jpg', false, false, null, null, true),
            $this->product(16, 'Orange', 'Orange', 'برتقال', 'orange', 3.80, 140, 'kg', 'orange.jpg', true, true, 3.20, 16),
            $this->product(16, 'Strawberry', 'Fraise', 'فراولة', 'strawberry', 12.50, 45, '500 g box', 'strawberry.png', true, true),
            $this->product(16, 'Pear', 'Poire', 'إجاص', 'pear', 7.40, 70, 'kg', 'pear.jpg'),

            // Vegetables (category 17)
            $this->product(17, 'Tomato', 'Tomate', 'طماطم', 'tomato', 3.60, 180, 'kg', 'tomato.png', true, true, 2.95, 18),
            $this->product(17, 'Carrot', 'Carotte', 'جزر', 'carrot', 3.20, 110, 'kg', 'carrot.png'),
            $this->product(17, 'Cucumber', 'Concombre', 'خيار', 'cucumber', 4.10, 90, 'kg', 'cucumber.png', false, true),
            $this->product(17, 'Bell Pepper', 'Poivron', 'فلفل حلو', 'bell-pepper', 8.90, 65, 'kg', 'bell-pepper.png', true, false, 7.50, 16),
            $this->product(17, 'Eggplant', 'Aubergine', 'باذنجان', 'eggplant', 4.80, 75, 'kg', 'eggplant.png'),

            // Herbs and greens (category 18)
            $this->product(18, 'Basil', 'Basilic', 'حبق', 'basil', 1.80, 55, 'bunch', 'basil.png', true, true),
            $this->product(18, 'Parsley', 'Persil', 'معدنوس', 'parsley', 1.20, 80, 'bunch', 'parsley.png', false, false, 0.95, 21),
            $this->product(18, 'Mint', 'Menthe', 'نعناع', 'mint', 1.50, 75, 'bunch', 'mint.png', true),
            $this->product(18, 'Rosemary', 'Romarin', 'إكليل الجبل', 'rosemary', 2.40, 40, 'bunch', 'rosemary.png', false, true),
            $this->product(18, 'Garlic', 'Ail', 'ثوم', 'garlic', 9.50, 60, 'kg', 'garlic.png', false, false, 8.25, 13),

            // Organic products (category 19)
            $this->product(19, 'Organic Olives', 'Olives bio', 'زيتون عضوي', 'organic-olives', 11.90, 50, '500 g jar', 'organic-olives.png', true, true),
            $this->product(19, 'Organic Honey', 'Miel bio', 'عسل عضوي', 'organic-honey', 24.90, 35, '500 g jar', 'organic-honey.png', true, false, 21.90, 12),
            $this->product(19, 'Organic Eggs', 'Œufs bio', 'بيض عضوي', 'organic-eggs', 8.50, 70, 'box of 6', 'organic-eggs.png'),
            $this->product(19, 'Organic Dates', 'Dattes bio', 'تمور عضوية', 'organic-dates', 16.90, 45, 'kg', 'organic-dates.png', true, true, 14.50, 14),
            $this->product(19, 'Organic Couscous', 'Couscous bio', 'كسكسي عضوي', 'organic-couscous', 7.90, 85, '1 kg bag', 'organic-couscous.png'),

            // Legumes (category 20)
            $this->product(20, 'Kidney Beans', 'Haricots rouges', 'فاصوليا حمراء', 'kidney-beans', 8.40, 100, 'kg', 'kidney-beans.jpg', true, false, 7.25, 14),
            $this->product(20, 'Chickpeas', 'Pois chiches', 'حمص', 'chickpeas', 6.80, 125, 'kg', 'chickpeas.jpg', true),
            $this->product(20, 'Green Lentils', 'Lentilles vertes', 'عدس أخضر', 'green-lentils', 7.20, 115, 'kg', 'green-lentils.jpg'),
            $this->product(20, 'Green Peas', 'Petits pois', 'بازلاء', 'green-peas', 5.90, 65, 'kg', 'green-peas.jpg', false, true, 4.95, 16),
            $this->product(20, 'Peanuts', 'Cacahuètes', 'فول سوداني', 'peanuts', 10.50, 80, 'kg', 'peanuts.jpg', false, false, null, null, true),
        ];
    }

    private function product(
        int $categoryId,
        string $englishName,
        string $frenchName,
        string $arabicName,
        string $slug,
        float $price,
        float $stock,
        string $unit,
        string $image,
        bool $featured = false,
        bool $seasonal = false,
        ?float $discountPrice = null,
        ?float $discountPercentage = null,
        bool $new = false,
    ): array {
        return [
            'category_id' => $categoryId,
            'name' => ['en' => $englishName, 'fr' => $frenchName, 'ar' => $arabicName],
            'description' => [
                'en' => "Fresh {$englishName}, selected for quality and everyday use.",
                'fr' => "{$frenchName} frais, sélectionné pour sa qualité et l'usage quotidien.",
                'ar' => "{$arabicName} طازج، مختار بعناية للجودة والاستخدام اليومي.",
            ],
            'url' => $slug,
            'unit' => $unit,
            'stock' => $stock,
            'main_image' => "pictures/products/seed/{$image}",
            'is_new' => $new,
            'is_featured' => $featured,
            'is_season' => $seasonal,
            'price' => [
                'price' => $price,
                'discount_price' => $discountPrice,
                'discount_percentage' => $discountPercentage,
                'start_date' => null,
                'end_date' => null,
            ],
        ];
    }
}
