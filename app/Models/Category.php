<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'image', 'parent_id',
        'url', 'menu_show', 'type',
        'short_description', 'description'
    ];

    protected $casts = [
        'name' => 'json',
        'short_description' => 'json',
        'description' => 'json'
    ];
    
    public $translatable = ['name', 'short_description', 'description'];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_categories', 'category_id', 'product_id');
    }
}
