<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ceo extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'name',
        'image',
        'paragraph_1',
        'paragraph_2'
    ];

    public $translatable = ['title', 'name', 'paragraph_1', 'paragraph_2'];

    protected $casts = [
        'title' => 'json',
        'title' => 'json',
        'name' => 'json',
        'paragraph_1' => 'json',
        'paragraph_2' => 'json'
    ];
}

