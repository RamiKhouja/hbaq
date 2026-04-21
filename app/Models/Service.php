<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name','image','url','description', 'show_in_home'
    ];

    public $translatable = ['name', 'description'];

    protected $casts = [
        'name' => 'json',
        'description' => 'json'
    ];

    public function requests()
    {
        return $this->belongsToMany(Request::class, 'services_requests');
    }
}
