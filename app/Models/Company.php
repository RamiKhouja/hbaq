<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'mf',
        'mf_image',
        'logo',
        'role',
        'company_group_id',
    ];

    protected $casts = [
        'name' => 'json',
        'mf' => 'json',
    ];
    
    public $translatable = ['name'];
 
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }
}
