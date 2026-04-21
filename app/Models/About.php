<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'short_description',
        'image',
        'paragraph_1',
        'title_2',
        'paragraph_2',
        'picture_1',
        'picture_2',
        'picture_3',
        'picture_4',
        'picture_5',
    ];

    public $translatable = ['title', 'short_description', 'paragraph_1', 'paragraph_2'];

    protected $casts = [
        'title' => 'json',
        'short_description' => 'json',
        'paragraph_1' => 'json',
        'paragraph_2' => 'json'
    ];
}

