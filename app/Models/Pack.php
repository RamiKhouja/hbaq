<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pack extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'url',
        'description',
        'price',
        'discount_price',
        'discount_percentage',
        'start_date',
        'end_date',
        'is_new',
        'is_featured',
        'stock',
        'main_image',
        'weight',
    ];

    public $translatable = ['name', 'description'];

    protected $casts = [
        'name' => 'json',
        'description' => 'json',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
        'is_new' => 'boolean',
        'is_featured' => 'boolean',
        'stock' => 'integer',
        'weight' => 'decimal:2',
    ];

    protected $appends = [
        'price_after_discount',
        'is_discount',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'pack_products')
            ->withPivot(['weight', 'quantity'])
            ->withTimestamps();
    }

    public function pictures()
    {
        return $this->hasMany(Picture::class)->orderBy('order');
    }

    public function getPriceAfterDiscountAttribute()
    {
        return $this->hasActiveDiscount() ? $this->discount_price : $this->price;
    }

    public function getIsDiscountAttribute(): bool
    {
        return $this->hasActiveDiscount();
    }

    private function hasActiveDiscount(): bool
    {
        if (!$this->discount_price || $this->discount_price <= 0) {
            return false;
        }

        $today = now()->toDateString();

        return (!$this->start_date || $this->start_date->toDateString() <= $today)
            && (!$this->end_date || $this->end_date->toDateString() >= $today);
    }
}
