<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Company extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'phone', 'rn', 'vat', 'cr_image', 'vat_image'
    ];

    protected $casts = [
        'name' => 'json',
       
    ];
    
    public $translatable = ['name'];
 
    function users() : HasMany {
        return $this->hasMany(User::class);
    }

    
}
