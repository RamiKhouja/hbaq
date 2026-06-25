<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'main_image', 'url', 'category_id',
        'description', 'is_new', 'is_featured', 'unit', 'stock',
    ];

    public $translatable = ['name', 'description'];

    protected $casts = [
        'name' => 'json',
        'description' => 'json',
        'stock' => 'decimal:2',
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
}
