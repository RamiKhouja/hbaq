<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'main_image', 'url', 'category_id',
        'description', 'is_new', 'is_featured', 'is_season', 'unit', 'stock',
    ];

    public $translatable = ['name', 'description'];

    protected $casts = [
        'name' => 'json',
        'description' => 'json',
        'is_new' => 'boolean',
        'is_featured' => 'boolean',
        'is_season' => 'boolean',
        'stock' => 'decimal:2',
    ];

    protected $appends = [
        'price',
        'price_after_discount',
        'is_discount',
        'discount_percentage',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories', 'product_id', 'category_id');
    }

    public function pictures()
    {
        return $this->hasMany(Picture::class)->orderBy('order');
    }

    public function options()
    {
        return $this->belongsToMany(AttOption::class, 'product_options', 'product_id', 'option_id');
    }

    public function prices(): HasMany
    {
        return $this->hasMany(ProductPrice::class);
    }

    public function getPriceAttribute()
    {
        return $this->displayPriceOption()?->price ?? 0;
    }

    public function getPriceAfterDiscountAttribute()
    {
        $priceOption = $this->displayPriceOption();

        if ($this->priceOptionHasActiveDiscount($priceOption)) {
            return $priceOption->discount_price;
        }

        return $priceOption?->price ?? 0;
    }

    public function getIsDiscountAttribute()
    {
        return $this->priceOptionHasActiveDiscount($this->displayPriceOption());
    }

    public function getDiscountPercentageAttribute()
    {
        $priceOption = $this->displayPriceOption();

        if (!$this->priceOptionHasActiveDiscount($priceOption)) {
            return 0;
        }

        if ($priceOption->discount_percentage) {
            return $priceOption->discount_percentage;
        }

        if ($priceOption->price > 0) {
            return round((($priceOption->price - $priceOption->discount_price) / $priceOption->price) * 100, 2);
        }

        return 0;
    }

    private function displayPriceOption()
    {
        $prices = $this->relationLoaded('prices')
            ? $this->prices
            : $this->prices()->orderBy('min_qty')->get();

        return $prices->sortBy('min_qty')->first();
    }

    private function priceOptionHasActiveDiscount($priceOption): bool
    {
        if (!$priceOption || !$priceOption->discount_price || $priceOption->discount_price <= 0) {
            return false;
        }

        $today = now()->toDateString();

        return (!$priceOption->start_date || $priceOption->start_date <= $today)
            && (!$priceOption->end_date || $priceOption->end_date >= $today);
    }
}
