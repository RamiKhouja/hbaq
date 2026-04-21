<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'main_image', 'url', 'category_id','ingredients',
        'price', 'description', 'is_new', 'is_featured', 'instructions',
        'is_discount', 'discount_price', 'discount_percentage', 'weight',
        'discount_start', 'discount_end', 'unit', 'price_after_discount'
    ];

    public $translatable = ['name', 'description', 'ingredients', 'instructions'];

    protected $casts = [
        'name' => 'json',
        'description' => 'json',
        'ingredients' => 'json',
        'instructions' => 'json'
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
}
