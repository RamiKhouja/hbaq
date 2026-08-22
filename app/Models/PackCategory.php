<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'image', 'parent_id', 'url', 'menu_show', 'type',
        'short_description', 'description',
    ];

    protected $casts = [
        'name' => 'json',
        'short_description' => 'json',
        'description' => 'json',
        'menu_show' => 'boolean',
    ];

    public $translatable = ['name', 'short_description', 'description'];

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function packs()
    {
        return $this->belongsToMany(Pack::class, 'pack_pack_category');
    }
}
